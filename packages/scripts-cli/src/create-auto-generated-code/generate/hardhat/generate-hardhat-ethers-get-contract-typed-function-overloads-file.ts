export function generateHardhatEthersGetContractTypedFunctionFile({
  allContractsNames,
}: {
  allContractsNames: string[]
}): {
  imports: string[]
  code: string
} {
  const imports = [
    `import type { HardhatEthersHelpers } from '@nomiclabs/hardhat-ethers/types'`,
    `import * as GitContractTypes from './git-contract-types'`,
  ]
  const code = `\
export type HardhatContractsOverloads = ${
    allContractsNames.length > 0 ? allContractsNames.map(c => `'${c}'`).join(' | ') : `''`
  }

export interface HardhatEthersGetContractFunctionOverloads {
  ${allContractsNames
    .map(
      contractName => `(
    ethers: HardhatEthersHelpers,
    contractName: '${contractName}',
  ): Promise<GitContractTypes.${contractName}>`,
    )
    .join('\n  ')}
}
`

  return { imports, code }
}
