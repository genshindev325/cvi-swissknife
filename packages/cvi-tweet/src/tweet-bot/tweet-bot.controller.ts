import { Controller, Get, Header, HttpStatus, Inject, Query, Res } from '@nestjs/common'
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger'
import type { FastifyReply } from 'fastify'
import { createReadStream } from 'fs'
import { TweetBotService } from './tweet-bot.service'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import type { Logger } from 'winston'

@ApiTags(`Tweet`)
@Controller('/tweet')
export class TweetBotController {
  constructor(
    @Inject(TweetBotService) private readonly tweetBotService: TweetBotService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {
    console.log(`a`)
  }

  @Get('/tweet-now')
  @ApiOperation({ description: 'Tweet now' })
  @ApiResponse({
    status: HttpStatus.OK || HttpStatus.SERVICE_UNAVAILABLE,
    description: 'Tweet now',
  })
  async tweetNow(@Res() response: FastifyReply) {
    await this.tweetBotService.issueCVITweet()
  }

  @Get('/take-screenshot')
  @ApiOperation({ description: 'Take screenshot of CVI.finance and return image' })
  @ApiResponse({
    status: HttpStatus.OK || HttpStatus.SERVICE_UNAVAILABLE,
    description: 'Take screenshot of CVI.finance and return image',
  })
  @ApiQuery({
    name: 'width',
    type: Number,
    description: 'Screenshot width. Optional',
    required: false,
  })
  @ApiQuery({
    name: 'height',
    type: Number,
    description: 'Screenshot height. Optional',
    required: false,
  })
  @ApiQuery({
    name: 'deviceScaleFactor',
    type: Number,
    description: 'Screenshot deviceScaleFactor. Optional',
    required: false,
  })
  @Header('Content-Type', 'image/png')
  @Header('Content-Disposition', 'attachment; filename=testPage.png')
  async isReady(
    @Res() response: FastifyReply,
    @Query('width') width?: number,
    @Query('height') height?: number,
    @Query('deviceScaleFactor') deviceScaleFactor?: number,
  ) {
    this.logger.info(
      `Received request to take a screen-shot. width: ${width}, height: ${height}, deviceScaleFactor: ${deviceScaleFactor}`,
    )

    const options: { width?: number; height?: number; deviceScaleFactor?: number } = {
      width,
      height,
      deviceScaleFactor,
    }
    const pathToScreenshot = await this.tweetBotService.takeCVIFinanceScreenshot(options)

    this.logger.info(`pathToScreenshot: ${pathToScreenshot}`)

    const vv = createReadStream(pathToScreenshot!)
    response.type('image/png').send(vv)
  }
}
