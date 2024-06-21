export function generateHardhatDeployTypedFunctionFile({ allContractsNames }: { allContractsNames: string[] }): {
  imports: string[]
  code: string
} {
  const imports = [
    `import type { DeployOptions, Libraries } from 'hardhat-deploy/types'`,
    `import * as GitContractTypes from './git-contract-types'`,
  ]

  const code = `\
export interface HardhatDeployFunctionOverloads {
  ${allContractsNames
    .map(
      contractName => `(
    contract: '${contractName}',
    options: Omit<DeployOptions, 'args' | 'contract' | 'from'> & {
      args: Head<GetDeployMethod<GitContractTypes.${contractName}__factory>>
      from?: string
      contractName?: string
    },
  ): Promise<GitContractTypes.${contractName}>`,
    )
    .join('\n  ')}
}
`
  return { imports, code }
}
