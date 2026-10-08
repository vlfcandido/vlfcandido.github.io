import { describe, expect, it } from 'vitest'
import { camadasFront, etapasPedido, pedidosExemplo, serieDePedidos } from './interfaces'
import { encontrarTermosProibidos } from './lib/termos-proibidos'

describe('interfaces que eu construo', () => {
  it('série de exemplo é estável e do tamanho pedido', () => {
    expect(serieDePedidos(7)).toHaveLength(7)
    expect(serieDePedidos(30)).toHaveLength(30)
    expect(serieDePedidos(30)).toEqual(serieDePedidos(30))
    serieDePedidos(30).forEach((d) => expect(d.pedidos).toBeGreaterThan(0))
  })
  it('a semana termina no sábado', () => expect(serieDePedidos(7).at(-1)?.rotulo).toBe('sáb'))
  it('todo filtro de pedido tem ao menos um item', () =>
    (['pago', 'aguardando', 'atrasado'] as const).forEach((s) => expect(pedidosExemplo.some((p) => p.situacao === s), s).toBe(true)))
  it('status tem início e fim', () => {
    expect(etapasPedido[0]).toBe('Recebido')
    expect(etapasPedido.at(-1)).toBe('Entregue')
  })
  it('pilha só cita o que tem prova: Angular vem do Sicoob, e todo item diz onde foi usado', () => {
    const angular = camadasFront.flatMap((c) => c.itens).find((i) => i.nome === 'Angular')
    expect(angular?.onde).toContain('Sicoob')
    camadasFront.flatMap((c) => c.itens).forEach((i) => expect(i.onde.length, i.nome).toBeGreaterThan(15))
  })
  it('sem termo proibido nem cara de IA', () => {
    const tudo = JSON.stringify({ camadasFront, pedidosExemplo })
    expect(encontrarTermosProibidos(tudo)).toEqual([])
    expect(tudo).not.toContain(' · ')
    expect(tudo).not.toContain('→')
  })
})
