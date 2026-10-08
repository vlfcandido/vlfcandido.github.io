import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { listarProjetos } from './projetos'
import { capasDosProjetos, printsDosCasos } from './visuais'

const RAIZ = resolve(__dirname, '..')
const PUBLICO = join(RAIZ, 'public')
const PROPRIOS = [
  'aprovaos', 'nexus-quant', 'varredura-voos', 'app-score', 'engenharia-de-agentes', 'revisor-ia', 'ia-local', 'benchmark-litellm',
]

/** Lista os arquivos de texto do site (sem testes e sem a lista de termos proibidos, que cita as palavras para barrá-las). */
function textos(pasta: string): string[] {
  return readdirSync(pasta).flatMap((nome) => {
    const c = join(pasta, nome)
    if (statSync(c).isDirectory()) return textos(c)
    return /\.(ts|tsx|css|html)$/.test(nome) && !/\.test\.ts$/.test(nome) && nome !== 'termos-proibidos.ts' ? [c] : []
  })
}

describe('capas e telas recriadas dos projetos próprios (08/10/2026)', () => {
  it('os 8 projetos próprios com tela têm capa colorida, telas e selo de dados fictícios', () => {
    const itens = listarProjetos()
    PROPRIOS.forEach((slug) => {
      const item = itens.find((i) => i.slug === slug)!
      expect(item.capa?.colorida, slug).toBe(true)
      expect(item.capa?.ficticio, slug).toBe(true)
      expect(item.telas?.length, slug).toBeGreaterThanOrEqual(2)
    })
  })
  it('toda tela e toda capa de dado fictício leva o selo', () => {
    Object.values(printsDosCasos).flat().forEach((p) => expect(p.ficticio, p.arquivo).toBe(true))
    Object.values(capasDosProjetos).filter((c) => c.colorida).forEach((c) => expect(c.ficticio, c.nome).toBe(true))
  })
  it('todo arquivo citado existe em AVIF e WebP, com a capa também em JPEG', () => {
    Object.values(printsDosCasos).flat().forEach((p) => {
      const v = p.variantes!
      v.larguras.forEach((w) => ['avif', 'webp'].forEach((e) => expect(existsSync(join(PUBLICO, `${v.base}-${w}.${e}`)), `${v.base}-${w}.${e}`).toBe(true)))
    })
    Object.values(capasDosProjetos).filter((c) => c.colorida).forEach((c) =>
      c.larguras.forEach((w) => ['avif', 'webp', 'jpg'].forEach((e) => expect(existsSync(join(PUBLICO, `img/${c.nome}-${w}.${e}`)), `${c.nome}-${w}.${e}`).toBe(true))),
    )
  })
  it('nenhuma tela passa de 150 KB e as capas ficam em até 1200 px', () => {
    readdirSync(join(PUBLICO, 'prints')).filter((f) => /\.(avif|webp)$/.test(f)).forEach((f) =>
      expect(statSync(join(PUBLICO, 'prints', f)).size, f).toBeLessThanOrEqual(150 * 1024),
    )
    Object.values(capasDosProjetos).filter((c) => c.colorida).forEach((c) => expect(Math.max(...c.larguras)).toBeLessThanOrEqual(1200))
  })
  it('o bot de pedidos fica fora do site (banco de provas manda não citar)', () => {
    expect(listarProjetos().some((i) => i.slug.includes('pedidos'))).toBe(false)
    expect(readdirSync(join(PUBLICO, 'prints')).some((f) => f.includes('pedidos'))).toBe(false)
  })
  it('o ranking da varredura de voos é por preço, não por duração', () => {
    const v = listarProjetos().find((i) => i.slug === 'varredura-voos')!
    const t = JSON.stringify(v).toLowerCase()
    expect(t).not.toMatch(/prioriza a duração|mais curta|ordenado por duração|ordena o resultado pela duração/)
    expect(v.print?.alt).toMatch(/por preço/)
    const peca = readFileSync(join(RAIZ, 'src/components/case/pecas/TerminalCota.tsx'), 'utf8')
    expect(peca).toMatch(/preço\s+esc\./)
    expect(peca).not.toMatch(/'duração esc\./)
  })
})

describe('Angola', () => {
  it('nenhuma ocorrência de Angola, Luanda ou Kwanza em texto do site', () => {
    const arquivos = [...textos(join(RAIZ, 'src')), join(RAIZ, 'index.html')]
    arquivos.forEach((a) => expect(readFileSync(a, 'utf8'), a).not.toMatch(/angola|luanda|kwanza/i))
  })
})
