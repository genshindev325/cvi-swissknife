// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8;

import '@coti-cvi/contracts-cvi/contracts/GOVI.sol';
import '@coti-cvi/contracts-cvi/contracts/external/WETH9.sol';

contract WETH is WETH9 {
  constructor() WETH9() {}
}
