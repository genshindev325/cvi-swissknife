import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import execa from 'execa'

// https://vitejs.dev/config/
export default defineConfig(async () => {
  const [gitCommitSha, gitCommitDateUtc] = await Promise.all([
    execa.command('git rev-parse HEAD').then(r => r.stdout),
    execa.command('git show HEAD --quiet --date=local --format="%cd"').then(r => new Date(r.stdout).toISOString()),
  ])
  return {
    plugins: [react(), tsconfigPaths({ root: '../..' })],
    server: { open: true },
    build: {
      outDir: 'ui-dist',
      sourcemap: true,
    },
    define: {
      'process.env': {
        NODE_DEBUG: undefined,
        GIT_COMMIT_HASH: gitCommitSha,
        GIT_COMMIT_DATE_UTC: gitCommitDateUtc,
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
