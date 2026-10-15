/// <reference types="vitest/config" />
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { readdirSync, readFileSync } from 'node:fs'
import { join, relative } from 'node:path'
import { defineConfig } from 'vite'

/**
 * Conta os `it(` de cada arquivo de teste em src/, no momento do build.
 * 15/10/2026: antes a peça "Raio-X" importava os testes crus (`?raw`) e o código-fonte deles ia para o site
 * público. Agora só o nome do arquivo e o total chegam ao navegador.
 */
function contarTestes(raiz: string): { nome: string; total: number }[] {
  const lista: { nome: string; total: number }[] = []
  const andar = (dir: string) => {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      const caminho = join(dir, e.name)
      if (e.isDirectory()) andar(caminho)
      else if (e.name.endsWith('.test.ts')) {
        const total = (readFileSync(caminho, 'utf8').match(/\bit(?:\.each)?\(/g) ?? []).length
        lista.push({ nome: relative(raiz, caminho), total })
      }
    }
  }
  andar(raiz)
  return lista.sort((a, b) => b.total - a.total)
}

// A base vem de BASE_PATH para publicar em subpasta (GitHub Pages: /<repo>/).
// Sem a variável, o site assume a raiz do domínio.
export default defineConfig({
  base: process.env.BASE_PATH ?? '/',
  plugins: [react(), tailwindcss()],
  define: { __TESTES_DO_SITE__: JSON.stringify(contarTestes(join(import.meta.dirname, 'src'))) },
  test: { environment: 'node' },
})
