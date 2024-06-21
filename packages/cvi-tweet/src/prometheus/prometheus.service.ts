import type { OnModuleDestroy } from '@nestjs/common'
import { collectDefaultMetrics, Counter, Gauge, Registry } from 'prom-client'

export class PrometheusService implements OnModuleDestroy {
  public readonly registry = new Registry()

  constructor() {
    collectDefaultMetrics({ prefix: 'cvitweet__', register: this.registry })
  }

  async onModuleDestroy() {
    // to stop any async operations when prometheus call us to get new metrics
    this.registry.clear()
  }

  public readonly tweetCountTotal = new Counter({
    name: `tweets_count_total`,
    help: 'how many times we had tweeted',
    registers: [this.registry],
  })

  public readonly tweetsEnabled = new Gauge({
    name: `tweets_enabled`,
    help: 'true/false if to actually make tweets',
    registers: [this.registry],
  })

  public readonly maxTweetsPer24hrs = new Gauge({
    name: `maximum_tweets_per_24hrs`,
    help: 'maximum tweets per 24hrs to make',
    registers: [this.registry],
  })

  public readonly minMinutesBetweenTweets = new Gauge({
    name: `minimum_minutes_between_tweets`,
    help: 'minimum number of minutes between to consecutive tweets',
    registers: [this.registry],
  })

  public async getMetrics() {
    return this.registry.metrics()
  }
}
