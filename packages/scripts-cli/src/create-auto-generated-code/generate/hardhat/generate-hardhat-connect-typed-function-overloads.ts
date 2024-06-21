export function generateHardhatConnectOverloads({ allContractsNames }: { allContractsNames: string[] }): {
  imports: string[]
  code: string
} {
  const imports = [
    `import type { DeployOptions, Libraries } from 'hardhat-deploy/types'`,
    `import * as GitContractTypes from './git-contract-types'`,
  ]

  const code = `\
export interface HardhatConnectOverloads {
  ${allContractsNames
    .map(
      contractName => `(
    contractName: '${contractName}',
    options?: { overrideSignerAddress?: string; overrideContractAddress?: string },
  ): Promise<GitContractTypes.${contractName}>`,
    )
    .join('\n  ')}
}
`
  return { imports, code }
}
