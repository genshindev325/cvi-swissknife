import Fastify from 'fastify'
import fastifyCors from '@fastify/cors'

type SentryErrorReport = {
  breadcrumbs: string
  error:
    | {
        name: string
        message: string
        stacktrace: string
      }
    | undefined
  message: string
  extra: string
  level: string
  release: string
  user: string
  tags: string
  originalReport: string
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toError(report: any): SentryErrorReport {
  const exception = report.exception && report.exception.values && report.exception.values[0]
  const error = exception
    ? {
        name: exception.type,
        message: exception.value,
        stacktrace: exception.stacktrace,
      }
    : undefined

  return {
    breadcrumbs: report.breadcrumbs || [],
    error,
    message: report.message,
    extra: report.extra,
    level: report.level || 'error',
    release: report.release,
    user: report.user,
    tags: report.tags || {},
    originalReport: report,
  }
}

export async function initializeSentryMockService(): Promise<{
  sentryDsn: string
  errorsUntilNow: SentryErrorReport[]
  closeService: () => Promise<void>
}> {
  const sentryProject = '1234567'

  const app = Fastify({})

  app.register(fastifyCors)

  const errorsUntilNow: ReturnType<typeof toError>[] = []

  app.post<{ Body: string }>(`/api/${sentryProject}/envelope/`, async req => {
    errorsUntilNow.push(toError(req.body))
    console.log('Errors until now: ', errorsUntilNow.length)
    return ''
  })

  app.get('/api/errors', async (req, res) => {
    res.send(errorsUntilNow)
  })

  const address = await app.listen(0)

  const port = Number(address.split(':')[2].replace('/', ''))

  return {
    sentryDsn: `http://12345678912345678912345678912345@localhost:${port}/${sentryProject}`,
    errorsUntilNow,
    closeService: async () => {
      await app.close()
    },
  }
}
