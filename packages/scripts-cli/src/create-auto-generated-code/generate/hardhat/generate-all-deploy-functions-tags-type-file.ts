import path from 'path'
import { glob } from 'typechain'
import type { DeployFunction } from 'hardhat-deploy/types'

export const generateAllDeployFunctionsTagsTypeFileTask = async ({
  repoPath,
}: {
  repoPath: string
}): Promise<{ imports: string[]; code: string }> => {
  const allDeployFiles = glob(
    path.join(repoPath, 'packages', 'contracts-deploy', 'src', 'deploy'),
    [path.join('**', '*.ts')],
    true,
  )

  const modules = await Promise.all(
    allDeployFiles.map<Promise<{ default: DeployFunction }>>(async modulePath => import(modulePath)),
  )

  const tags = Array.from(new Set<string>(modules.flatMap(m => m.default.tags ?? [])))

  const code = `export type AllDeployFunctionsTags = ${tags.map(tag => `'${tag}'`).join(' | ')}\n\
export const deploymentTags = [${tags.map(t => `'${t}'`).join(', ')}] as const`

  return { imports: [], code }
}
