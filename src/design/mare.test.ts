import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import tokens from './mare.tokens.json'

const css = readFileSync(new URL('../mare.css', import.meta.url), 'utf8')

/** Extrai as variáveis `--nome: valor;` de um trecho de CSS. */
function variaveis(trecho: string): Record<string, string> {
  return Object.fromEntries([...trecho.matchAll(/--([\w-]+):\s*([^;]+);/g)].map((m) => [m[1], m[2].trim()]))
}

describe('Maré: mare.css segue o tokens.json', () => {
  const [claro, resto] = css.split('@media (prefers-color-scheme: dark)')
  const escuroForcado = css.slice(css.indexOf(':root[data-tema="escuro"]'))
  const escuroSistema = resto.slice(0, resto.indexOf(':root[data-tema="escuro"]'))
  const cores = tokens.color.tokens.filter((c) => !c.value.light.startsWith('{'))

  it.each(cores.map((c) => [c.name, c.value.light, c.value.dark] as const))('%s', (nome, claroEsperado, escuroEsperado) => {
    expect(variaveis(claro)[nome]).toBe(claroEsperado)
    expect(variaveis(escuroSistema)[nome]).toBe(escuroEsperado)
    expect(variaveis(escuroForcado)[nome]).toBe(escuroEsperado)
  })
})

describe('Maré: tokens de movimento', () => {
  const [claro] = css.split('@media (prefers-color-scheme: dark)')
  const vars = variaveis(claro)

  it.each(tokens.motion.tokens.map((m) => [m.name, m.value] as const))('%s', (nome, valor) => {
    expect(vars[nome]).toBe(valor)
  })

  it('durações ficam entre 150 e 400 ms', () => {
    for (const m of tokens.motion.tokens.filter((t) => t.value.endsWith('ms'))) {
      const ms = Number.parseInt(m.value, 10)
      expect(ms).toBeGreaterThanOrEqual(150)
      expect(ms).toBeLessThanOrEqual(400)
    }
  })
})
