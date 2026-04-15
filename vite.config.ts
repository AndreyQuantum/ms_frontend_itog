/// <reference types="vitest" />
import { defineConfig, loadEnv } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      react(),
      babel({ presets: [reactCompilerPreset()] }),
    ],
    server: {
      proxy: {
        '/api/gemini': {
          target: 'https://generativelanguage.googleapis.com',
          changeOrigin: true,
          rewrite: (path) => {
            const rewritten = path.replace(/^\/api\/gemini/, '/v1beta')
            const separator = rewritten.includes('?') ? '&' : '?'
            return `${rewritten}${separator}key=${env.VITE_GEMINI_API_KEY}`
          },
        },
      },
    },
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['./src/__tests__/setup.ts'],
      css: { modules: { classNameStrategy: 'non-scoped' } },
    },
  }
})
