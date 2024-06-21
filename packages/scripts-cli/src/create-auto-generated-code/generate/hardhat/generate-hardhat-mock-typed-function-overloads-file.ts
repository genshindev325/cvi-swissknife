export function generateHardhatMockTypedFunctionFile({ allContractsNames }: { allContractsNames: string[] }): {
  imports: string[]
  code: string
} {
  const imports = [
    `import type { MockContract } from '@defi-wonderland/smock'`,
    `import type { DeployOptions, Libraries } from 'hardhat-deploy/types'`,
    `import * as GitContractTypes from './git-contract-types'`,
  ]

  const code = `\
export interface HardhatMockFunctionOverloads {
  ${allContractsNames
    .map(
      contractName => `(
    contractName: '${contractName}',
    ...args: Parameters<GetDeployMethod<GitContractTypes.${contractName}__factory>>
  ): Promise<MockContract<GitContractTypes.${contractName}>>`,
    )
    .join('\n  ')}
}
`
  return { imports, code }
}
