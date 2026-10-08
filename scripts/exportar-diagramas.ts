// Exporta os desenhos como SVG com cores fixas (claro e escuro), para READMEs e prévias.
// Uso: node --experimental-strip-types scripts/exportar-diagramas.ts <pasta-de-saída> [modo]
// Lê as cores de src/design/mare.tokens.json, a mesma fonte do site.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { listarDesenhos } from '../src/diagramas/desenhos.ts'
import { desenharSvg, type Paleta, type Modo } from '../src/diagramas/motor.ts'

type Token = { name: string; value: string | { light: string; dark: string } }

/** Monta a paleta de um tema a partir do JSON de tokens. */
function paleta(tema: 'light' | 'dark'): Paleta & { papel: string } {
  const json = JSON.parse(readFileSync(new URL('../src/design/mare.tokens.json', import.meta.url), 'utf8'))
  const v = (n: string) => {
    const t = (json.color.tokens as Token[]).find((x) => x.name === n)!
    return typeof t.value === 'string' ? t.value : t.value[tema]
  }
  return {
    papel: v('papel'), papelAlto: v('papel-alto'), raso: v('raso'), linha: v('linha'), fundo: v('fundo'),
    fundoSuave: v('fundo-suave'), mar: v('mar'), coral: v('coral'), coralTexto: v('coral-texto'),
  }
}

/** Ponto de entrada: grava <id>-claro.svg e <id>-escuro.svg na pasta pedida. */
function main() {
  const saida = process.argv[2] ?? 'diagramas'
  const modo = (process.argv[3] ?? 'largo') as Modo
  mkdirSync(saida, { recursive: true })
  for (const d of Object.values(listarDesenhos())) {
    for (const [tema, nome] of [['light', 'claro'], ['dark', 'escuro']] as const) {
      const p = paleta(tema)
      const sufixo = modo === 'largo' ? '' : `-${modo}`
      writeFileSync(join(saida, `${d.id}${sufixo}-${nome}.svg`), desenharSvg(d, modo, p, { prefixo: nome, fundo: p.papel }))
    }
  }
}

main()
