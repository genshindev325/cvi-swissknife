import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig(async () => {
  return {
    plugins: [react(), tsconfigPaths({ root: '../..' })],
    server: { open: true },
    build: {
      outDir: 'ui-dist',
    },
    test: {
      environment: 'jsdom',
      watch: false,
      testTimeout: 60000,
      env: {
        IS_TEST_MODE: 'true',
      },
      allowOnly: true,
      setupFiles: './vitest.before-all.ts',
    },
    define: {
      'process.env': {
        NODE_DEBUG: '',
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
