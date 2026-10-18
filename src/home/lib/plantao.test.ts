import { describe, expect, it } from 'vitest'
import { linkWhatsapp } from '../../lib/whatsapp'
import {
  MENSAGEM_INICIAL,
  PLANTAO,
  escolher,
  estadoInicial,
  mensagemWhatsapp,
  opcaoDoPasso,
  resumoDe,
  type Estado,
} from './plantao'

/** Percorre um caminho de ids a partir do estado inicial. */
function jogar(ids: string[]): Estado {
  return ids.reduce((estado, id) => escolher(estado, id), estadoInicial())
}

describe('plantão do atendente', () => {
  it('abre com a mensagem da Camila e nenhuma decisão', () => {
    const e = estadoInicial()
    expect(e.falas).toEqual([{ de: 'cliente', texto: MENSAGEM_INICIAL }])
    expect(e.passo).toBe(0)
    expect(e.fim).toBe(false)
  })

  it('tem três passos com três opções cada, ids únicos e regra válida', () => {
    const ids = new Set<string>()
    const regras = new Set(PLANTAO.regras.map((r) => r.id))
    for (const p of PLANTAO.passos) {
      expect(p.opcoes).toHaveLength(3)
      for (const o of p.opcoes) {
        expect(ids.has(o.id), o.id).toBe(false)
        ids.add(o.id)
        expect(regras.has(o.regra), `${o.id} ${o.regra}`).toBe(true)
      }
    }
  })

  it('todo caminho chega ao resumo e nenhum caminho morre', () => {
    const caminhos: string[][] = []
    const andar = (estado: Estado, ids: string[]) => {
      if (estado.fim) {
        caminhos.push(ids)
        return
      }
      const passo = PLANTAO.passos[estado.passo]
      // Opção bloqueada não avança, então o caminho segue só pelas que avançam.
      for (const o of passo.opcoes.filter((x) => x.tipo !== 'bloqueada')) andar(escolher(estado, o.id), [...ids, o.id])
    }
    andar(estadoInicial(), [])
    // 2 opções que avançam por passo: 2 × 2 × 2 = 8 caminhos.
    expect(caminhos).toHaveLength(8)
    for (const c of caminhos) expect(c).toHaveLength(3)
  })

  it('o caminho certo pergunta o porte, consulta a agenda e a base', () => {
    const e = jogar(['d1-porte', 'd2-agenda', 'd3-base'])
    expect(e.fim).toBe(true)
    expect(resumoDe(e)).toEqual({
      perguntouPorte: true, consultouAgenda: true, combinouLembrete: true,
      consultouBase: true, passouEquipe: true, bloqueios: 0,
    })
    expect(e.falas.some((f) => f.de === 'agente' && f.regra === 3)).toBe(true)
  })

  it('o caminho que deixa o lembrete de lado ainda termina e o resumo denuncia', () => {
    const e = jogar(['d1-nome', 'd2-sem-lembrete', 'd3-sem-base'])
    expect(e.fim).toBe(true)
    const r = resumoDe(e)
    expect(r.perguntouPorte).toBe(false)
    expect(r.consultouAgenda).toBe(true)
    expect(r.combinouLembrete).toBe(false)
    expect(r.consultouBase).toBe(false)
    expect(r.passouEquipe).toBe(true)
  })

  it('a opção bloqueada explica a regra, conta o bloqueio e mantém o passo', () => {
    const e = jogar(['d1-horario'])
    expect(e.passo).toBe(0)
    expect(e.bloqueios).toBe(1)
    expect(e.bloqueadas).toEqual(['d1-horario'])
    expect(e.falas.at(-1)).toEqual({
      de: 'sistema',
      texto: 'Sem porte e tipo de pelo, o serviço e a duração não estão definidos. O agente pergunta antes de oferecer horário.',
      regra: 2,
    })
  })

  it('id desconhecido, passo concluído ou opção repetida não corrompem o estado', () => {
    const inicial = estadoInicial()
    expect(escolher(inicial, 'nao-existe')).toBe(inicial)
    const meio = jogar(['d1-porte'])
    expect(escolher(meio, 'd1-porte')).toEqual(meio) // d1-porte não existe no passo 2
    const fim = jogar(['d1-porte', 'd2-agenda', 'd3-base'])
    expect(escolher(fim, 'd3-base')).toBe(fim)
  })

  it('a opção do passo atual é procurada pelo id, não pelo índice da tela', () => {
    expect(opcaoDoPasso(estadoInicial(), 'd1-nome')?.tipo).toBe('parcial')
    expect(opcaoDoPasso(estadoInicial(), 'd2-agenda')).toBeUndefined()
  })

  it('a mensagem do WhatsApp leva o caminho inteiro e o segmento, sem dado digitado', () => {
    const e = jogar(['d1-porte', 'd2-agenda', 'd3-base'])
    const semSegmento = mensagemWhatsapp(e, null)
    expect(semSegmento).toContain('perguntei o porte')
    expect(semSegmento).toContain('consultei a agenda')
    expect(semSegmento).toContain('combinei o lembrete')
    expect(semSegmento).toContain('consultei a base antes de chamar a equipe')
    expect(semSegmento).not.toContain('Meu negócio é do setor de')
    const comSegmento = mensagemWhatsapp(e, PLANTAO.segmentos[1])
    expect(comSegmento).toContain('Meu negócio é do setor de saúde.')
    // O link final é codificado, com o texto inteiro no parâmetro.
    const link = linkWhatsapp(comSegmento)
    expect(link).toContain('https://wa.me/')
    expect(decodeURIComponent(link.split('text=')[1])).toBe(comSegmento)
  })

  // 18/10/2026 (revisor, achado 1): oito caminhos precisam gerar oito mensagens, com as marcas que ficaram de fora.
  it('os oito caminhos geram oito mensagens diferentes, inclusive com o que não foi feito', () => {
    const d1 = ['d1-porte', 'd1-nome']
    const d2 = ['d2-agenda', 'd2-sem-lembrete']
    const d3 = ['d3-base', 'd3-sem-base']
    const mensagens = d1.flatMap((a) => d2.flatMap((b) => d3.map((c) => mensagemWhatsapp(jogar([a, b, c]), null))))
    expect(new Set(mensagens).size).toBe(8)
    const pior = mensagemWhatsapp(jogar(['d1-nome', 'd2-sem-lembrete', 'd3-sem-base']), null)
    expect(pior).toContain('não perguntei o porte')
    expect(pior).toContain('não combinei o lembrete')
    expect(pior).toContain('chamei a equipe sem consultar a base')
  })

  it('o preço do resumo é o da política de 09/10/2026, sem valor inventado', () => {
    expect(PLANTAO.resumo.preco).toContain('R$ 590 + R$ 149/mês')
    expect(PLANTAO.resumo.preco).toContain('R$ 990 + R$ 199/mês')
    expect(PLANTAO.resumo.notaPreco).toContain('09/10/2026')
  })

  it('a simulação não tem campo de texto nem storage no roteiro', () => {
    const fonte = JSON.stringify(PLANTAO)
    expect(fonte).not.toMatch(/localStorage|sessionStorage|document\.cookie/)
  })
})
