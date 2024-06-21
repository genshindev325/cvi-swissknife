import 'reflect-metadata'
import '@testing-library/jest-dom/extend-expect'
// @ts-ignore
import pkgUp from 'pkg-up'
import path from 'path'

jest.setTimeout(process.env.CI ? 100 * 1000 : 2000 * 1000)

// eslint-disable-next-line no-process-env
process.env.IS_TEST_MODE = 'true'

function changeCwdToPackageDir() {
  //@ts-ignore
  const testPath: string = global.testPath

  const packageJsonPath = pkgUp.sync({
    cwd: testPath,
  })

  if (!packageJsonPath) {
    throw new Error(`jest.setup.ts - can't find package.json of ${testPath}`)
  }

  const packageDir = path.dirname(packageJsonPath)

  // hardhat tests must be run in the hardhat project root directory which is where the hardhhat.config.ts is located!
  process.chdir(packageDir)
}

changeCwdToPackageDir()
