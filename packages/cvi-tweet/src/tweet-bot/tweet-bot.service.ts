import type { OnModuleDestroy } from '@nestjs/common'
import { Inject } from '@nestjs/common'

import type { PrometheusService } from '../prometheus/prometheus.service'
import { BackendEnvironment, getCviOracleEventsBackend, NetworkName } from '@coti-cvi/lw-sdk'
import type { Logger } from 'winston'
import axios from 'axios'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import type { CviTweetConfig } from '@coti-cvi/common-be'

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { SentryService } from '@coti-cvi/common-be'
import puppeteer from 'puppeteer'
import type { TTweetv2Expansion, TTweetv2TweetField, TTweetv2UserField, TweetV2 } from 'twitter-api-v2'
import Twitter from 'twitter-api-v2'
import { Cron, CronExpression } from '@nestjs/schedule'
import { join } from 'path'
import moment from 'moment'
export class TweetBotService implements OnModuleDestroy {
  private lastTask?: Promise<void>

  private informInterestingTweetsEveryXMinutes = 180

  private lastTimeInformingOfInterestingTweets: Date | undefined = undefined

  private latestTweetTimestamp: Date | undefined = undefined

  private readonly cleanup: () => Promise<void>

  private alreadyInformedTweetsAndRetweets = new Set<string>()

  private readonly reportMetricsTask: NodeJS.Timeout | undefined = undefined

  private twitterOptions

  constructor(
    @Inject('PrometheusServiceToken') private readonly prometheusService: PrometheusService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    @Inject(SentryService) private readonly sentryService: SentryService,
    @Inject('ConfigToken') readonly config: CviTweetConfig,
  ) {
    this.twitterOptions = {
      appKey: this.config.serviceConfig.twitter.appKey,
      appSecret: this.config.serviceConfig.twitter.appSecret,
      accessToken: this.config.serviceConfig.twitter.accessToken,
      accessSecret: this.config.serviceConfig.twitter.accessSecret,
    }

    logger.info(
      `Tweeting Enabled? ${this.config.serviceConfig.enableTweeting} [maxTweetsIn24hrs? ${this.config.serviceConfig.maxTweetsIn24hrs}]`,
    )
    logger.info(
      `Find & Inform Interesting tweets: ${this.config.serviceConfig.interestingTweets
        .map(t => t.enableTweetsInform)
        .join(`, `)} [Interval: ${this.informInterestingTweetsEveryXMinutes} mins.]`,
    )

    this.cleanup = async () => {
      await this.lastTask
    }
    const ii = async () => {
      await this.reportMetrics()
    }
  }

  @Cron('0 0 11 * * *', {
    name: 'tweeting',
    timeZone: 'Asia/Jerusalem',
  })
  private async triggerTweeting() {
    await this.issueCVITweet()
  }

  private getMinutesDiff(startDate: Date, endDate: Date) {
    const msInMinute = 1000 * 60
    return Math.round(Math.abs(endDate.getTime() - startDate.getTime()) / msInMinute)
  }

  @Cron(CronExpression.EVERY_30_SECONDS)
  private async triggerFindInterestingTweets() {
    this.logger.debug(`triggerFindInterestingTweets trigger...`)
    let findInterestingTweets = false

    if (this.config.serviceConfig.interestingTweets.some(t => t.enableTweetsInform)) {
      if (this.lastTimeInformingOfInterestingTweets === undefined) {
        findInterestingTweets = true
      } else {
        // calc difference last run and current time
        const now = new Date()
        const minutesDiff = this.getMinutesDiff(this.lastTimeInformingOfInterestingTweets, now)
        this.logger.debug(
          `minutesDiff: ${minutesDiff}; minutesDiff >= this.informInterestingTweetsEveryXHours = ${minutesDiff} >= ${
            this.informInterestingTweetsEveryXMinutes
          }; prevTime: ${this.lastTimeInformingOfInterestingTweets.toISOString()}, now: ${now.toISOString()}`,
        )
        if (minutesDiff >= this.informInterestingTweetsEveryXMinutes) {
          this.logger.info(`Run findInterestingTweets() now [minutesDiff: ${minutesDiff} mins.]`)
          findInterestingTweets = true
        } else {
          this.logger.debug(`Not yet time to run findInterestingTweets() minutesDiff: ${minutesDiff} mins.`)
        }
      }
    }

    if (findInterestingTweets) {
      this.logger.info(`find_interesting_tweets executing...`)

      this.lastTimeInformingOfInterestingTweets = new Date()
      await this.findInterestingTweets()
    }
  }

  private async getTweetURL(tweet: TweetV2): Promise<string> {
    let username
    if (tweet.author_id) {
      username = await this.getTweeterUserInfo(tweet.author_id)
      return `https://twitter.com/${username}/status/${tweet.id}`
    } else {
      return `https://twitter.com/CryptoJohnny321/status/${tweet.id}`
    }
  }

  private async getTweeterUserInfo(user_id: string): Promise<string> {
    const client = new Twitter(this.twitterOptions)

    const getUserInfo = await client.v1.users({ user_id })

    return getUserInfo[0].screen_name
  }

  private isSearchTermWordsFoundInText(tweetText: string, searchTerm: string) {
    const vWordInSearchTermLowerCase = searchTerm.split(' ').map(t => t.replaceAll('"', '').toLowerCase())
    const cleanedTweetLowerCase = tweetText.toLowerCase()

    const isEvery = vWordInSearchTermLowerCase.every(item => cleanedTweetLowerCase.includes(item))

    console.log(
      `isEvery: ${isEvery}
vWordInSearchTermLowerCase: ${vWordInSearchTermLowerCase.join(`, `)} will search inside: ${cleanedTweetLowerCase}`,
    )
    return isEvery
  }

  private async eligibleTweet(
    tweet: TweetV2,
    thresholds:
      | {
          retweet_count: number
          like_count: number
          quote_count: number
        }
      | undefined,
    termFoundString: string,
  ) {
    const retweetOf: string | undefined = tweet.referenced_tweets?.filter(v => v.type === 'retweeted').map(x => x.id)[0]

    const alreadySeen = this.alreadyInformedTweetsAndRetweets.has(tweet.id)
    const alreadySeenAnotherRetweet =
      retweetOf === undefined ? false : this.alreadyInformedTweetsAndRetweets.has(retweetOf)

    const eligibleTweet = !alreadySeen && !alreadySeenAnotherRetweet

    const isTermsFoundInsideTweetText = this.isSearchTermWordsFoundInText(tweet.text, termFoundString)

    const eligibleTweetByThresholds =
      thresholds === undefined ||
      (tweet.public_metrics &&
        (tweet.public_metrics?.retweet_count >= thresholds.retweet_count ||
          tweet.public_metrics?.like_count >= thresholds.like_count ||
          tweet.public_metrics?.quote_count >= thresholds.quote_count))

    const totalEligible = eligibleTweet && eligibleTweetByThresholds && isTermsFoundInsideTweetText

    this.logger.info(
      `${await this.getTweetURL(
        tweet,
      )} - isTermsFoundInsideTweetText: ${isTermsFoundInsideTweetText}; totalEligible: ${totalEligible} (Found under "${termFoundString}")`,
    )
    return totalEligible
  }

  // splits a list of tweet texts into as smaller as possible batch of few telegram messages
  private async batchTelegramSend(
    telegramChatId: string,
    tweetsArray: { tweet: TweetV2; foundUnderTerm: string }[],
    fromDate: Date,
    allTwitterSearchTerms: string[],
    countTotalTweetsFoundAllKeywords: number,
  ) {
    let batchString = ''
    const TELEGRAM_MSG_MAX_CHARS = 4096 - 96

    if (tweetsArray.length) {
      this.logger.info(
        `Have ${tweetsArray.length} tweet/s to send in this batch (allTwitterSearchTerms: ${allTwitterSearchTerms.join(
          ', ',
        )}, telegramChatId: ${telegramChatId})`,
      )
      let i = 1
      let batchCount = 1 // how many messages in telegram for this Batch
      let currentBatchSingleMsgCount = 0
      for (const { tweet, foundUnderTerm } of tweetsArray) {
        const message: string = await this.singleTweetToTelegramString(tweet, foundUnderTerm)

        const nowMessage = `${batchString.length ? `\n\n` : ``}${i}/${tweetsArray.length} - ${message}\n\n-------------`
        if (batchString.length + nowMessage.length < TELEGRAM_MSG_MAX_CHARS) {
          batchString = `${batchString}${nowMessage}`
          currentBatchSingleMsgCount++
        } else {
          const success = await this.telegramSend(telegramChatId, batchString)

          this.logger.info(
            `${
              success ? 'Successfully informed' : 'Failed informing'
            } of #${batchCount} batch containing ${currentBatchSingleMsgCount} tweet/s out of ${
              tweetsArray.length
            } tweet/s (${batchString.length} chars batch size). see below:\n${batchString.slice(0, 200)}\n==========\n`,
          )
          batchCount++
          batchString = `${nowMessage}`
          currentBatchSingleMsgCount = 1
          await new Promise(resolve => setTimeout(resolve, 10_000))
        }
        i++
      }

      const finalSummary = `NOTE: Finished informing of #${tweetsArray.length} relevant tweets (${
        tweetsArray.length
      } / ${countTotalTweetsFoundAllKeywords} = ${(
        (tweetsArray.length / countTotalTweetsFoundAllKeywords) *
        100
      ).toFixed(2)}% of tweets were relevant) (searched keywords: ${allTwitterSearchTerms.join(
        ', ',
      )}) using #${batchCount} distinct message/s included in this batch. These tweets were made AFTER ${this.getIsraelFormattedDateTimeFromDateString(
        fromDate.toISOString(),
      )} (last ${this.informInterestingTweetsEveryXMinutes / 60} hrs). Next informant is in ${
        this.informInterestingTweetsEveryXMinutes / 60
      } hrs of any new tweets made.\nBelow are found tweets per keyword searched:\n${this.getSummaryTweetsPerTerm(
        tweetsArray,
      )}`

      if (batchString.length) {
        if (batchString.length + finalSummary.length < TELEGRAM_MSG_MAX_CHARS) {
          await this.telegramSend(telegramChatId, `${batchString}\n\n${finalSummary}`)
        } else {
          await this.telegramSend(telegramChatId, batchString)

          await this.telegramSend(telegramChatId, finalSummary)
        }
      }
    }
  }

  private async findInterestingTweets() {
    const opt = {
      appKey: this.config.serviceConfig.twitter.appKey,
      appSecret: this.config.serviceConfig.twitter.appSecret,
      accessToken: this.config.serviceConfig.twitter.accessToken,
      accessSecret: this.config.serviceConfig.twitter.accessSecret,
    }
    const client = new Twitter(opt)

    const fromDate = new Date(Date.now() - 60 * 1_000 * this.informInterestingTweetsEveryXMinutes)

    // YYYY-MM-DDTHH:mm:ssZ (ISO 8601/RFC 3339).
    // "2022-12-28T15:44:30.003Z" -> "2022-12-28T15:47:00Z"
    // The oldest UTC timestamp from which the Tweets will be provided. Timestamp is in second granularity and is inclusive (for example, 12:00:01 includes the first second of the minute). By default, a request will return Tweets from up to 30 days ago if you do not include this parameter.
    const start_time: string = fromDate.toISOString().split('.')[0] + 'Z'

    const tweetFields: TTweetv2TweetField[] = [
      'created_at',
      'referenced_tweets',
      'public_metrics',
      'lang',
      'in_reply_to_user_id',
    ]
    const expansions: TTweetv2Expansion[] = ['author_id']
    const userFields: TTweetv2UserField[] = ['username', 'description', 'created_at']
    this.logger.info(
      `searching for tweets with start_time: ${start_time} (i.e: ${this.informInterestingTweetsEveryXMinutes} mins. ago)`,
    )
    let tweetsArr: { tweet: TweetV2; foundUnderTerm: string }[] = []

    for (const [
      iTelegramGroupIndex,
      specificGroupTelegramInform,
    ] of this.config.serviceConfig.interestingTweets.entries()) {
      if (iTelegramGroupIndex > 0) {
        this.logger.info(`moving into new telegram group (wait 60s and resetting tweetsArray)`)
        await new Promise(resolve => setTimeout(resolve, 60_000 * 15))
      }
      tweetsArr = []
      let countTotalTweetsFoundAllKeywords = 0

      const { telegramChatId, searchTweets } = specificGroupTelegramInform

      for (const { term, thresholds } of searchTweets) {
        const jsTweets = await client.v2.search(Buffer.from(term, 'utf-8').toString(), {
          'tweet.fields': tweetFields,
          'media.fields': 'url',
          'user.fields': userFields,
          expansions,
          start_time: start_time,
        })

        // Consume every possible tweet of jsTweets (until rate limit is hit)
        for await (const tweet of jsTweets) {
          if (tweet.lang === 'en') {
            countTotalTweetsFoundAllKeywords++
            // check if eligible:
            // (1) thresholds (2) not-already-seen (3) term found in tweet text
            if (await this.eligibleTweet(tweet, thresholds, term)) {
              const tweetURL = await this.getTweetURL(tweet)
              this.logger.debug(
                `going over non-yet-informed tweet: ${tweetURL}, checking thresholds: retweets: ${tweet.public_metrics?.retweet_count}, likes: ${tweet.public_metrics?.like_count}, quotes: ${tweet.public_metrics?.quote_count}`,
              )

              tweetsArr.push({ tweet, foundUnderTerm: term })
              this.alreadyInformedTweetsAndRetweets.add(tweet.id)

              const retweetOf: string | undefined = tweet.referenced_tweets
                ?.filter(v => v.type === 'retweeted')
                .map(x => x.id)[0]

              if (retweetOf) {
                this.alreadyInformedTweetsAndRetweets.add(retweetOf)
              }
            } else {
              this.logger.debug(
                `tweet #${tweet.id} not relevant, either tweeted or is a retweet similar already informed or below ts`,
              )
            }
          } else {
            // NON EN tweet
            //this.logger.info(`non English ${tweet.lang}`)
          }
        }
      }
      await this.batchTelegramSend(
        telegramChatId,
        tweetsArr,
        fromDate,
        searchTweets.map(t => t.term),
        countTotalTweetsFoundAllKeywords,
      )
    } // move to next telegram group
  }

  private getSummaryTweetsPerTerm(arr: { tweet: TweetV2; foundUnderTerm: string }[]): string {
    const result = arr.reduce(function (
      r,
      a: {
        tweet: TweetV2
        foundUnderTerm: string
      },
    ) {
      // @ts-ignore
      r[a.foundUnderTerm] = (r[a.foundUnderTerm] || 0) + 1
      return r
    }, {})

    return (
      Object.keys(result)
        // @ts-ignore
        .map(key => `${key}: ${result[key]}`)
        .join('\n')
    )
  }

  // created_at is format as: "2022-12-08T10:35:15.000Z" aka  new Date().toISOString()
  private getMinutesAgo(created_at: string | undefined): number | undefined {
    if (!created_at) {
      return undefined
    }

    const start = moment.utc(created_at, 'YYYY-MM-DDTHH:mm:ss.000Z') //
    const now = moment.utc()
    const duration = moment.duration(now.diff(start))
    return Math.floor(duration.asMinutes())
  }

  private async telegramSend(telegramChatId: string, msg: string): Promise<boolean> {
    const url = `https://api.telegram.org/bot${
      this.config.serviceConfig.telegramBot.botToken
    }/sendMessage?chat_id=${telegramChatId}&text=${encodeURIComponent(msg)}`
    this.logger.debug(`telegramSend: ${url}`)
    try {
      const body = await axios.get(url)
      const { data } = body
      return true
    } catch (err) {
      this.logger.error(`Failed Telegram sending message @ ${url} - "${msg}": ${err}`)
      return false
    }
  }

  private makeWordsBold(string: string, foundUnderTerm: string): string {
    const replaceArray = foundUnderTerm.split(' ')
    const replaceArrayValue = replaceArray.map(t => t.replaceAll('"', '').replaceAll(`$`, ``)).map(t => `**${t}**`)
    let retVal = string
    for (let i = replaceArray.length - 1; i >= 0; i--) {
      const replaceThisWord = replaceArray[i]
      const regexp = new RegExp('\\b' + replaceThisWord + '\\b', 'gi')
      const replaceWith = replaceArrayValue[i]
      const currentResult = retVal.replace(regexp, replaceWith)
      retVal = currentResult
    }
    //console.log(`makeWordsBold string....: ${retVal} from ${string}`)
    return retVal
  }

  private getIsraelFormattedDateTimeFromDateString(myDateString: string | undefined) {
    const d = myDateString ? new Date(myDateString) : undefined
    if (d) {
      return `${d.toLocaleString('en-GB', {
        timeZone: 'Asia/Jerusalem',
      })} IL Time`
    }
    return ''
  }

  private async singleTweetToTelegramString(tweet: TweetV2, foundUnderTerm: string): Promise<string> {
    const vWordsInSearchTerm: string[] = foundUnderTerm.split(' ')

    const tweetURL = await this.getTweetURL(tweet)
    const tweetDate = tweet.created_at ? new Date(tweet.created_at) : undefined

    const msg = `tweet text: ${tweet.text}
tweet link: ${tweetURL}
keyword: ${foundUnderTerm}
${
  tweetDate
    ? `tweeted at: ${this.getIsraelFormattedDateTimeFromDateString(tweet.created_at)} (${this.getMinutesAgo(
        tweet.created_at,
      )}m ago)`
    : ``
}
retweet_count: ${tweet.public_metrics?.retweet_count}
like_count: ${tweet.public_metrics?.like_count}
quote_count: ${tweet.public_metrics?.quote_count}`

    return this.makeWordsBold(msg, foundUnderTerm)
  }

  // every 5s
  @Cron('*/5 * * * * *', {
    name: 'report_metrics',
  })
  private async triggerReportMetrics() {
    await this.reportMetrics()
  }

  private async reportMetrics() {
    this.prometheusService.tweetsEnabled.set(this.config.serviceConfig.enableTweeting ? 1 : 0)
    this.prometheusService.maxTweetsPer24hrs.set(this.config.serviceConfig.maxTweetsIn24hrs)
    this.prometheusService.minMinutesBetweenTweets.set(this.config.serviceConfig.minMinutesBetweenTweets)
  }

  private async makeTweet(tweetText: string, screenShotPath: string): Promise<boolean> {
    try {
      const client = new Twitter(this.twitterOptions)

      const mediaId = await client.v1.uploadMedia(screenShotPath)
      const createdTweet = await client.v1.tweet(tweetText, {
        media_ids: mediaId,
      })
      this.logger.info('Tweet', createdTweet.id_str, ':', createdTweet.full_text)

      return Promise.resolve(true)
    } catch (e) {
      this.logger.info('makeTweet threw an error', e)

      return Promise.reject(false)
    }
  }

  private async getLatestCviIndex(): Promise<string | undefined> {
    try {
      const res = await getCviOracleEventsBackend({
        backendEnvironment: BackendEnvironment.K8s,
        network: NetworkName.Mainnet,
      }).cviOracle.cviOracleApiControllerGetLatestCviIndex()

      if (res) {
        const val = res
        this.logger.info(`This is the data: ${JSON.stringify(val, null, 2)}`)
        return res.cviIndex.toFixed(2)
      }
    } catch (e) {
      console.error('Error in getLatestCviIndex', e)
    }
  }

  public getPathToImage(imgFilename: string) {
    return join(__dirname, '..', '..', 'public', imgFilename)
  }

  public async takeCVIFinanceScreenshot(options?: {
    width?: number
    height?: number
    deviceScaleFactor?: number
  }): Promise<string | undefined> {
    this.logger.info(`This is what takeCVIFinanceScreenshot received: ${JSON.stringify(options, null, 2)}`)
    const VIEWPORT = {
      width: Number(options?.width || 1200),
      height: Number(options?.height || 900),
      deviceScaleFactor: Number(options?.deviceScaleFactor || 1),
    }
    const URL = 'https://cvi.finance'

    const browser = await puppeteer.launch({
      headless: false,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-web-security',
        '--disable-features=IsolateOrigins,site-per-process',
      ],
    })

    this.logger.info(`Using VIEWPORT: ${JSON.stringify(VIEWPORT, null, 2)}`)
    const page = await browser.newPage()

    await page.setViewport(VIEWPORT)
    await page.goto(URL, { waitUntil: 'networkidle0' })

    const elementHandle = await page.$('div.TVChartContainer iframe')

    if (elementHandle) {
      const frame = await elementHandle.contentFrame()
      if (frame) {
        const linkHandlers = await frame.$x("//div[contains(text(), '3M')]")
        if (linkHandlers.length > 0) {
          await linkHandlers[0].click()
          console.log(`Successfully clicked on 3M!`)

          await page.evaluate(async () => {
            await new Promise(function (resolve) {
              setTimeout(resolve, 3000)
            })
          })

          const screenShotPath = this.getPathToImage(
            `SS.${VIEWPORT.width}x${VIEWPORT.height}.${VIEWPORT.deviceScaleFactor}.png`,
          )
          this.logger.info(`screenShotPath: ${screenShotPath}`)

          const element1 = await page.$('#cvi-chart')

          if (element1) {
            await element1.screenshot({
              path: screenShotPath,
              fullPage: false,
            })
            browser.close()
            return screenShotPath
          }
        } else {
          throw new Error('Link not found')
        }
      } else {
        throw new Error('#cvi-chart not found')
      }
    } else {
      throw new Error('Iframe not found')
    }
    browser.close()
    return undefined
  }

  private async takeScreenshotAndTweet(): Promise<boolean> {
    const screenShotPath = await this.takeCVIFinanceScreenshot()
    // Get the CVI Index value
    const latestCVI = await this.getLatestCviIndex()

    console.log(
      `in takeScreenshotAndTweet, got back with latestCVI: ${latestCVI} and screenShotPath: ${screenShotPath}`,
    )

    const TWEET_TEXT = `The Crypto Volatility Index is at ${latestCVI} 📊
 
The CVI ranges between 0-200
0-85 ≈ Low volatility
85-105 ≈ Medium volatility
105-200 ≈ High volatility
 
Trade #volatility ($CVI):
Platform 👉🏻 https://cvi.finance
Sushiswap 👉🏻 https://www.sushi.com/swap?token0=0x8096aD3107715747361acefE685943bFB427C722&token1=0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8&chainId=42161

@official_CVI
$CVI $GOVI
`

    if (screenShotPath && latestCVI) {
      if (this.config.serviceConfig.enableTweeting) {
        const diffMinutes = !this.latestTweetTimestamp
          ? 9999999
          : new Date().getSeconds() - this.latestTweetTimestamp.getSeconds()

        if (diffMinutes >= this.config.serviceConfig.minMinutesBetweenTweets) {
          const tweetMade = await this.makeTweet(TWEET_TEXT, screenShotPath)

          if (tweetMade) {
            this.logger.info(
              `Tweet [${TWEET_TEXT}] made (diffMinutes last tweet: ${diffMinutes}m): Check out account - https://twitter.com/CVIdaily`,
            )

            this.prometheusService.tweetCountTotal.inc()
            this.latestTweetTimestamp = new Date()
          } else {
            this.logger.info(`Failed Tweeting`)
            return false
          }
          return true
        } else {
          this.logger.info(
            `Tweet not made because diffMinutes last tweet: ${diffMinutes}m (<${this.config.serviceConfig.minMinutesBetweenTweets})`,
          )
        }
      } else {
        this.logger.info(`Tweeting disabled: Did not tweet: ${TWEET_TEXT} (${screenShotPath})`)
      }
    } else {
      this.logger.info('no Tweet made (either no ss or no latest value')
    }
    return false
  }

  public async issueCVITweet() {
    if (this.config.isTestMode) {
      return
    }
    const tweetMade = await this.takeScreenshotAndTweet()
    this.logger.info(`tweetMade: ${tweetMade}`)
  }

  async onModuleDestroy() {
    if (this.reportMetricsTask) {
      clearInterval(this.reportMetricsTask)
    }

    await this.cleanup()
  }
}
