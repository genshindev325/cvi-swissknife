import execa from 'execa'
import glob from 'glob'
import path from 'path'
import fs from 'fs'
import os from 'os'

export async function minimizeIlSolidityLines(repoPath: string) {
  const contractsPath = path.join(repoPath, 'packages/contracts-il/contracts')
  const solFiles = glob.sync('**/*.sol', { cwd: contractsPath })

  let linesBeforeAll = 0
  await Promise.all(
    solFiles.map(async filePath => {
      const p = path.join(contractsPath, filePath)
      const fileContent = await fs.promises.readFile(p, 'utf-8')
      linesBeforeAll += fileContent.split(os.EOL).length
    }),
  )

  console.log(`start. lines: ${linesBeforeAll}`)

  console.log('run prettier on all soldity files...')

  const prettierrcPath = path.join(repoPath, '.prettierrc')
  const oldPrettierConfig = await fs.promises.readFile(prettierrcPath, 'utf-8')
  try {
    await fs.promises.writeFile(
      prettierrcPath,
      JSON.stringify({
        ...JSON.parse(oldPrettierConfig),
        printWidth: 10000,
        explicitTypes: 'preserve',
      }),
      'utf-8',
    )
    await execa.command(`yarn prettier --write '${contractsPath}/**/*.sol'`, {
      stdio: 'inherit',
      cwd: repoPath,
      shell: true,
    })
  } finally {
    await fs.promises.writeFile(prettierrcPath, oldPrettierConfig, 'utf-8')
  }

  console.log('remove empty lines in all soldity files...')

  let linesBefore = 0
  let linesAfter = 0
  await Promise.all(
    solFiles.map(async filePath => {
      const p = path.join(contractsPath, filePath)
      console.log(`minimize lines in: ${p}`)

      const fileContent = await fs.promises.readFile(p, 'utf-8')
      linesBefore += fileContent.split(os.EOL).length

      const withoutEmptyLines = fileContent
        .split(os.EOL)
        .filter(line => line.trim().length > 0)
        .join(os.EOL)

      await fs.promises.writeFile(p, withoutEmptyLines, 'utf-8')
      linesAfter += withoutEmptyLines.split(os.EOL).length
    }),
  )

  console.log(
    `removed empty lines in all soldity files. from: ${linesBefore} to: ${linesAfter} (${
      linesAfter - linesBefore
    } lines removed)`,
  )

  console.log(`done. total lines = ${linesAfter} (${linesAfter - linesBeforeAll} lines removed)`)
}
