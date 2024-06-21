type ProtectedDays = 14 | 30 | 60
type ProtectedPairs = 'ETH-USDC' | 'ETH-USDT' | 'ETH-DAI'

export class IL {
  private howMuchLiquidityUsdc = 0

  // not the premium, but the total Ensured amount for which active premiums were paid. e.g: 100k if I bought the 1st protection to protect 100k
  private totalActiveProtectedLpTokensInUSDC = 0

  public addLiquidity(usdc: number) {
    // only coti can call this function
    this.howMuchLiquidityUsdc += usdc // 20m from coti
  }

  public calcPositiveIl({
    t1Usdc,
    t2Usdc,
  }: {
    t1Usdc: { start: number; end: number }
    t2Usdc: { start: number; end: number }
  }): number {
    const p = (t1Usdc.start * t2Usdc.end) / (t1Usdc.end * t2Usdc.start)
    return 1 - (2 * Math.sqrt(p)) / (1 + p)
  }

  public calcReturnedUsdcToWalletAtEndOfProtection(
    lpTokensWorthAtBuyProtectionTimeUsdc: number,
    t1Usdc: { start: number; end: number },
    t2Usdc: { start: number; end: number },
  ): number {
    const lpTokensWorthAtEndProtectionTimeUsdc =
      (lpTokensWorthAtBuyProtectionTimeUsdc * (t1Usdc.end / t1Usdc.start + t2Usdc.end / t2Usdc.start)) / 2

    return (lpTokensWorthAtEndProtectionTimeUsdc * this.calcPositiveIl({ t1Usdc, t2Usdc })) / 100
  }

  // TODO: we need to calculate this by the worth of the LP tokens at end-protection-time
  public calculatePremiumCost(
    lpTokensWorthUsdcOfUser: number,
    daysToProtect: ProtectedDays,
    pairToProtect: ProtectedPairs,
  ): number {
    const cvi = 70.74 // Get it NOW from ChainLink's onchain contract value
    const maxIlPercentageWeWillPayBack = this.getMaxIlPercentageWeWillPayBack(pairToProtect)
    const maxHowMuchWeCanProtectInUsdc = this.calcHowMuchWeCanProtectInUsdc(
      this.howMuchLiquidityUsdc,
      maxIlPercentageWeWillPayBack,
    )
    const expectedProtectedLpTokensUsdcValueGrowthRatio =
      this.getRelevantExpectedProtectedLpTokensUsdcValueGrowthRatio()

    const newLiquidityUtilizationRatio =
      (this.totalActiveProtectedLpTokensInUSDC +
        lpTokensWorthUsdcOfUser * expectedProtectedLpTokensUsdcValueGrowthRatio) /
      maxHowMuchWeCanProtectInUsdc // 0 <= liquidityUtilizationRatio <= 1

    if (newLiquidityUtilizationRatio > 1) {
      throw Error('not enough liquidity for you man!')
    }

    const parabolaCoeff = 1 // offchain coef. not in WhitePaper not related to Pair (is it only relevant to P2 where liquidity is offered by public?)

    const P = Math.exp(parabolaCoeff * (newLiquidityUtilizationRatio ^ -1) * maxIlPercentageWeWillPayBack)

    const a = this.getRelevantA(daysToProtect, pairToProtect)
    const X0 = this.getRelevantX0(daysToProtect, pairToProtect)
    const C = this.getRelevantC(daysToProtect, pairToProtect)

    return (lpTokensWorthUsdcOfUser * this.iLProtectionPercentageCost(cvi, P, a, X0, C)) / 100
  }

  public buyPremium(
    lpTokensWorthUsdcOfUser: number,
    daysToProtect: ProtectedDays,
    slippage: number,
    pairToProtect: ProtectedPairs,
  ) {
    const costUsdc = this.calculatePremiumCost(lpTokensWorthUsdcOfUser, daysToProtect, pairToProtect)
    // do something with this info
    this.totalActiveProtectedLpTokensInUSDC += lpTokensWorthUsdcOfUser
    // .............
  }

  private calcHowMuchWeCanProtectInUsdc(howMuchLiquidityUsdc: number, maxIlPercentageWeWillPayBack: number): number {
    return (100 / maxIlPercentageWeWillPayBack) * howMuchLiquidityUsdc
  }

  private iLProtectionPercentageCost(Xt: number, P: number, a: number, X0: number, C: number): number {
    return (a * (Xt - X0) * (Xt - X0) + C) * P
  }

  private getRelevantA(daysToProtect: ProtectedDays, pairToProtect: ProtectedPairs): number {
    // we calculate offchain different `a` values per `daysToProtect` and `pairToProtect`. each `daysToProtect` and `pairToProtect` will have different `a`. we will upload each `a` from offchain to onchain
    return 1
  }

  private getRelevantX0(daysToProtect: ProtectedDays, pairToProtect: ProtectedPairs): number {
    // we calculate offchain different `x0` values per `daysToProtect` and `pairToProtect`. each `daysToProtect` and `pairToProtect` will have different `x0`. we will upload each `x0` from offchain to onchain
    return 1
  }

  private getRelevantC(daysToProtect: ProtectedDays, pairToProtect: ProtectedPairs): number {
    // we calculate offchain different `c` values per `daysToProtect` and `pairToProtect`. each `daysToProtect` and `pairToProtect` will have different `c`. we will upload each `c` from offchain to onchain
    return 1
  }

  private getMaxIlPercentageWeWillPayBack(pairToProtect: ProtectedPairs): number {
    // TODO: will we calc this by pairToProtect or it's a constant - talk to @yoni

    // we will upload each `MaxImpermanentLoss(` from offchain to onchain
    return 1
  }

  private getRelevantExpectedProtectedLpTokensUsdcValueGrowthRatio(): number {
    // from offchain
    return 1
  }
}
