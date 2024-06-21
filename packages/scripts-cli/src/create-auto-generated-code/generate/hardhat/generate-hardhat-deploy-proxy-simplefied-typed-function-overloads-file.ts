export function generateHardhatDeployProxySimplifiedTypedFunctionFile({
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
export interface HardhatDeployProxySimplifiedFunctionOverloads {
  ${allContractsNames
    .map(
      contractName => `(
    contractName: '${contractName}',
    libraries: Libraries,
    ...args: Head<GetInitMethod<GitContractTypes.${contractName}>>
  ): Promise<GitContractTypes.${contractName}>`,
    )
    .join('\n  ')}
}
`
  return { imports, code }
}
