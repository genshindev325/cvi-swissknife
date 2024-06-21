import { getChatGptClient, BackendEnvironment } from '@coti-cvi/lw-sdk'
import { Body, Controller, Inject, Post } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { splitStringToChunks } from './utils'
import type { QueryResultDebugChunkDto, QueryDto } from './wrapper-dtos'
import { QueryResultDto } from './wrapper-dtos'
import os from 'os'
import { AsyncQueueInversifyService } from '@coti-cvi/lw-sdk'
import type { ChatgptServerWrapperConfig } from '@coti-cvi/common-be'

const MAX_QUERY_LENGTH = 3500

function splitToEvenChunks(longText: string): {
  paragraphs: string[]
  evenChunks: string[]
} {
  const paragraphs = longText.split(`${os.EOL}${os.EOL}`).flatMap(paragraph => {
    if (paragraph.length > MAX_QUERY_LENGTH) {
      return splitStringToChunks(paragraph, MAX_QUERY_LENGTH)
    } else {
      return [paragraph]
    }
  })
  if (longText.length < MAX_QUERY_LENGTH || paragraphs.length === 0) {
    return {
      paragraphs,
      evenChunks: [longText],
    }
  }

  const chunks: { paragraphs: string[] }[] = [{ paragraphs: [] }]
  let lengthUntilNow = 0
  let currentChunk = chunks[0]
  for (const paragraph of paragraphs) {
    if (lengthUntilNow + paragraph.length > MAX_QUERY_LENGTH) {
      currentChunk = { paragraphs: [] }
      chunks.push(currentChunk)
      lengthUntilNow = 0
    }
    lengthUntilNow += paragraph.length
    currentChunk.paragraphs.push(paragraph)
  }

  return {
    paragraphs,
    evenChunks: chunks.map(chunk => chunk.paragraphs.join(`${os.EOL}${os.EOL}`)),
  }
}

@ApiTags(`Chatgpt Query`)
@Controller('/chatgpt-query')
export class WrapperController {
  private readonly asyncQueueInversifyService = new AsyncQueueInversifyService(
    this.config.serviceConfig.serviceName,
    15,
    0,
  )

  private readonly chatGptClient = getChatGptClient({
    backendEnvironment: BackendEnvironment.K8s,
  })

  constructor(@Inject('ConfigToken') readonly config: ChatgptServerWrapperConfig) {}

  @Post('/')
  @ApiOperation({
    description: '',
  })
  @ApiResponse({
    type: QueryResultDto,
  })
  public async queryChatGpt(@Body() body: QueryDto): Promise<QueryResultDto> {
    const chunks = body.longText
      ? splitToEvenChunks(body.longText)
      : {
          paragraphs: [],
          evenChunks: [],
        }

    const queries =
      chunks.evenChunks.length === 0 ? [body.query] : chunks.evenChunks.map(chunk => `${body.query}:${os.EOL}${chunk}`)

    const chunksResults = await Promise.all(
      queries.map<Promise<QueryResultDebugChunkDto>>(async query => {
        const r = await this.asyncQueueInversifyService.push(async () =>
          this.chatGptClient.default.chatgptSummarizeTextChatgptQueryPost({
            requestBody: {
              query: query,
            },
          }),
        )
        return {
          request: query,
          response: r.result,
          textReducedInfoDto: {
            requestLength: query.length,
            responseLength: r.result.length,
            textReducedPercentage: (r.result.length * 100) / query.length,
          },
        }
      }),
    )

    const requestLength = body.query.length + (body.longText?.length ?? 0)
    const responseLength = chunksResults.map(r1 => r1.response).join().length

    return {
      result: chunksResults.map(r1 => r1.response).join(os.EOL),
      debug: {
        textReducedInfoDto: {
          requestLength,
          responseLength: responseLength,
          textReducedPercentage: (responseLength * 100) / requestLength,
        },
        chunks: chunksResults,
      },
    }
  }
}
