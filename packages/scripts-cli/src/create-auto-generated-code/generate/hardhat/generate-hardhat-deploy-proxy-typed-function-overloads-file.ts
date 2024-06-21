export function generateHardhatDeployProxyTypedFunctionFile({ allContractsNames }: { allContractsNames: string[] }): {
  imports: string[]
  code: string
} {
  const imports = [
    `import type { DeployOptions, Libraries } from 'hardhat-deploy/types'`,
    `import * as GitContractTypes from './git-contract-types'`,
  ]

  const code = `\
export interface HardhatDeployProxyFunctionOverloads {
  ${allContractsNames
    .map(
      contractName => `(
    contract: '${contractName}',
    options: Omit<DeployOptions, 'args' | 'contract' | 'from'> & {
      args: Head<GetInitMethod<GitContractTypes.${contractName}>>
      from?: string
      adminOwner?: string
      contractName?: string
    },
  ): Promise<GitContractTypes.${contractName}>`,
    )
    .join('\n  ')}
}
`
  return { imports, code }
}
