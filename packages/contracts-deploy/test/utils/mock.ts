import type { ContractFactory } from 'ethers'
import { smock } from '@defi-wonderland/smock'
import type { HardhatMockFunctionOverloads } from '@coti-cvi/auto-generated-code'

export const mock: HardhatMockFunctionOverloads = async <F extends ContractFactory>(
  contractName: string,
  ...args: Parameters<F['deploy']>
) => {
  const mockFactory = await smock.mock<F>(contractName)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (await mockFactory.deploy(...args)) as any
}
