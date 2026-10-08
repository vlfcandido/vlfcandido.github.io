/// <reference types="vitest/config" />
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// A base vem de BASE_PATH para publicar em subpasta (GitHub Pages: /<repo>/).
// Sem a variável, o site assume a raiz do domínio.
export default defineConfig({
  base: process.env.BASE_PATH ?? '/',
  plugins: [react(), tailwindcss()],
  // worker/ tem os próprios testes (npm test dentro da pasta), com outras dependências.
  test: { environment: 'node', exclude: ['**/node_modules/**', 'worker/**'] },
})
