import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import execa from 'execa'
import type { ViteSentryPluginOptions } from 'vite-plugin-sentry'
import viteSentry from 'vite-plugin-sentry'
import path from 'path'
import fs from 'fs'
import { visualizer } from 'rollup-plugin-visualizer'
import svgr from 'vite-plugin-svgr'
import inject from '@rollup/plugin-inject'
import { chunkSplitPlugin } from 'vite-plugin-chunk-split'

enum WebSite {
  Cvi = 'CVI',
  Armadillo = 'ARMADILLO',
}

// https://vitejs.dev/config/
export default defineConfig(async () => {
  const currentWebsite = Object.values(WebSite).find(website => website === process.env.INIT_WEBSITE)

  if (!currentWebsite) {
    throw new Error(
      `process.env.INIT_WEBSITE is not one of ${Object.values(
        WebSite,
      ).join()}, please check the environemnt variables.`,
    )
  }

  const cviSentry = {
    dsn: 'https://e4b083960a38473cb681d703d9383011@o1152131.ingest.sentry.io/6726508',
    url: 'https://sentry.io',
    org: 'cvi',
    project: 'beta-cvi-ui-cvi',
  }

  const armadilloSentry = {
    dsn: 'https://54cea6094f0d4bb9a3feafddad1aedc2@o1152131.ingest.sentry.io/6367444',
    url: 'https://sentry.io',
    org: 'cvi',
    project: 'beta-cvi-ui-armadillo',
  }

  const [gitCommitSha, gitCommitDateUtc] = await Promise.all([
    execa.command('git rev-parse HEAD').then(r => r.stdout),
    execa.command('git show HEAD --quiet --date=local --format="%cd"').then(r => new Date(r.stdout).toISOString()),
    fs.promises.readFile(path.join(__dirname, 'package.json'), 'utf-8').then(r => JSON.parse(r).name),
  ])

  const sentryConfig: ViteSentryPluginOptions = {
    url: 'https://sentry.io',
    authToken: 'fac91cbc360744f1921bb3e334b63ad0c35a1ca3018c4dbcab279c1e9532c841',
    org: 'cvi',
    project: WebSite.Cvi ? cviSentry.project : armadilloSentry.project,
    release: gitCommitSha,
    deploy: {
      env: 'production',
    },
    setCommits: {
      auto: true,
      ignoreMissing: true,
    },
    sourceMaps: {
      include: ['./ui-dist/assets'],
      ignore: ['node_modules'],
      urlPrefix: '~/assets',
    },
  }

  return {
    plugins: [svgr(), react(), tsconfigPaths({ root: '../..' }), viteSentry(sentryConfig), chunkSplitPlugin()],
    server: { open: true },
    build: {
      outDir: 'ui-dist',
      commonjsOptions: {
        transformMixedEsModules: true,
      },
      sourcemap: true,
      rollupOptions: {
        plugins: [visualizer(), inject({ Buffer: ['buffer', 'Buffer'] })],
      },
      minify: true,
    },
    define: {
      'process.env': {
        INIT_WEBSITE: currentWebsite,
        NODE_ENV: process.env.NODE_ENV,
        SENTRY_DSN: currentWebsite === WebSite.Cvi ? cviSentry.dsn : armadilloSentry.dsn,
        SENTRY_URL: currentWebsite === WebSite.Cvi ? cviSentry.url : armadilloSentry.url,
        SENTRY_ORG: currentWebsite === WebSite.Cvi ? cviSentry.org : armadilloSentry.org,
        SENTRY_PROJECT: currentWebsite === WebSite.Cvi ? cviSentry.project : armadilloSentry.project,
        GIT_COMMIT_HASH: gitCommitSha,
        PUBLIC_GIT_COMMIT_HASH: gitCommitSha,
        GIT_COMMIT_DATE_UTC: gitCommitDateUtc,
        PUBLIC_GIT_COMMIT_DATE_UTC: gitCommitDateUtc,
      },
      tailwindConfigReplaceByViteAtCompileTime: require('./tailwind.config'),
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
