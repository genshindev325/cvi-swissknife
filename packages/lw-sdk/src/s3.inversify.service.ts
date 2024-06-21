import { GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { inject, injectable } from 'inversify'
import type { GlobalEventsInversifyService } from './global-events.inversify.service'
import type { S3Info } from './types'
import { startTimer } from './util'

@injectable()
export class S3InversifyService {
  private readonly s3: S3Client

  constructor(
    @inject('S3Info') private readonly s3Info: S3Info,
    @inject('GlobalEventsInversifyService') private readonly globalEventsInversifyService: GlobalEventsInversifyService,
  ) {
    this.s3 = new S3Client({
      region: this.s3Info.region,
      credentials: {
        accessKeyId: this.s3Info.accessKeyId,
        secretAccessKey: this.s3Info.secretAccessKey,
      },
    })
  }

  public async writeToS3Key_legacy<T>(key: string, r: { version: number; value: T }): Promise<void> {
    console.log(
      `${new Date().toISOString()} - ${S3InversifyService.name} - saving key: "${key}" (version: "${
        r.version
      }") to s3 bucket: "${this.s3Info.bucket}"`,
    )
    const end = startTimer()
    await this.s3.send(
      new PutObjectCommand({
        Bucket: this.s3Info.bucket,
        Key: key,
        Body: JSON.stringify(r),
      }),
    )
    console.log(
      `${new Date().toISOString()} - ${S3InversifyService.name} - saved key: "${key}" (version: "${
        r.version
      }") to s3 bucket: "${this.s3Info.bucket}" (${end().toFixed(2)}s)`,
    )
  }

  public async writeToS3Key<T>(key: string, value: T): Promise<void> {
    console.log(
      `${new Date().toISOString()} - ${S3InversifyService.name} - saving key: "${key}" to s3 bucket: "${
        this.s3Info.bucket
      }"`,
    )
    const end = startTimer()
    await this.s3.send(
      new PutObjectCommand({
        Bucket: this.s3Info.bucket,
        Key: key,
        Body: JSON.stringify(value),
      }),
    )
    console.log(
      `${new Date().toISOString()} - ${S3InversifyService.name} - saved key: "${key}" to s3 bucket: "${
        this.s3Info.bucket
      }" (${end().toFixed(2)}s)`,
    )
  }

  // https://github.com/aws/aws-sdk-js-v3/issues/1877#issuecomment-755387549
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private streamToString = (stream: any): Promise<string> =>
    new Promise((resolve, reject) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const chunks: any[] = []
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      stream.on('data', (chunk: any) => chunks.push(chunk))
      stream.on('error', reject)
      stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
    })

  public async readS3Key_legacy<T>(key: string): Promise<{ version: number; value: T } | undefined> {
    console.log(
      `${new Date().toISOString()} - ${S3InversifyService.name} - fetching key: "${key}" from s3 bucket: "${
        this.s3Info.bucket
      }"`,
    )
    const end = startTimer()
    const result = await this.s3
      .send(
        new GetObjectCommand({
          Bucket: this.s3Info.bucket,
          Key: key,
        }),
      )
      .then(
        ({ Body }) => (Body ? this.streamToString(Body).then(r => JSON.parse(r)) : undefined),
        () => undefined,
      )
    if (result) {
      console.log(
        `${new Date().toISOString()} - ${S3InversifyService.name} - fetched key: "${key}" (version: "${
          result?.version
        }") from s3 bucket: "${this.s3Info.bucket}" (${end().toFixed(2)}s)`,
      )
    } else {
      console.log(
        `${new Date().toISOString()} - ${S3InversifyService.name} - did not find key: "${key}" in s3 bucket: "${
          this.s3Info.bucket
        }" (${end().toFixed(2)}s)`,
      )
    }

    return result
  }

  public async readS3Key<T>(key: string): Promise<T | undefined> {
    console.log(
      `${new Date().toISOString()} - ${S3InversifyService.name} - fetching key: "${key}" from s3 bucket: "${
        this.s3Info.bucket
      }"`,
    )
    const end = startTimer()
    const result = await this.s3
      .send(
        new GetObjectCommand({
          Bucket: this.s3Info.bucket,
          Key: key,
        }),
      )
      .then(
        ({ Body }) => (Body ? this.streamToString(Body).then(r => JSON.parse(r)) : undefined),
        () => undefined,
      )
    if (result) {
      console.log(
        `${new Date().toISOString()} - ${S3InversifyService.name} - fetched key: "${key}" from s3 bucket: "${
          this.s3Info.bucket
        }" (${end().toFixed(2)}s)`,
      )
    } else {
      console.log(
        `${new Date().toISOString()} - ${S3InversifyService.name} - did not find key: "${key}" in s3 bucket: "${
          this.s3Info.bucket
        }" (${end().toFixed(2)}s)`,
      )
    }

    return result
  }
}
