import path from 'path'
import fs from 'fs'
import execa from 'execa'

async function main() {
  const startMs = Date.now()

  const repoPath = __dirname

  const packages = await fs.promises.readdir(path.join(repoPath, 'dist', 'packages')).catch(async e => {
    if (e.code === 'ENOENT') {
      console.log("dist/packages folder doesn't exist, building project...")
      await execa.command('yarn tsc --noEmit false', { stdio: 'inherit', cwd: repoPath })
      return fs.promises.readdir(path.join(repoPath, 'dist', 'packages'))
    }
    throw e
  })

  await Promise.all(
    packages.map(async r => {
      const source = path.join(repoPath, 'dist', 'packages', r, 'src')

      const isSrcExist = await fs.promises.stat(source).then(
        () => true,
        () => false,
      )

      if (!isSrcExist) {
        return
      }

      const destination = path.join(repoPath, 'packages', r, 'dist')

      const isPackageStillExist = await fs.promises.stat(path.join(repoPath, 'packages', r)).then(
        () => true,
        () => false,
      )

      if (isPackageStillExist) {
        try {
          await fs.promises.rm(destination, { recursive: true })
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (e: any) {
          if (e.code !== 'ENOENT') {
            throw e
          }
        }
        await fs.promises.mkdir(destination)
        await fs.promises.cp(source, destination, { recursive: true })
      }
    }),
  )

  const endMs = Date.now()

  console.log(
    `${new Date().toLocaleString()}: finished splitting root dist (${((endMs - startMs) / 1000).toFixed(2)}s)`,
  )
}

if (require.main === module) {
  main()
}
