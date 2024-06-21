export enum INVERSIFY_SERVICES {
  GLOBAL_EVENTS = 'GlobalEventsInversifyService',
  LATEST_BLOCK = 'LatestBlockInfoInversifyService',
  IL_ADMIN_API = 'ILAdminApiInversifyService',
  IL_PROTECTION = 'ILProtectionInversifyService',
  CVI_ADMIN_API = 'CviAdminApiInversifyService',
  CVI_ORACLE_ADMIN_API = 'CviOracleAdminApiInversifyService',
}

export const cviTradingCompetitionDates = {
  customRange: {
    fromTimestamp: undefined,
    // fromTimestamp: 0,
    // toTimestamp: Math.floor(Date.now() / 1000),
  },
  currentCompetition: {
    fromTimestamp: 0,
    toTimestamp: 0,
  },
  competitions: [
    {
      name: 'competition 1',
      fromTimestamp: Math.floor(Date.parse('2022-12-22T16:00:00.000Z') / 1000),
      toTimestamp: Math.floor(Date.parse('2023-01-05T16:00:00.000Z') / 1000),
    },
  ].sort((a, b) => a.fromTimestamp - b.fromTimestamp),
} as const

export const competition_1_data = [
  { address: '0xca221', pnlUsdc: 87.22, maxTradeUsdc: 50, trades: 165, score: 174.45, tvCvix1BalanceInUsdc: 0 },
  { address: '0xFa438', pnlUsdc: 72.04, maxTradeUsdc: 50, trades: 128, score: 144.08, tvCvix1BalanceInUsdc: 0 },
  { address: '0x7F88c', pnlUsdc: 122.43, maxTradeUsdc: 109.58, trades: 275, score: 134.07, tvCvix1BalanceInUsdc: 0 },
  { address: '0x6b30e', pnlUsdc: 55.59, maxTradeUsdc: 50.25, trades: 112, score: 110.62, tvCvix1BalanceInUsdc: 0 },
  { address: '0x3E898', pnlUsdc: 181.66, maxTradeUsdc: 831.84, trades: 306, score: 28.39, tvCvix1BalanceInUsdc: 0 },
  { address: '0x2f299', pnlUsdc: 2.473502, maxTradeUsdc: 51, trades: 19, score: 4.85, tvCvix1BalanceInUsdc: 0 },
]
