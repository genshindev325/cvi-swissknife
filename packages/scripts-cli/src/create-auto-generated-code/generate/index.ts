import path from 'path'
import fs from 'fs'
import os from 'os'
import { generateHardhatDeployTypedFunctionFile } from './hardhat/generate-hardhat-deploy-typed-function-overloads-file'
import { generateHardhatEthersGetContractTypedFunctionFile } from './hardhat/generate-hardhat-ethers-get-contract-typed-function-overloads-file'
// import { generateTypesFromMultipleAbiFilesTask } from './hardhat/generate-types-from-multiple-abi-files'
import { generateHardhatDeployAndOVerrideContractNameTypedFunctionFile } from './hardhat/generate-hardhat-deploy-and-override-contract-name-typed-function-overloads-file'
import { generateHardhatDeployProxyTypedFunctionFile } from './hardhat/generate-hardhat-deploy-proxy-typed-function-overloads-file'
import { generateHardhatUpgradeProxyTypedFunctionFile } from './hardhat/generate-hardhat-upgrade-proxy-typed-function-overloads-file'
import { generateBackendsApiClientFromSwagger } from './generate-backends-clients-from-swagger'
import { generateEthersGetContractTypedFunctionFile } from './generate-ethers-get-contract-typed-function-overloads-file'
import { generateAllDeployFunctionsTagsTypeFileTask } from './hardhat/generate-all-deploy-functions-tags-type-file'
import { generateHardhatConnectOverloads } from './hardhat/generate-hardhat-connect-typed-function-overloads'
import { generateHardhatExecuteOverloads } from './hardhat/generate-hardhat-execute-typed-function-overloads'
import { generateHardhatExecuteWithNameOverloads } from './hardhat/generate-hardhat-execute-with-name-typed-function-overloads'
import { generateHardhatReadOverloads } from './hardhat/generate-hardhat-read-typed-function-overloads'
import { generateHardhatGrantRoleIfNotSetOverloads } from './hardhat/generate-hardhat-grant-role-if-not-set-typed-function-overloads'
import { generateHardhatReadWithNameOverloads } from './hardhat/generate-hardhat-read-with-name-typed-function-overloads'
import { generateHardhatDeploySimplifiedTypedFunctionFile } from './hardhat/generate-hardhat-deploy-simplified-typed-function-overloads-file'
import { generateHardhatDeployProxySimplifiedTypedFunctionFile } from './hardhat/generate-hardhat-deploy-proxy-simplefied-typed-function-overloads-file'
import { generateHardhatMockTypedFunctionFile } from './hardhat/generate-hardhat-mock-typed-function-overloads-file'

export async function createTypesFile({
  repoPath,
  taskId,
  skipCache,
}: {
  repoPath: string
  taskId: number
  skipCache: boolean
}): Promise<void> {
  const startMs = Date.now()
  try {
    if (skipCache) {
      console.log(`skipping cache, rebuilding...`)
    }

    const indexFileContent = await fs.promises.readFile(
      path.join(repoPath, 'packages', 'auto-generated-code', 'src', 'git-contract-types', 'index.ts'),
      'utf8',
    )
    const allContractsNames = indexFileContent
      .split(os.EOL)
      .filter(line => line.includes('__factory'))
      .map(line => line.replaceAll(' ', '').split('export{')[1].split('__')[0])

    const [results] = await Promise.all([
      Promise.all([
        generateAllDeployFunctionsTagsTypeFileTask({ repoPath }),
        generateHardhatDeployAndOVerrideContractNameTypedFunctionFile({ allContractsNames }),
        generateHardhatDeployTypedFunctionFile({ allContractsNames }),
        generateHardhatDeployProxyTypedFunctionFile({ allContractsNames }),
        generateHardhatUpgradeProxyTypedFunctionFile({ allContractsNames }),
        generateHardhatEthersGetContractTypedFunctionFile({ allContractsNames }),
        generateEthersGetContractTypedFunctionFile({ allContractsNames }),
        generateHardhatConnectOverloads({ allContractsNames }),
        generateHardhatExecuteOverloads({ allContractsNames }),
        generateHardhatExecuteWithNameOverloads({ allContractsNames }),
        generateHardhatReadOverloads({ allContractsNames }),
        generateHardhatGrantRoleIfNotSetOverloads({ allContractsNames }),
        generateHardhatReadWithNameOverloads({ allContractsNames }),
        generateHardhatDeploySimplifiedTypedFunctionFile({ allContractsNames }),
        generateHardhatDeployProxySimplifiedTypedFunctionFile({ allContractsNames }),
        generateHardhatMockTypedFunctionFile({ allContractsNames }),
      ]),
      // generateTypesFromMultipleAbiFilesTask({ repoPath, skipCache }),
      generateBackendsApiClientFromSwagger({ repoPath }),
    ])

    await fs.promises.writeFile(
      path.join(repoPath, 'packages', 'auto-generated-code', 'src', 'utils.ts'),
      `\
/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

${Array.from(new Set(results.flatMap(r => r.imports))).join('\n')}

export type Head<T extends (...args: any) => any> = Required<Parameters<T>> extends [...infer Head, any] ? Head : any[]

type GetDeployMethod<C> = C extends { deploy: Function } ? C['deploy'] : any
type GetInitMethod<C> = C extends { initialize: Function } ? C['initialize'] : any
      
${results.map(r => r.code).join(`

// --------------------------------------------------------------------
// --------------------------------------------------------------------
// --------------------------------------------------------------------

`)}`,
      'utf-8',
    )
  } finally {
    const endMs = Date.now()

    console.log(
      `${new Date().toLocaleString()} (taskId: ${taskId}): finished generating types and apis from swagger at: "@coti-cvi/auto-generated-code" (${(
        (endMs - startMs) /
        1000
      ).toFixed(2)}s)`,
    )
  }
}
