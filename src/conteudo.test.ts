import { describe, expect, it } from 'vitest'
import * as conteudo from './conteudo'
import { encontrarTermosProibidos } from './lib/termos-proibidos'

/** Coleta toda string do conteúdo que parece URL. */
function urls(): string[] {
  const todas: string[] = []
  JSON.stringify(conteudo, (_chave, valor) => {
    if (typeof valor === 'string' && valor.startsWith('http')) todas.push(valor)
    return valor
  })
  return todas
}

describe('conteúdo publicado', () => {
  it('não tem termo proibido', () => expect(encontrarTermosProibidos(JSON.stringify(conteudo))).toEqual([]))
  it('toda URL é https', () => {
    expect(urls().length).toBeGreaterThan(0)
    urls().forEach((u) => expect(u).toMatch(/^https:\/\//))
  })
  it('slugs válidos e únicos', () => {
    const slugs = conteudo.cases.map((c) => c.slug)
    slugs.forEach((s) => expect(s).toMatch(/^[a-z0-9-]+$/))
    expect(new Set(slugs).size).toBe(slugs.length)
  })
  it('todo case tem alt descritivo', () => conteudo.cases.forEach((c) => expect(c.alt.length).toBeGreaterThan(15)))
  it('cases públicos citam fonte com link', () =>
    conteudo.cases.filter((c) => c.tipo === 'publico').forEach((c) => expect(c.fonte.url).toBeTruthy()))
  it('quatro passos de trabalho', () => expect(conteudo.passos).toHaveLength(4))
  it('três cases curtos na principal; fonte, quando há, é https; sem fonte, sem número', () => {
    expect(conteudo.destaques).toHaveLength(3)
    conteudo.destaques.forEach((d) =>
      d.fonte ? expect(d.fonte.url).toMatch(/^https:\/\//) : expect(d.resultado + d.texto, d.slug).not.toMatch(/\d/))
  })
  it('case de empresa sem matéria pública não tem número (Contabilizei, 08/10/2026)', () =>
    conteudo.cases.filter((c) => c.tipo === 'empresa').forEach((c) => {
      expect(c.metrica, c.slug).toBe('')
      expect(c.fonte.url, c.slug).toBeUndefined()
    }))
  it('Contabilizei só como agentes de IA de vendas (SDR)', () => {
    const d = conteudo.destaques.find((x) => x.empresa === 'contabilizei')
    expect(d?.resultado).toBe('Agentes de IA de vendas (SDR).')
    expect(d?.fonte).toBeUndefined()
  })
  it('principal sem jargão técnico', () => {
    const principal = JSON.stringify({
      linha: conteudo.perfil.linha,
      chamada: conteudo.perfil.chamada,
      oferta: conteudo.oferta,
      destaques: conteudo.destaques,
      passos: conteudo.passos,
    }).toLowerCase()
    // "api " saiu da lista em 08/10/2026: "crio APIs" virou oferta aprovada por ele (posicionamento amplo).
    for (const termo of ['langgraph', 'rag', 'redis', 'hexagonal', 'llm', 'fastapi', 'vertex']) {
      expect(principal, termo).not.toContain(termo)
    }
  })
  it('sem cara de IA: nada de " · " nem "→" nos textos', () => {
    // Exceção única (08/10/2026, M7 do juiz): o rótulo do topo usa o ponto médio como separador de etiqueta.
    const tudo = JSON.stringify({ ...conteudo, perfil: { ...conteudo.perfil, titulo: '' } })
    expect(tudo).not.toContain(' · ')
    expect(tudo).not.toContain('→')
  })
  it('Sicoob só aparece na chamada, no resumo e nos cases com a matéria pública', () => {
    const d = conteudo.destaques.find((x) => x.empresa === 'sicoob')
    expect(d?.fonte?.url).toBe('https://www.mobiletime.com.br/noticias/17/07/2026/sicoob-ia-investimento/')
    const c = conteudo.cases.find((x) => x.slug === 'sicoob-investimentos')
    expect(c?.fonte.url).toBe('https://www.mobiletime.com.br/noticias/17/07/2026/sicoob-ia-investimento/')
    const fora = JSON.stringify({
      ...conteudo,
      perfil: { ...conteudo.perfil, chamada: '', resumo: '' },
      cases: conteudo.cases.filter((x) => x.slug !== 'sicoob-investimentos'),
      destaques: conteudo.destaques.filter((x) => x.empresa !== 'sicoob'),
    }).toLowerCase()
    expect(fora).not.toContain('sicoob')
  })
  it('projeto próprio nunca diz cliente nem lucro', () =>
    conteudo.cases.filter((c) => c.tipo === 'proprio').forEach((c) =>
      expect(JSON.stringify(c).toLowerCase()).not.toMatch(/cliente em|projeto para cliente|lucro|market making/)))
  it('cada ramo do seletor sugere exatamente uma oferta, e toda oferta tem antes e depois', () => {
    conteudo.ramosDemo.forEach((r) => expect(conteudo.oferta.filter((o) => o.ramos.includes(r.id)), r.id).toHaveLength(1))
    conteudo.oferta.forEach((o) => {
      expect(o.antes.length).toBeGreaterThan(10)
      expect(o.depois.length).toBeGreaterThan(10)
    })
  })
  it('seis ofertas, integração na frente e IA por último, e o seletor aponta a oferta certa de cada ramo', () => {
    expect(conteudo.oferta.map((o) => o.id)).toEqual(['integracao', 'repetido', 'resgate', 'sob-medida', 'site', 'whatsapp'])
    const de = (ramo: string) => conteudo.oferta.find((o) => o.ramos.includes(ramo))?.id
    expect([de('clinica'), de('loja'), de('escritorio'), de('industria')]).toEqual(['whatsapp', 'site', 'repetido', 'integracao'])
    conteudo.oferta.forEach((o) => expect(o.curto, o.id).toBeTruthy())
  })
  it('o fluxo do agente tem o caminho que resolve e o desvio para a equipe', () => {
    const nos = (id: string) => conteudo.caminhosFluxo.find((c) => c.id === id)?.etapas.map((e) => e.no)
    expect(nos('resolve')).toContain('sistemas')
    expect(nos('equipe')).toContain('equipe')
  })
  it('um "o que você recebe" para cada passo', () => expect(conteudo.recebe).toHaveLength(conteudo.passos.length))
  it('rótulo do topo cabe em uma linha e não esconde a senioridade (M7)', () => {
    expect(conteudo.perfil.titulo).toBe('Engenheiro de software sênior · 13 anos')
    expect(conteudo.perfil.titulo.length).toBeLessThanOrEqual(40)
  })
  it('a página abre em Clínica, na cena "Venda no CRM", com a oferta de integração (M5)', () => {
    expect(conteudo.inicioDemo).toEqual({ ramo: 'clinica', cena: 'integracao', oferta: 'integracao' })
    expect(conteudo.ramosDemo.some((r) => r.id === conteudo.inicioDemo.ramo)).toBe(true)
    expect(conteudo.cenasDemo.find((c) => c.id === conteudo.inicioDemo.cena)?.rotulo).toBe('Venda no CRM')
    expect(conteudo.ramosDemo.find((r) => r.id === 'clinica')?.clientes).toEqual(['unimed', 'odontoprev', 'bradesco-dental'])
    // Quem clica em Clínica depois continua vendo o atendimento.
    expect(conteudo.cenaDoRamo.clinica).toBe('atendimento')
  })
})
