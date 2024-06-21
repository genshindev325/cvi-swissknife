export function generateHardhatDeploySimplifiedTypedFunctionFile({
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
export interface HardhatDeploySimplifiedFunctionOverloads {
  ${allContractsNames
    .map(
      contractName => `(
    contractName: '${contractName}',
    ...args: Head<GetDeployMethod<GitContractTypes.${contractName}__factory>>
  ): Promise<GitContractTypes.${contractName}>`,
    )
    .join('\n  ')}
}
`
  return { imports, code }
}
