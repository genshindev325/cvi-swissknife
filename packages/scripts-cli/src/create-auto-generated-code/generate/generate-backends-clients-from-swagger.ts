import path from 'path'
import fs from 'fs'
import { generate } from 'openapi-typescript-codegen'

export async function generateBackendApiClientFromSwagger({
  swaggerPath,
  outputFilePath,
}: {
  swaggerPath: string
  outputFilePath: string
}): Promise<void> {
  try {
    await fs.promises.mkdir(outputFilePath, { recursive: true })
  } catch (e) {
    if (e.code === 'EEXIST') {
      return
    }
    throw e
  }

  await generate({
    input: swaggerPath,
    output: outputFilePath,
    httpClient: 'axios',
    useUnionTypes: false,
    useOptions: true,
    clientName: 'AppClient',
  })
}

export async function generateBackendsApiClientFromSwagger({ repoPath }: { repoPath: string }): Promise<void> {
  const swaggerFilesPath = path.join(repoPath, 'packages', 'auto-generated-code', 'src', 'backend-swaggers')
  const swaggerFileNames = await fs.promises.readdir(swaggerFilesPath)
  const filtered = swaggerFileNames.filter(fileName => fileName.endsWith('.json'))

  await Promise.all(
    filtered.map(swaggerFileName =>
      generateBackendApiClientFromSwagger({
        swaggerPath: path.join(swaggerFilesPath, swaggerFileName),
        outputFilePath: path.join(
          repoPath,
          'packages',
          'auto-generated-code',
          'src',
          'backend-client-apis',
          `${swaggerFileName.replace('.json', '')}-client`,
        ),
      }),
    ),
  )
}
