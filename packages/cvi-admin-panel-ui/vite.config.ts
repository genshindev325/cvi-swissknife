import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import execa from 'execa'
import type { ViteSentryPluginOptions } from 'vite-plugin-sentry'
import viteSentry from 'vite-plugin-sentry'
import path from 'path'
import svgr from 'vite-plugin-svgr'
import fs from 'fs'

// https://vitejs.dev/config/
// @ts-ignore
export default defineConfig(async () => {
  const [gitCommitSha, gitCommitDateUtc, packageJsonName] = await Promise.all([
    execa.command('git rev-parse HEAD').then(r => r.stdout),
    execa.command('git show HEAD --quiet --date=local --format="%cd"').then(r => new Date(r.stdout).toISOString()),
    fs.promises.readFile(path.join(__dirname, 'package.json'), 'utf-8').then(r => JSON.parse(r).name),
  ])

  const sentryConfig: ViteSentryPluginOptions = {
    url: 'https://sentry.io',
    authToken: 'fac91cbc360744f1921bb3e334b63ad0c35a1ca3018c4dbcab279c1e9532c841',
    org: 'cvi',
    project: packageJsonName,
    release: gitCommitSha,
    deploy: {
      env: 'production',
    },
    setCommits: {
      auto: true,
    },
    sourceMaps: {
      include: ['./ui-dist/assets'],
      ignore: ['node_modules'],
      urlPrefix: '~/assets',
    },
  }

  return {
    server: {
      open: true,
    },
    plugins: [svgr(), react(), tsconfigPaths({ root: '../..' }), viteSentry(sentryConfig)],
    build: {
      outDir: 'ui-dist',
      commonjsOptions: {
        transformMixedEsModules: true,
      },
      sourcemap: true,
    },
    define: {
      'process.env': {
        NODE_ENV: process.env.NODE_ENV,
        SENTRY_DSN: 'https://29bec7aa6c064b7db3400b6191b0d46a@o1152131.ingest.sentry.io/6531287',
        GIT_COMMIT_HASH: gitCommitSha,
        PUBLIC_GIT_COMMIT_HASH: gitCommitSha,
        GIT_COMMIT_DATE_UTC: gitCommitDateUtc,
        PUBLIC_GIT_COMMIT_DATE_UTC: gitCommitDateUtc,
      },
    },
    resolve: {
      alias: {
        stream: 'rollup-plugin-node-polyfills/polyfills/stream',
        http: 'rollup-plugin-node-polyfills/polyfills/http',
        https: 'rollup-plugin-node-polyfills/polyfills/http',
      },
    },
  }
})
