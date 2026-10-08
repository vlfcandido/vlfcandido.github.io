import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { empresasDiretas } from './clientes'
import { encontrarTermosProibidos } from './lib/termos-proibidos'
import { filtrarProjetos, listarProjetos, statusProjeto, tiposProjeto } from './projetos'

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
  it('todo caso de empresa tem logo de empresa conhecida', () => {
    const slugs = new Set(empresasDiretas.map((e) => e.slug))
    itens.filter((i) => i.origem === 'empresa').forEach((i) => expect(slugs.has(i.empresa!), i.slug).toBe(true))
  })
  it('card tem de 2 a 4 etiquetas e resultado de uma linha', () =>
    itens.forEach((i) => {
      expect(i.etiquetas.length, i.slug).toBeGreaterThanOrEqual(2)
      expect(i.etiquetas.length, i.slug).toBeLessThanOrEqual(4)
      expect(i.resultado.length, i.slug).toBeLessThanOrEqual(90)
    }))
  it('tipos e status conhecidos', () =>
    itens.forEach((i) => {
      expect(statusProjeto[i.status]).toBeTruthy()
      i.tipos.forEach((t) => expect(tiposProjeto[t]).toBeTruthy())
    }))
  it('todo filtro mostra ao menos um projeto próprio', () =>
    (Object.keys(tiposProjeto) as (keyof typeof tiposProjeto)[]).forEach((t) =>
      expect(filtrarProjetos(itens, t).some((i) => i.origem === 'proprio'), t).toBe(true)))
  it('repositório só no GitHub do perfil', () =>
    itens.filter((i) => i.repositorio).forEach((i) => expect(i.repositorio).toMatch(/^https:\/\/github\.com\/vlfcandido\/[a-z0-9-]+$/)))

  // Status honesto, conforme o banco de provas (07/10/2026).
  it('bot de trading é estudo, em simulação e sem lucro prometido', () => {
    const q = porSlug('nexus-quant')!
    expect(q.status).toBe('estudo')
    expect(JSON.stringify(q).toLowerCase().replaceAll('sem lucro', '')).not.toMatch(/lucro|rendimento|ganho|market making/)
    expect(q.numeros.join(' ')).toContain('sem lucro')
  })
  it('agente de vídeo é protótipo e sem link de repositório', () => {
    expect(porSlug('nexus-clips')?.status).toBe('prototipo')
    expect(porSlug('nexus-clips')?.repositorio).toBeUndefined()
  })
  it('AprovaOS é MVP', () => expect(porSlug('aprovaos')?.status).toBe('mvp'))
  it('projeto próprio nunca é "em produção"', () =>
    itens.filter((i) => i.origem === 'proprio').forEach((i) => expect(i.status, i.slug).not.toBe('producao')))
  it('fora: bot de pedidos e IA local', () => {
    const tudo = JSON.stringify(itens).toLowerCase()
    expect(tudo).not.toContain('bot-pedidos')
    expect(tudo).not.toContain('llm-local')
  })
})
