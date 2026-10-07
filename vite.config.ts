/// <reference types="vitest/config" />
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// A base vem de BASE_PATH para publicar em subpasta (GitHub Pages: /<repo>/).
// Sem a variável, o site assume a raiz do domínio.
export default defineConfig({
  base: process.env.BASE_PATH ?? '/',
  plugins: [react(), tailwindcss()],
  test: { environment: 'node' },
})
