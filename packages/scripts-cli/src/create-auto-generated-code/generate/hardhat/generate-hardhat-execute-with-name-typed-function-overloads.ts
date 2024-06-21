export function generateHardhatExecuteWithNameOverloads({ allContractsNames }: { allContractsNames: string[] }): {
  imports: string[]
  code: string
} {
  const imports = [
    `import * as GitContractTypes from './git-contract-types'`,
    `import { TxOptions, Receipt } from 'hardhat-deploy/types'`,
  ]

  const code = `\
export interface HardhatExecuteWithNameOverloads {
  ${allContractsNames
    .map(
      contractName => `<
      M extends keyof GitContractTypes.${contractName}['functions'],
      Args extends Head<GitContractTypes.${contractName}['functions'][M]>,
    >(
      contract: '${contractName}',
      contractName: string,
      method: M,
      options: Omit<TxOptions, 'from'> & { from?: string },
      ...args: Args
    ): Promise<Receipt | void>`,
    )
    .join('\n  ')}
}
`
  return { imports, code }
}
