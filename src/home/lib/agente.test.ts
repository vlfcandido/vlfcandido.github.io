import { describe, expect, it } from 'vitest'
import { linkWhatsapp } from '../../lib/whatsapp'
import {
  AGENTE,
  RAMOS,
  RAMO_PADRAO,
  duracao,
  quadroDoRamo,
  ramoPorId,
  responderPergunta,
  semAcento,
  type Acao,
  type Ramo,
} from './agente'

/** Todas as ações de um ramo, na ordem do roteiro. */
function acoes(r: Ramo): Acao[] {
  return r.eventos.filter((e): e is Acao => e.tipo === 'acao')
}

/** Texto visível sem os horários, onde o dois-pontos é legítimo (02:14). */
function semHorario(texto: string): string {
  return texto.replace(/\b\d{2}:\d{2}\b/g, '')
}

describe('agente trabalhando sozinho', () => {
  it('tem os quatro ramos, com o pet shop como padrão', () => {
    expect(RAMOS.map((r) => r.id)).toEqual(['pet', 'clinica', 'loja', 'servicos'])
    expect(RAMO_PADRAO).toBe('pet')
    expect(ramoPorId('pet').negocio).toBe('Pelo Solto')
    expect(new Set(RAMOS.map((r) => r.negocio)).size).toBe(4)
  })

  it('abre todo ramo com uma mensagem de cliente no instante zero', () => {
    for (const r of RAMOS) {
      const primeiro = r.eventos[0]
      expect(primeiro.tipo, r.id).toBe('cliente')
      expect(primeiro.em, r.id).toBe(0)
      expect(primeiro.hora, r.id).toBe(r.foraDoHorario.slice(0, 5))
    }
  })

  it('tem os eventos em ordem e horários que nunca voltam no tempo', () => {
    for (const r of RAMOS) {
      let anterior = -1
      let hora = ''
      for (const e of r.eventos) {
        expect(e.em, `${r.id} ${e.tipo} em ${e.em}`).toBeGreaterThanOrEqual(anterior)
        expect(e.hora >= hora, `${r.id} ${e.hora} depois de ${hora}`).toBe(true)
        anterior = e.em
        hora = e.hora
      }
    }
  })

  it('passa pelas cinco ações e pela passagem para a equipe em todo ramo', () => {
    const chaves = ['consulta', 'reserva', 'ficha', 'dono', 'lembrete', 'equipe']
    for (const r of RAMOS) {
      const lista = acoes(r)
      for (const chave of chaves) {
        expect(lista.filter((a) => a.chave === chave), `${r.id} ${chave}`).toHaveLength(1)
      }
      expect(lista.filter((a) => a.equipe)).toHaveLength(1)
      expect(lista.filter((a) => a.resolve), `${r.id} resolvidos`).toHaveLength(1)
    }
  })

  it('tem conversa dos dois lados em todo ramo', () => {
    for (const r of RAMOS) {
      const falas = r.eventos.filter((e) => e.tipo === 'cliente' || e.tipo === 'agente')
      expect(falas.filter((f) => f.tipo === 'cliente').length, r.id).toBeGreaterThanOrEqual(3)
      expect(falas.filter((f) => f.tipo === 'agente').length, r.id).toBeGreaterThanOrEqual(3)
    }
  })

  it('o pet shop traz a mensagem das 02:14 da madrugada', () => {
    const pet = ramoPorId('pet')
    expect(pet.foraDoHorario).toMatch(/madrugada/)
    expect(pet.eventos.some((e) => e.hora === '02:14')).toBe(true)
  })

  it('não usa dois-pontos em prosa nem travessão em texto visível', () => {
    const textos = [
      AGENTE.rotulo, AGENTE.titulo, AGENTE.texto, AGENTE.chamadaRamo, AGENTE.painelTitulo,
      AGENTE.contadorSingular, AGENTE.contadorPlural, AGENTE.perguntaRotulo, AGENTE.perguntaExemplo,
      AGENTE.perguntaDica, AGENTE.perguntaBotao, AGENTE.demonstracao, AGENTE.cta, AGENTE.peca, AGENTE.preco,
      AGENTE.notaPreco, AGENTE.honestidade, AGENTE.notaPergunta,
      ...RAMOS.flatMap((r) => [
        r.rotulo, r.negocio, r.descricao, r.foraDoHorario, r.mensagemWhatsapp,
        ...r.eventos.flatMap((e) => (e.tipo === 'acao' ? [e.rotulo, e.detalhe, e.hora] : [e.texto, e.hora])),
        ...r.respostas.flatMap((x) => [x.resposta, ...x.chaves]),
      ]),
    ]
    for (const t of textos) expect(semHorario(t), t).not.toMatch(/[:—–]/)
  })

  it('dura o último evento mais uma pausa curta', () => {
    for (const r of RAMOS) {
      const ultimo = r.eventos[r.eventos.length - 1].em
      expect(duracao(r), r.id).toBeGreaterThan(ultimo)
      expect(duracao(r), r.id).toBeLessThan(ultimo + 10)
    }
  })

  it('no instante zero mostra só a primeira mensagem e nenhuma ação', () => {
    const q = quadroDoRamo(ramoPorId('pet'), 0)
    expect(q.mensagens).toHaveLength(1)
    expect(q.acoes).toHaveLength(0)
    expect(q.digitando).toBe(false)
    expect(q.resolvidos).toBe(0)
    expect(q.equipe).toBe(false)
    expect(q.fim).toBe(false)
    expect(q.hora).toBe('02:14')
  })

  it('mostra o agente digitando antes da resposta e some quando ela chega', () => {
    const pet = ramoPorId('pet')
    const resposta = pet.eventos.find((e) => e.tipo === 'agente')!
    expect(quadroDoRamo(pet, resposta.em - 1).digitando).toBe(true)
    expect(quadroDoRamo(pet, resposta.em).digitando).toBe(false)
  })

  it('acende a reserva e sobe o contador no horário da ação', () => {
    const pet = ramoPorId('pet')
    const reserva = acoes(pet).find((a) => a.chave === 'reserva')!
    const antes = quadroDoRamo(pet, reserva.em - 0.2)
    const depois = quadroDoRamo(pet, reserva.em)
    expect(antes.resolvidos).toBe(0)
    expect(antes.acoes.some((a) => a.chave === 'reserva')).toBe(false)
    expect(depois.resolvidos).toBe(1)
    expect(depois.acoes.some((a) => a.chave === 'reserva')).toBe(true)
  })

  it('no fim do ciclo mostra tudo, inclusive a passagem para a equipe', () => {
    for (const r of RAMOS) {
      const q = quadroDoRamo(r, duracao(r))
      expect(q.mensagens.length, r.id).toBe(r.eventos.filter((e) => e.tipo !== 'acao').length)
      expect(q.acoes.length, r.id).toBe(acoes(r).length)
      expect(q.resolvidos, r.id).toBe(1)
      expect(q.equipe, r.id).toBe(true)
      expect(q.digitando, r.id).toBe(false)
      expect(q.fim, r.id).toBe(true)
    }
  })

  it('com menos movimento mostra o quadro final desde o começo', () => {
    const q = quadroDoRamo(ramoPorId('clinica'), 0, true)
    expect(q.mensagens.length).toBeGreaterThan(3)
    expect(q.acoes).toHaveLength(6)
    expect(q.resolvidos).toBe(1)
    expect(q.equipe).toBe(true)
    expect(q.fim).toBe(true)
  })

  it('trata tempo negativo como o começo', () => {
    const pet = ramoPorId('pet')
    expect(quadroDoRamo(pet, -5)).toEqual(quadroDoRamo(pet, 0))
  })

  it('responde preço, horário, endereço e o que foge da base', () => {
    expect(responderPergunta(ramoPorId('pet'), 'Quanto custa o banho?')?.texto).toMatch(/R\$ 95/)
    expect(responderPergunta(ramoPorId('clinica'), 'Vocês abrem sábado?')?.texto).toMatch(/segunda a sexta/)
    expect(responderPergunta(ramoPorId('loja'), 'Onde fica a loja?')?.texto).toMatch(/rua das Palmeiras/)
    expect(responderPergunta(ramoPorId('servicos'), 'Quanto custa a visita?')?.texto).toMatch(/R\$ 120/)
  })

  it('manda sintoma para a equipe e não inventa resposta', () => {
    const r = responderPergunta(ramoPorId('clinica'), 'Estou com dor forte no peito')
    expect(r?.equipe).toBe(true)
    expect(r?.texto).toMatch(/não consigo avaliar/)
  })

  it('cai numa resposta honesta quando não conhece a pergunta', () => {
    const r = responderPergunta(ramoPorId('pet'), 'Vocês atendem coelho?')
    expect(r?.texto).toMatch(/passaria.*equipe/i)
    expect(r?.equipe).toBe(true)
  })

  it('ignora pergunta vazia', () => {
    expect(responderPergunta(ramoPorId('pet'), '   ')).toBeNull()
    expect(responderPergunta(ramoPorId('pet'), '')).toBeNull()
  })

  it('normaliza acento e maiúscula na pergunta', () => {
    expect(semAcento('HORÁRIO')).toBe('horario')
    expect(responderPergunta(ramoPorId('pet'), 'QUAL O PREÇO?')?.texto).toMatch(/R\$ 95/)
  })

  it('leva o ramo escolhido na mensagem do WhatsApp', () => {
    for (const r of RAMOS) {
      const link = linkWhatsapp(r.mensagemWhatsapp)
      expect(link.startsWith('https://wa.me/')).toBe(true)
      expect(semAcento(decodeURIComponent(link))).toContain(semAcento(r.rotulo))
    }
  })

  it('o convite e o link secundário são os do brief', () => {
    expect(AGENTE.cta).toBe('Quero isso no meu WhatsApp')
    expect(AGENTE.peca).toBe('Ver o Pelo Solto inteiro')
  })
})
