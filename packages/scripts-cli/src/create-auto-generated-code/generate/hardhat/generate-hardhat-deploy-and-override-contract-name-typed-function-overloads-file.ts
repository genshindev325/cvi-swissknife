export function generateHardhatDeployAndOVerrideContractNameTypedFunctionFile({
  allContractsNames,
}: {
  allContractsNames: string[]
}): {
  imports: string[]
  code: string
} {
  const imports = [
    `import type { DeployOptions, Libraries } from 'hardhat-deploy/types'`,
    `import * as GitContractTypes from './git-contract-types'`,
  ]

  const code = `\
export interface HardhatDeployAndOverrideContractNameFunctionOverloads {
  ${allContractsNames
    .map(
      contractName => `(
    contractName: string,
    options: Omit<DeployOptions, 'args' | 'contract' | 'from'> & {
      args: Head<GetDeployMethod<GitContractTypes.${contractName}__factory>>
      contract: '${contractName}'
      from?: string
    },
  ): Promise<GitContractTypes.${contractName}>`,
    )
    .join('\n  ')}
}
`
  return { imports, code }
}
