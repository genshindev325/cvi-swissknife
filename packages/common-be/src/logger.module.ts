import { WinstonModule } from 'nest-winston'
import winston from 'winston'

export function createLoggerModule() {
  const { combine, timestamp, printf, colorize } = winston.format

  const format = combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
    colorize(),
    printf(({ timestamp, level, message }) => `${timestamp} ${level}: ${message}`),
  )

  const consoleWinstonTransport = new winston.transports.Console({
    format,
  })

  const transports: winston.transport[] = [consoleWinstonTransport]

  return WinstonModule.forRoot({
    level: process.env.IS_TEST_MODE ? 'debug' : 'verbose',
    exceptionHandlers: [consoleWinstonTransport],
    transports,
  })
}
