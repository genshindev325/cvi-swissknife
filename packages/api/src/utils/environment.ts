export default {
  cutoff: process.env.CUTOFF || 1633591860,
  mysqlTable: process.env.DB_TABLE,
  mysqlHost: process.env.DB_HOST,
  mysqlUser: process.env.DB_USER,
  mysqlPass: process.env.DB_PASS,
  ethreumRPCURL: process.env.ETHEREUM_RPC_URL || 'https://mainnet.infura.io/v3/b454739b95444d53812c01d1b9c60549',
  polygonRPCURL: process.env.POLYGON_RPC_URL || 'https://polygon-mainnet.infura.io/v3/b454739b95444d53812c01d1b9c60549',
  arbitrumRPCURL:
    process.env.ARBITRUM_RPC_URL || 'https://arbitrum-mainnet.infura.io/v3/b454739b95444d53812c01d1b9c60549',
  // @ts-ignore
  delayInterval: +process.env.DELAY_INTERVAL || 20, // seconds
  // @ts-ignore
  refreshInterval: +process.env.REFRESH_INTERVAL || 300, // seconds
  // @ts-ignore
  maxDaysSyncInterval: +process.env.MAX_DAYS_SYNC_INTERVAL || 1, // days (events interval)
  useChainlinkInLatest: process.env.USE_CHAINLINK_IN_LATEST || 'true',
  whitelistedIPS: process.env.WHITELISTED_IPS,
  whitelistedOrigins: process.env.WHITELISTED_ORIGINS,
}
