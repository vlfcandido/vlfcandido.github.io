import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { MAX_ESCALONADOS, atrasoDoIndice, iniciarRevelacao, revelacaoPermitida } from './revelar'

const css = readFileSync(new URL('../index.css', import.meta.url), 'utf8')
const bloco = css.slice(css.indexOf('Movimento (09/10/2026)'))

/** Janela falsa: só o que a revelação consulta. */
function janela(reduzir: boolean, comObservador = true) {
  return {
    matchMedia: (q: string) => ({ matches: reduzir && q.includes('reduce') }),
    ...(comObservador ? { IntersectionObserver: function () {} } : {}),
  } as unknown as Window
}

describe('revelação ao rolar', () => {
  it('escalona de 60 em 60 ms e para no teto', () => {
    expect(atrasoDoIndice(0)).toBe(0)
    expect(atrasoDoIndice(2)).toBe(120)
    expect(atrasoDoIndice(40)).toBe(MAX_ESCALONADOS * 60)
    expect(atrasoDoIndice(-3)).toBe(0)
  })

  it('respeita prefers-reduced-motion: não roda e não toca no DOM', () => {
    expect(revelacaoPermitida(janela(true))).toBe(false)
    let consultou = false
    const raiz = { querySelectorAll: () => ((consultou = true), []) } as unknown as ParentNode
    iniciarRevelacao(raiz, janela(true))()
    expect(consultou).toBe(false)
  })

  it('sem IntersectionObserver também não roda', () => {
    expect(revelacaoPermitida(janela(false, false))).toBe(false)
  })

  it('com movimento liberado e observador, roda', () => {
    expect(revelacaoPermitida(janela(false))).toBe(true)
  })
})

describe('CSS de movimento', () => {
  const reduzido = bloco.slice(bloco.lastIndexOf('@media (prefers-reduced-motion: reduce)'))

  it('desliga animações, transições e View Transitions com menos movimento', () => {
    expect(reduzido).toMatch(/animation-duration:\s*0\.01ms !important/)
    expect(reduzido).toMatch(/transition-duration:\s*0\.01ms !important/)
    expect(reduzido).toMatch(/::view-transition-old\(\*\)/)
    expect(reduzido).toMatch(/\.vai-entrar\s*{\s*opacity:\s*1;\s*transform:\s*none;/)
  })

  it('o que entra animado usa só transform e opacidade (sem layout)', () => {
    const transicoes = [...bloco.matchAll(/transition:([^;]+);/g)].map((m) => m[1])
    for (const t of transicoes) expect(t).not.toMatch(/\b(width|height|top|left|right|bottom|margin|padding)\b/)
  })

  it('usa os tokens de movimento, sem duração solta', () => {
    const duracoes = [...bloco.matchAll(/(?:transition|animation)(?:-duration)?:[^;]*?(\d+(?:\.\d+)?m?s)\b/g)].map((m) => m[1])
    expect(duracoes.filter((d) => !['0.01ms', '0s', '0ms'].includes(d))).toEqual([])
  })
})
