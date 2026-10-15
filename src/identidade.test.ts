import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { contraste } from './lib/contraste'
import { PALETA } from './identidade'

describe('paleta da identidade "o detalhe que ninguém viu"', () => {
  for (const tema of ['claro', 'escuro'] as const) {
    const p = PALETA[tema]
    it(`${tema}: texto sobre papel é AA`, () => expect(contraste(p.fundo, p.papel)).toBeGreaterThanOrEqual(4.5))
    it(`${tema}: texto secundário sobre papel é AA`, () =>
      expect(contraste(p['fundo-suave'], p.papel)).toBeGreaterThanOrEqual(4.5))
    it(`${tema}: texto do CTA sobre marca-texto é AA`, () =>
      expect(contraste(p['on-sol'], p.sol)).toBeGreaterThanOrEqual(4.5))
    it(`${tema}: link sobre papel é AA`, () => expect(contraste(p.mar, p.papel)).toBeGreaterThanOrEqual(4.5))
  }
})

describe('identidade.css espelha PALETA e as durações', () => {
  const css = readFileSync(resolve(__dirname, 'identidade.css'), 'utf8')
  /** Extrai o corpo do bloco que começa no seletor dado (sem chaves aninhadas). */
  const bloco = (seletor: string): string => {
    const i = css.indexOf(seletor + ' {')
    expect(i, `bloco ${seletor}`).toBeGreaterThanOrEqual(0)
    return css.slice(css.indexOf('{', i) + 1, css.indexOf('}', i))
  }
  const blocos = {
    claro: ':root',
    escuro: ':root:not([data-tema="claro"])',
    'escuro (forçado)': ':root[data-tema="escuro"]',
  }
  for (const [nome, seletor] of Object.entries(blocos)) {
    it(`bloco ${nome} bate com PALETA`, () => {
      const corpo = bloco(seletor)
      const tema = nome === 'claro' ? PALETA.claro : PALETA.escuro
      for (const [k, v] of Object.entries(tema)) expect(corpo, `--${k}`).toContain(`--${k}:${v};`)
    })
  }
  it('durações de movimento ficam entre 150 e 400 ms', () => {
    for (const v of ['mov-toque', 'mov-padrao', 'mov-lento']) {
      const ms = Number(css.match(new RegExp(`--${v}:(\\d+)ms`))?.[1])
      expect(ms).toBeGreaterThanOrEqual(150)
      expect(ms).toBeLessThanOrEqual(400)
    }
  })
})
