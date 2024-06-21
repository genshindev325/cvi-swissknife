import type { Package, Packages } from '@manypkg/get-packages'

export type CiCdContext = {
  repoPath: string
  packages: Packages
  gitHeadSha: string
  gitBranchName: string
  formattedGitBranchName: string
  isRunningInGithubActions: boolean
  isMainBuild: boolean
  isPrBuild: boolean
  previousGitOriginMainShaFromCache?: string
  repoChecksum: string
  runOnlyOnPackageNames: string[]
}

export type ChangedPackages = {
  hardhat: boolean
  backends: boolean
  frontends: Package[]
  npmPackages: Package[]
}

export type CiCdCommandArguments = {
  packages: string
  githubUsername: string | undefined
  githubAccessToken: string | undefined
  npmRegistryToken: string | undefined
  npmRegistryAddress: string | undefined
  dockerRegistryUsername: string | undefined
  dockerRegistryToken: string | undefined
  k8sConfigBase64: string | undefined
  k8sNamespaceToDeploy: string | undefined
  deployUiPackagesStrategy: 'skip' | 'pr-branch-url' | 'main-branch-url'
  publishNpmPackages: boolean | undefined
  deployBackendPackagesToK8s: 'skip' | 'dry-run' | 'production'
  keyValueStoreApiKey: string | undefined
  baseGitDiffInTestModeOnly: string | undefined
  runGitDiffVerifications: boolean
  runDockerBuild: boolean
}
