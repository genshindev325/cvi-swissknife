import { format } from 'date-fns'
import millify from 'millify'
import { catDecimalsBase, secondsToString } from '@coti-cvi/lw-sdk'
import type { ProtectionInfoDto } from '@coti-cvi/auto-generated-code/src/backend-client-apis/il-backend-swagger-client'

export function usdcToString(usdc: number): string {
  if (-10 < usdc && usdc < 10) {
    return catDecimalsBase(usdc, 6)
  }
  return millify(usdc)
}

export function protectionTooltipToString(protection: ProtectionInfoDto): string {
  const payoutText = `${protection.expiredEvent ? 'Payout' : 'Due-Payout'}: $${usdcToString(
    protection.status.withoutMinPayout.payoutOrDuePayoutUsdc,
  )} (IL: ${protection.status.ilPercentage.toFixed(2)}%), User-Revenue: $${usdcToString(
    protection.status.withoutMinPayout.userRevenueUsdc,
  )} (${protection.status.withoutMinPayout.userProfitPercentage}%), LP-Revenue: $${usdcToString(
    protection.status.withoutMinPayout.lpRevenueUsdc,
  )} (${usdcToString(protection.status.withoutMinPayout.lpProfitPercentage)}%)`

  const time = protection.expiredEvent
    ? `expired before: ${secondsToString(protection.boughtEvent.args.protectionEndTimestamp - Date.now() / 1000)}`
    : `left: ${secondsToString(Date.now() / 1000 - protection.boughtEvent.args.protectionStartTimestamp)}`

  return `${protection.expiredEvent ? 'Expired' : 'Active'} (${
    protection.boughtEvent.args.tokenName1.ArmadilloSupportedTokenName
  }-${protection.boughtEvent.args.tokenName2.ArmadilloSupportedTokenName}/${secondsToString(
    protection.boughtEvent.args.policyPeriodSeconds,
  )}) - LP-Tokens: $${usdcToString(protection.metadata.lpTokensWorthAtBuyTimeUsdc)}, Price: $${usdcToString(
    protection.boughtEvent.args.premiumCostUSD,
  )} (${usdcToString(
    (protection.boughtEvent.args.premiumCostUSD * 100) / protection.metadata.lpTokensWorthAtBuyTimeUsdc,
  )}%), ${payoutText} Bought: ${format(
    new Date(protection.boughtEvent.args.protectionStartTimestampUtc),
    'dd/MM/yy-HH:mm',
  )}, Expired: ${format(new Date(protection.boughtEvent.args.protectionEndTimestampUtc), 'dd/MM/yy-HH:mm')} (${time})`
}
