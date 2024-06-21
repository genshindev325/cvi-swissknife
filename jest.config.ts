import type { Config } from '@jest/types'
import path from 'path'
import fs from 'fs'
import { pathsToModuleNameMapper } from 'ts-jest'

export default async (): Promise<Config.InitialOptions> => {
  const { compilerOptions } = JSON.parse(await fs.promises.readFile(path.join(__dirname, 'tsconfig.json'), 'utf-8'))
  const packageNames = await fs.promises.readdir(path.join(__dirname, 'packages'))
  const baseConfig: Config.InitialOptions = {
    testRunner: 'jest-circus/runner',
    moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: path.join(__dirname, 'packages/') }),
    setupFilesAfterEnv: [path.join(__dirname, 'jest.setup.ts')],
    preset: 'ts-jest',
    globals: {
      'ts-jest': {
        tsconfig: path.join(__dirname, 'tsconfig.json'),
      },
    },
  }

  return {
    prettierPath: require.resolve('prettier'),
    projects: packageNames.map(packageName => ({
      displayName: 'backend',
      testEnvironment: path.join(__dirname, 'jest.custom-node-enviroment.js'),
      testMatch: [path.join(__dirname, `packages/${packageName}/__tests__/**/*.spec.ts`)],
      ...baseConfig,
    })),
  }
}
