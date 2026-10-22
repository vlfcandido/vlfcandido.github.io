// Gera o currículo: public/curriculo/index.html (página) e public/curriculo-vinicius-candido.pdf (A4).
// Uso: npm run curriculo. Lê src/curriculo.ts pelo Vite (a mesma fonte do site) e imprime com o Chrome headless.
// Rodar de novo sempre que trajetoria.ts mudar; o PDF vai versionado, porque o deploy não tem Chrome.
import { execFileSync } from 'node:child_process'
import { mkdirSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { createServer } from 'vite'

const CHROME = process.env.CHROME ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const raiz = fileURLToPath(new URL('..', import.meta.url))

/**
 * Monta o HTML pelo Vite, grava a página e imprime o PDF.
 *
 * @returns nada; escreve os dois arquivos em public/.
 */
async function gerar() {
  const vite = await createServer({ root: raiz, logLevel: 'error', server: { middlewareMode: true } })
  try {
    const { montarCurriculoHtml } = await vite.ssrLoadModule('/src/curriculo.ts')
    mkdirSync(`${raiz}public/curriculo`, { recursive: true })
    const pagina = `${raiz}public/curriculo/index.html`
    writeFileSync(pagina, montarCurriculoHtml())
    const pdf = `${raiz}public/curriculo-vinicius-candido.pdf`
    execFileSync(CHROME, ['--headless=new', '--disable-gpu', '--no-pdf-header-footer', '--virtual-time-budget=8000', `--print-to-pdf=${pdf}`, `file://${pagina}`], { stdio: 'ignore' })
    console.log(`ok: ${pagina}\nok: ${pdf}`)
  } finally {
    await vite.close()
  }
}

await gerar()
