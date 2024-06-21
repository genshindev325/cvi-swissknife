import { SERVICE_NAMES } from '@coti-cvi/lw-sdk/src/types/common-types'
import execa from 'execa'
import fs from 'fs'

const getDisallowedCodeInWhichPackages = (): string[] => {
  const v: string[] = SERVICE_NAMES.map(e => e)
  v.push(`lw-sdk`)
  return v
}

const doesSourceCodeLineIncludeBadImport = (sourceLine: string, fromGitDiff = true): boolean => {
  const isDetectedBadImportRegexOption1 = new RegExp('import(((?!type).|\n)*)@coti-cvi/.*/src')
  const isDetectedBadImportRegexOption2 = new RegExp('import(((?!type).|\n)*)lw-sdk/src')

  const badImportOption1 = isDetectedBadImportRegexOption1.test(sourceLine)
  const badImportOption2 = isDetectedBadImportRegexOption2.test(sourceLine)

  const anyBadImport = badImportOption1 || badImportOption2

  if (anyBadImport) {
    // if this is from a git diff command response, then - indicates a removed line, not added line - therefore ok
    if (fromGitDiff && sourceLine.indexOf('-') === 0) {
      return false
    }
  }
  return anyBadImport
}
const isBackendFile = (filename: string): boolean => {
  if (
    getDisallowedCodeInWhichPackages().some(aBackendServicePackageName =>
      filename.includes(`packages/${aBackendServicePackageName}/`),
    )
  ) {
    return true
  }
  return false
}

const getAllBackendTSFiles = async (): Promise<string[]> => {
  const ret: string[] = []
  const { stdout } = await execa.command(
    `find . -name *.ts ! -path ./packages/lw-sdk/dist/* ! -path ./dist/* ! -path ./node_modules/* ! -path ./**/auto-generated-code/*`,
    { stdio: 'pipe' },
  )

  const arr = stdout.split('\n')
  for (const filename of arr) {
    if (isBackendFile(filename)) {
      console.log(`***BackEnd File **${filename}***`)
      ret.push(filename)
    }
  }

  return ret
}

const testAllBackendFiles = async () => {
  const allFiles = await getAllBackendTSFiles()
  console.log(`allFiles: ${allFiles.length}`)
  for (const file of allFiles) {
    const fileContent = await fs.promises.readFile(file, 'utf8')
    const lines = fileContent.split('\n')
    for (const sourceLine of lines) {
      if (doesSourceCodeLineIncludeBadImport(sourceLine, false)) {
        console.log(
          `${file} - PROBLEMATIC LINE:\n"${sourceLine}"\nNOTE: if you are sure what you are doing use "--no-verify" in git command, to force allow this commit.`,
        )
      }
    }
  }
}

async function main() {
  const startMs = Date.now()

  //console.log(`testAllBackendFiles: ${await testAllBackendFiles()}`)
  const repoPath = __dirname
  const { stdout } = await execa.command(`git diff --name-only --cached`, { stdio: 'pipe' })

  const ii = stdout.split('\n')

  if (!ii) {
    process.exit(0)
  }

  for (const filename of ii) {
    const is_BackendFile = isBackendFile(filename)

    if (is_BackendFile) {
      const { stdout: changedLinesOfCode } = await execa.command(`git diff --cached -- ${filename}`, { stdio: 'pipe' })
      if (1) {
        for (const sourceCodeLine of changedLinesOfCode.split(`\n`)) {
          if (doesSourceCodeLineIncludeBadImport(sourceCodeLine)) {
            console.log(
              `=================================\nerror: cannot approve! source code line below, found on ${filename}: \n\n${sourceCodeLine} \n\nhas a BAD IMPORT (cannot have /src)!\n=================================\n`,
            )
            process.exit(1)
          }
        }
      }
    }
  }

  const endMs = Date.now()

  console.log(
    `${new Date().toLocaleString()}: finished finding any bad import (${((endMs - startMs) / 1000).toFixed(2)}s)`,
  )
}

if (require.main === module) {
  main()
}
