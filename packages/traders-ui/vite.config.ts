import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths({ root: '../..' })],
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
      SENTRY_DSN: 'https://0196ee542e134c2cadb14086cb7f486f@o1152131.ingest.sentry.io/6531288',
    },
  },
  resolve: {
    alias: {
      stream: 'rollup-plugin-node-polyfills/polyfills/stream',
      http: 'rollup-plugin-node-polyfills/polyfills/http',
      https: 'rollup-plugin-node-polyfills/polyfills/http',
    },
  },
})
