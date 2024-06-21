import { MaxUint256, AddressZero } from '@ethersproject/constants'
import type { Provider } from '@ethersproject/providers'
import type { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import type { UniswapV2Router02 } from '@coti-cvi/auto-generated-code/contracts'
import type {
  BaseContract,
  BigNumber,
  BigNumberish,
  CallOverrides,
  ContractReceipt,
  ContractTransaction,
  Overrides,
  Signer,
} from 'ethers'
import type { TestHelper } from '../utils'
import { fromNumber } from '../../../lw-sdk/src/util/big-number'

export interface Token extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this
  decimals(overrides?: CallOverrides): Promise<number>
  approve(
    spender: string,
    amount: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>
}

export type Path = [Token, Token, ...Token[]]

type UniswapContracts = {
  uniswapRouter: UniswapV2Router02
}

export type UniswapActions = ReturnType<typeof uniswapActions>

export const uniswapActions = (helper: TestHelper, { uniswapRouter }: UniswapContracts) => {
  const parseSwapEvent = (receipt: ContractReceipt, srcToken: string, dstToken: string, address: string) => {
    const abi = ['event Transfer(address indexed from, address indexed to, uint value)']
    const iface = new helper.eth.utils.Interface(abi)

    const transferEvents = receipt.logs
      .filter(l => l.topics[0] === '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef')
      .map(l => iface.parseLog(l))
    const sentFrom = srcToken === AddressZero ? uniswapRouter.address : address
    const sentTo = dstToken === AddressZero ? uniswapRouter.address : address

    const sentEvent = transferEvents.find(e => e.args.from === sentFrom)
    const receivedEvent = transferEvents.find(e => e.args.to === sentTo)
    if (!sentEvent || !receivedEvent) {
      throw new Error(`swap - no transfer events found in receipt`)
    }
    return { sent: sentEvent.args.value, received: receivedEvent.args.value }
  }

  const swapExactTokensForTokens = async (signer: SignerWithAddress, amountIn: BigNumber | number, ...path: Path) => {
    const [decimals] = await Promise.all([
      path[0].decimals(),
      path[0].connect(signer).approve(uniswapRouter.address, MaxUint256),
    ])
    const tokenAmount = typeof amountIn === 'number' ? fromNumber(amountIn, decimals) : amountIn

    const tx = await uniswapRouter.connect(signer).swapExactTokensForTokens(
      tokenAmount,
      0,
      path.map(t => t.address),
      signer.address,
      (await helper.latestBlock()).timestamp + 24 * 60 * 60,
    )
    return parseSwapEvent(await tx.wait(), path[0].address, path[path.length - 1].address, signer.address)
  }

  const swapTokensForExactTokens = async (signer: SignerWithAddress, amountOut: BigNumber, ...path: Path) => {
    const [decimals] = await Promise.all([
      path[0].decimals(),
      path[0].connect(signer).approve(uniswapRouter.address, MaxUint256),
    ])
    const tokenAmount = typeof amountOut === 'number' ? fromNumber(amountOut, decimals) : amountOut

    const tx = await uniswapRouter.connect(signer).swapTokensForExactTokens(
      tokenAmount,
      MaxUint256,
      path.map(t => t.address),
      signer.address,
      (await helper.latestBlock()).timestamp + 24 * 60 * 60,
    )
    return parseSwapEvent(await tx.wait(), path[0].address, path[path.length - 1].address, signer.address)
  }

  return { swapExactTokensForTokens, swapTokensForExactTokens }
}
