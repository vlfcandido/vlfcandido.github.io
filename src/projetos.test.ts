import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { empresasDiretas, gruposClientes } from './clientes'
import { encontrarTermosProibidos } from './lib/termos-proibidos'
import { filtrarProjetos, listarProjetos, tiposProjeto } from './projetos'

const PUBLICO = join(__dirname, '..', 'public')
// O Sicoob pode aparecer (decisão dele, 07/10/2026); o resto da guarda vale.
const proibidos = (texto: string) => encontrarTermosProibidos(texto).filter((t) => t !== 'sicoob')
const itens = listarProjetos()
const porSlug = (s: string) => itens.find((i) => i.slug === s)

describe('galeria de projetos', () => {
  it('não tem termo proibido', () => expect(proibidos(JSON.stringify(itens))).toEqual([]))
  it('slugs únicos em kebab-case', () => {
    itens.forEach((i) => expect(i.slug).toMatch(/^[a-z0-9-]+$/))
    expect(new Set(itens.map((i) => i.slug)).size).toBe(itens.length)
  })
  it('todo projeto próprio tem print que existe', () =>
    itens.filter((i) => i.origem === 'proprio').forEach((i) => {
      expect(i.print, i.slug).toBeTruthy()
      expect(existsSync(join(PUBLICO, i.print!.arquivo)), i.print!.arquivo).toBe(true)
      if (i.printExtra) expect(existsSync(join(PUBLICO, i.printExtra.arquivo))).toBe(true)
    }))
  it('todo caso de empresa tem logo conhecida ou desenho', () => {
    const slugs = new Set([...empresasDiretas, ...gruposClientes.flatMap((g) => g.clientes)].map((e) => e.slug))
    itens
      .filter((i) => i.origem === 'empresa')
      .forEach((i) => expect((i.empresa && slugs.has(i.empresa)) || Boolean(i.diagrama), i.slug).toBe(true))
  })
  it('projeto de cliente feito por mim não tem link de código', () =>
    ['ecovita', 'minu'].forEach((s) => expect(porSlug(s)?.repositorio, s).toBeUndefined()))
  it('card tem de 2 a 4 etiquetas e resultado de uma linha', () =>
    itens.forEach((i) => {
      expect(i.etiquetas.length, i.slug).toBeGreaterThanOrEqual(2)
      expect(i.etiquetas.length, i.slug).toBeLessThanOrEqual(4)
      expect(i.resultado.length, i.slug).toBeLessThanOrEqual(90)
    }))
  it('tipos conhecidos', () => itens.forEach((i) => i.tipos.forEach((t) => expect(tiposProjeto[t]).toBeTruthy())))
  it('todo filtro mostra ao menos um projeto próprio', () =>
    (Object.keys(tiposProjeto) as (keyof typeof tiposProjeto)[]).forEach((t) =>
      expect(filtrarProjetos(itens, t).some((i) => i.origem === 'proprio'), t).toBe(true)))
  it('repositório só no GitHub do perfil', () =>
    itens.filter((i) => i.repositorio).forEach((i) => expect(i.repositorio).toMatch(/^https:\/\/github\.com\/vlfcandido\/[a-z0-9.-]+$/)))

  // Status honesto, conforme o banco de provas (07/10/2026). Não aparece no site, mas trava os textos.
  it('bot de trading é estudo, diz que roda em simulação e não fala em lucro', () => {
    const q = porSlug('nexus-quant')!
    expect(q.status).toBe('estudo')
    expect(JSON.stringify(q).toLowerCase()).not.toMatch(/lucro|rendimento|ganho|market making/)
    expect(q.numeros.join(' ')).toContain('simulação')
  })
  it('agente de vídeo é protótipo e sem link de repositório', () => {
    expect(porSlug('nexus-clips')?.status).toBe('prototipo')
    expect(porSlug('nexus-clips')?.repositorio).toBeUndefined()
  })
  it('AprovaOS é MVP', () => expect(porSlug('aprovaos')?.status).toBe('mvp'))
  // Exceção (08/10/2026): o próprio site e o design system dele estão no ar de verdade.
  it('projeto próprio nunca é "em produção", salvo o site e o design system dele', () =>
    itens
      .filter((i) => i.origem === 'proprio' && !['este-site', 'design-system-mare'].includes(i.slug))
      .forEach((i) => expect(i.status, i.slug).not.toBe('producao')))
  it('filtro de frontend reúne os projetos com tela', () => {
    const slugs = filtrarProjetos(itens, 'frontend').map((i) => i.slug)
    for (const s of ['nexus-clips', 'nexus-quant', 'app-score', 'aprovaos', 'este-site', 'design-system-mare']) expect(slugs, s).toContain(s)
    expect(filtrarProjetos(itens, 'frontend').every((i) => i.origem === 'proprio')).toBe(true)
  })
  it('app de score: prova de conceito, sem link de código e sem citar país do cliente', () => {
    const a = porSlug('app-score')!
    expect(a.status).toBe('prototipo')
    expect(a.repositorio).toBeUndefined()
    expect(JSON.stringify(a).toLowerCase()).not.toMatch(/angola|luanda|kwanza|cliente em/)
  })
  it('fora: bot de pedidos e IA local', () => {
    const tudo = JSON.stringify(itens).toLowerCase()
    expect(tudo).not.toContain('bot-pedidos')
    expect(tudo).not.toContain('llm-local')
  })
})
