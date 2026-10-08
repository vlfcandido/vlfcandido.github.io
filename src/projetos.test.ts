import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { empresasDiretas, gruposClientes } from './clientes'
import { encontrarTermosProibidos } from './lib/termos-proibidos'
import { filtrarProjetos, listarProjetos, separarGaleria, tiposProjeto } from './projetos'

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
  // Projeto sem tela que possa ir a público (a IA local) entra com capa ilustrada no lugar do print.
  it('todo projeto próprio tem print que existe, ou capa', () =>
    itens.filter((i) => i.origem === 'proprio').forEach((i) => {
      expect(Boolean(i.print || i.capa), i.slug).toBe(true)
      if (i.print) expect(existsSync(join(PUBLICO, i.print.arquivo)), i.print.arquivo).toBe(true)
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
  // Até 08/10/2026 exigia um projeto próprio em cada filtro; com a saída do estudo de previsão do tempo (M16),
  // "Chatbot e atendimento" fica só com casos de empresa. A regra do juiz (M15) é nenhum chip vazio.
  it('nenhum filtro fica vazio', () =>
    (Object.keys(tiposProjeto) as (keyof typeof tiposProjeto)[]).forEach((t) =>
      expect(filtrarProjetos(itens, t).length, t).toBeGreaterThan(0)))
  it('repositório só no GitHub do perfil', () =>
    itens.filter((i) => i.repositorio).forEach((i) => expect(i.repositorio).toMatch(/^https:\/\/github\.com\/vlfcandido\/[a-z0-9.-]+$/)))

  // Status honesto, conforme o banco de provas (07/10/2026). Não aparece no site, mas trava os textos.
  // 08/10/2026 (M13): única menção a lucro permitida é a negativa "sem lucro", que o juiz mandou deixar à vista.
  it('sistema de ordens é estudo, diz que roda em simulação e só fala em lucro para dizer que não há', () => {
    const q = porSlug('nexus-quant')!
    expect(q.status).toBe('estudo')
    expect(q.nome).toBe('Sistema de ordens em tempo real')
    expect(q.resultado).toContain('Cripto, só em simulação, sem lucro.')
    expect(JSON.stringify(q).toLowerCase().replaceAll('sem lucro', '')).not.toMatch(/lucro|rendimento|ganho|market making/)
    expect(q.numeros.join(' ')).toContain('simulação')
  })
  // Reorganização de 08/10/2026 (M14, M16): agente de vídeo e dois estudos pequenos saem do site.
  it('fora: agente de vídeo (nexus-clips) e os estudos de previsão do tempo e de prêmios de filmes', () => {
    for (const s of ['nexus-clips', 'previsao-tempo-chatbot', 'api-premios-filmes']) expect(porSlug(s), s).toBeUndefined()
    expect(porSlug('benchmark-litellm')).toBeTruthy()
  })
  it('AprovaOS é MVP', () => expect(porSlug('aprovaos')?.status).toBe('mvp'))
  // Exceção (08/10/2026): o próprio site e o design system dele estão no ar de verdade.
  it('projeto próprio nunca é "em produção", salvo o site e o design system dele', () =>
    itens
      .filter((i) => i.origem === 'proprio' && !['este-site', 'design-system-mare'].includes(i.slug))
      .forEach((i) => expect(i.status, i.slug).not.toBe('producao')))
  it('filtro de frontend reúne os projetos com tela', () => {
    const slugs = filtrarProjetos(itens, 'frontend').map((i) => i.slug)
    for (const s of ['nexus-quant', 'app-score', 'aprovaos', 'este-site', 'design-system-mare']) expect(slugs, s).toContain(s)
    expect(filtrarProjetos(itens, 'frontend').every((i) => i.origem === 'proprio')).toBe(true)
  })
  it('app de score: prova de conceito, sem link de código e sem citar país do cliente', () => {
    const a = porSlug('app-score')!
    expect(a.status).toBe('prototipo')
    expect(a.repositorio).toBeUndefined()
    expect(JSON.stringify(a).toLowerCase()).not.toMatch(/angola|luanda|kwanza|cliente em/)
  })
  it('IA local: ângulo de privacidade e aprovação humana, sem código publicado e sem promessa que não cumpre', () => {
    const l = porSlug('ia-local')!
    expect(l.status).toBe('prototipo')
    expect(l.repositorio).toBeUndefined()
    expect(l.capa?.escuro).toBeTruthy()
    expect(l.diagrama).toBe('ia-local')
    const t = JSON.stringify(l).toLowerCase()
    for (const x of ['pentest', 'invas', 'arsenal', 'ofensiv', 'recusa', 'abliterat', 'sandbox', 'white wall', 'wiv', 'serasa', 'phishing', 'exploit', 'sem trava'])
      expect(t, x).not.toContain(x)
    expect(t).toContain('aprova')
    expect(t).toContain('log de auditoria')
  })
  it('fora: bot de pedidos e o repositório da IA local', () => {
    const tudo = JSON.stringify(itens).toLowerCase()
    expect(tudo).not.toContain('bot-pedidos')
    expect(tudo).not.toContain('llm-local')
  })

  // Reorganização de 08/10/2026 (M11, M12, M13, M15) e decisões dele no mesmo dia.
  describe('ordem e seções da galeria', () => {
    const secoes = separarGaleria(itens)
    it('Em empresas: Sicoob, Contabilizei, Franca, Wiv, Araguaia (Serasa foi para a Carreira)', () =>
      expect(secoes.emEmpresas.map((i) => i.slug)).toEqual(['sicoob', 'contabilizei', 'prefeitura-franca', 'wiv', 'araguaia']))
    it('próprios na ordem do juiz', () =>
      expect(secoes.proprios.map((i) => i.slug)).toEqual([
        'aprovaos', 'nexus-quant', 'varredura-voos', 'app-score', 'engenharia-de-agentes',
        'revisor-ia', 'ia-local', 'este-site', 'design-system-mare', 'benchmark-litellm',
      ]))
    it('Ecovita e Minu: só participação, no fim, sem "liderei"', () => {
      expect(secoes.outros.map((i) => i.slug)).toEqual(['ecovita', 'minu'])
      expect(itens.slice(-2).map((i) => i.slug)).toEqual(['ecovita', 'minu'])
      secoes.outros.forEach((i) => expect(JSON.stringify(i).toLowerCase(), i.slug).not.toMatch(/lider/))
    })
    it('Serasa não é card de projeto', () => expect(porSlug('serasa-experian')).toBeUndefined())
    it('as três seções somam a galeria inteira', () =>
      expect(secoes.emEmpresas.length + secoes.proprios.length + secoes.outros.length).toBe(itens.length))
    it('chips na ordem do juiz e sem "trading"', () => {
      expect(Object.keys(tiposProjeto)).toEqual(['integracoes', 'sistemas', 'frontend', 'chatbot', 'agentes', 'dados'])
      expect(tiposProjeto.dados).toBe('Dados e tempo real')
      Object.values(tiposProjeto).forEach((r) => expect(r.toLowerCase()).not.toContain('trading'))
    })
  })
})
