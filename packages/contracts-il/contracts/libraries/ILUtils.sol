// SPDX-License-Identifier: BUSL-1.1

pragma solidity ^0.8;

import 'prb-math/contracts/PRBMathUD60x18.sol';

library ILUtils {
  using PRBMathUD60x18 for uint256;

  function calculateIL(
    uint256 token1EntryPrice,
    uint256 token2EntryPrice,
    uint256 token1EndPrice,
    uint256 token2EndPrice,
    uint16 maxPrecision
  ) external pure returns (uint16) {
    uint256 rt1 = token1EntryPrice.div(token2EntryPrice);
    uint256 rt2 = token1EndPrice.div(token2EndPrice);

    uint256 p = rt1.div(rt2);

    return
      uint16(
        (PRBMathUD60x18.SCALE - (2 * PRBMathUD60x18.sqrt(p).div(p + PRBMathUD60x18.SCALE))) /
          (PRBMathUD60x18.SCALE / maxPrecision)
      );
  }
}
