export function generateHardhatUpgradeProxyTypedFunctionFile({ allContractsNames }: { allContractsNames: string[] }): {
  imports: string[]
  code: string
} {
  const imports = [
    `import type { DeployOptions, Libraries } from 'hardhat-deploy/types'`,
    `import * as GitContractTypes from './git-contract-types'`,
  ]

  const code = `\
export interface HardhatUpgradeProxyFunctionOverloads {
  ${allContractsNames
    .map(
      contractName => `(
    contract: '${contractName}',
    options: Omit<DeployOptions, 'args' | 'contract' | 'from'> & {
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
