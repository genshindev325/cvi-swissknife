import { format } from 'date-fns'

export const NUMBER_OF_SECONDS_IN_1_DAY = 86400

export const toTimeString = (seconds: number, significantDigits = 2): string => {
  const neg = seconds < 0
  seconds = Math.abs(seconds)
  if (seconds < 120) {
    return `${seconds.toFixed(significantDigits)} seconds${neg ? ' ago' : ''}`
  }
  if (seconds / 60 < 120) {
    return `${(seconds / 60).toFixed(significantDigits)} minutes${neg ? ' ago' : ''}`
  }
  if (seconds / 60 / 60 < 48) {
    return `${(seconds / 60 / 60).toFixed(significantDigits)} hours${neg ? ' ago' : ''}`
  }
  return `${(seconds / 60 / 60 / 24).toFixed(significantDigits)} days${neg ? ' ago' : ''}`
}

export const periods: [period: string, amount: number][] = [
  ['second', 1],
  ['minute', 60],
  ['hour', 60 * 60],
  ['day', NUMBER_OF_SECONDS_IN_1_DAY],
  ['week', NUMBER_OF_SECONDS_IN_1_DAY * 7],
  ['month', NUMBER_OF_SECONDS_IN_1_DAY * 30],
  ['year', NUMBER_OF_SECONDS_IN_1_DAY * 365],
]

export const formatDate = (
  timestampSecondsOrDate: number | Date,
  options?: {
    overrideFormat?: string
  },
) =>
  format(
    typeof timestampSecondsOrDate === 'object' ? timestampSecondsOrDate : new Date(timestampSecondsOrDate * 1000),
    options?.overrideFormat ?? 'dd/MM/yyyy HH:mm:ss',
  )
