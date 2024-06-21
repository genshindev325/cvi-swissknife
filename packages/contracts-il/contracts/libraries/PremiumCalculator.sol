// SPDX-License-Identifier: BUSL-1.1

pragma solidity ^0.8;

import 'prb-math/contracts/PRBMathUD60x18.sol';
import 'prb-math/contracts/PRBMathSD59x18.sol';

struct PremiumParams {
  int256 A;
  int256 X0;
  int256 C;
}

library PremiumCalculator {
  using PRBMathUD60x18 for uint256;
  using PRBMathSD59x18 for int256;

  function calculatePremium(
    uint256 lpTokensWorthAtBuyTimeUSD,
    uint256 collateral,
    uint256 liquidity,
    PremiumParams memory premiumParams,
    uint256 cvi,
    uint256 premiumGrowthStart,
    uint256 premiumSlope
  ) external pure returns (uint256) {
    uint256 P = calculateP(collateral, liquidity, premiumGrowthStart, premiumSlope);

    int256 xt = int256(cvi);

    return
      uint256(
        int256(lpTokensWorthAtBuyTimeUSD).mul(
          (premiumParams.A.mul((xt - premiumParams.X0).powu(2)) + premiumParams.C).mul(int256(P))
        )
      );
  }

  function calculateP(
    uint256 collateral,
    uint256 liquidity,
    uint256 premiumGrowthStart,
    uint256 premiumSlope
  ) private pure returns (uint256) {
    int256 signedCollateral = int256(collateral);
    int256 signedLiquidity = int256(liquidity);
    int256 signedPremiumGrowthStart = int256(premiumGrowthStart);
    int256 signedPremiumSlope = int256(premiumSlope);

    // Due to how pow is calculated - there is an inner log2 calculation that can be negative -
    // we convert the input values to be signed

    return
      PRBMathUD60x18.exp(
        uint256((signedCollateral.div(signedLiquidity)).pow(signedPremiumGrowthStart).div(signedPremiumSlope))
      );
  }
}
