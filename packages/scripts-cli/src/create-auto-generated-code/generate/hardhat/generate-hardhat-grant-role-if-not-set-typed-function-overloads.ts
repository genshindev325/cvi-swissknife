export function generateHardhatGrantRoleIfNotSetOverloads({ allContractsNames }: { allContractsNames: string[] }): {
  imports: string[]
  code: string
} {
  const code = `\
export interface HardhatGrantRoleIfNotSetOverloads {
  ${allContractsNames
    .map(
      contractName => `(
      contract: '${contractName}',
      roleAddress: string,
      role: string
    ): Promise<void>`,
    )
    .join('\n  ')}
}
`
  return { imports: [], code }
}
