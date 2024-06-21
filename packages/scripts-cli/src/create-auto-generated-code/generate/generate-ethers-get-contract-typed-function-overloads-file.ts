export function generateEthersGetContractTypedFunctionFile({ allContractsNames }: { allContractsNames: string[] }): {
  imports: string[]
  code: string
} {
  const imports = [`import * as GitContractTypes from './git-contract-types'`]
  const code = `\
export interface EthersGetContractFromGitContractTypesFunctionOverloads {
  ${allContractsNames
    .map(contractName => `(contractName: '${contractName}'): GitContractTypes.${contractName}`)
    .join('\n  ')}
}
`

  return { imports, code }
}
