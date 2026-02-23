import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  return {
    base: mode === "production" ? "/SWE-632-V1" : "/",
    plugins: [
      vue(),
      vueDevTools(),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          silenceDeprecations: ['mixed-decls', 'if-function', 'color-functions', 'global-builtin', 'import']
        },
      }
    },
  }
})
