export const loggerInfo = (str: string) =>
  console.log(
    `${new Date().toISOString()} (uptime: ${
      process.uptime() < 60 ? `${process.uptime().toFixed(0)}s` : `${(process.uptime() / 60).toFixed(2)}m`
    }) - info - ${str}`,
  )
