import type { LoggerOptions } from 'winston'
import { transports, createLogger } from 'winston'

const options: LoggerOptions = {
  transports: [
    new transports.Console({
      //   level: process.env.NODE_ENV ? "debug" : "error",
      level: 'debug',
    }),
    new transports.File({ filename: './logs/debug.log', level: 'debug' }),
    new transports.File({ filename: './logs/error.log', level: 'error' }),
  ],
}

const logger = createLogger(options)

export default logger
