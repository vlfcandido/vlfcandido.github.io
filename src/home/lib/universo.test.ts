import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { listarProjetos } from '../../projetos'
import { PECAS, numerosDeProva } from '../conteudo'
import { universoDeProjetos } from './universo'

describe('universo da página de projetos', () => {
  it('lista as peças e os projetos, e o total bate com o número da prova', () => {
    const u = universoDeProjetos()
    expect(u.total).toBe(listarProjetos().length + PECAS.length)
    expect(u.pecas.length + u.projetos.length).toBe(u.total)
    expect(u.total).toBe(numerosDeProva().projetos)
  })
  it('nenhuma peça repete slug de projeto', () => {
    const slugs = new Set(listarProjetos().map((p) => p.slug))
    for (const p of PECAS) expect(slugs.has(p.slug), p.slug).toBe(false)
  })
  it('a página de projetos usa o universo (peças no topo da galeria)', () => {
    const pagina = readFileSync(resolve(__dirname, '../../paginas/Projetos.tsx'), 'utf8')
    expect(pagina).toMatch(/universoDeProjetos\(\)/)
    expect(pagina).toMatch(/pecas=\{/)
  })
})
