export function generateHardhatReadWithNameOverloads({ allContractsNames }: { allContractsNames: string[] }): {
  imports: string[]
  code: string
} {
  const imports = [
    `import * as GitContractTypes from './git-contract-types'`,
    `import { CallOptions } from 'hardhat-deploy/types'`,
  ]

  const code = `\
export interface HardhatReadWithNameOverloads {
  ${allContractsNames
    .map(
      contractName => `<
      M extends keyof GitContractTypes.${contractName}['callStatic'],
      Args extends Head<GitContractTypes.${contractName}['callStatic'][M]>
    >(
      contract: '${contractName}',
      contractName: string,
      method: M,
      options?: CallOptions,
      ...args: Args
    ): ReturnType<GitContractTypes.${contractName}['callStatic'][M]>`,
    )
    .join('\n  ')}
}
`
  return { imports, code }
}
