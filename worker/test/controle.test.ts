import { describe, expect, it } from 'vitest'
import { reservaPorTurnoBrl, custoBrl } from '../src/config'
import { ArmazemMemoria, Controle, diaSaoPaulo, LIMITES_PADRAO } from '../src/controle'

/** Controle com relógio controlável e ids previsíveis. */
function criar(limites = LIMITES_PADRAO) {
  let agora = new Date('2026-10-08T15:00:00Z')
  let n = 0
  const controle = new Controle(new ArmazemMemoria(), limites, () => agora, () => `conversa-${++n}`)
  return { controle, avancar: (ms: number) => (agora = new Date(agora.getTime() + ms)) }
}

describe('controle de limites e orçamento', () => {
  it('8 turnos por conversa', async () => {
    const { controle } = criar()
    const aberta = await controle.abrirConversa('ip-a')
    if (!aberta.ok) throw new Error('não abriu')
    for (let i = 0; i < 8; i++) expect((await controle.autorizarTurno(aberta.conversa, 'ip-a', 0)).ok).toBe(true)
    expect(await controle.autorizarTurno(aberta.conversa, 'ip-a', 0)).toEqual({ ok: false, motivo: 'limite_conversa' })
  })

  it('20 mensagens por IP por dia, somando conversas', async () => {
    const { controle } = criar()
    let feitas = 0
    for (let c = 0; c < 3; c++) {
      const a = await controle.abrirConversa('ip-b')
      if (!a.ok) break
      for (let i = 0; i < 8; i++) if ((await controle.autorizarTurno(a.conversa, 'ip-b', 0)).ok) feitas++
    }
    expect(feitas).toBe(20)
    expect(await controle.abrirConversa('ip-b')).toEqual({ ok: false, motivo: 'limite_ip' })
  })

  it('o limite de IP zera no dia seguinte (fuso de São Paulo)', async () => {
    const { controle, avancar } = criar()
    const a = await controle.abrirConversa('ip-c')
    if (!a.ok) throw new Error()
    for (let i = 0; i < 8; i++) await controle.autorizarTurno(a.conversa, 'ip-c', 0)
    avancar(24 * 60 * 60 * 1000)
    expect((await controle.abrirConversa('ip-c')).ok).toBe(true)
  })

  it('1 conversa simultânea por IP: abrir outra encerra a anterior', async () => {
    const { controle } = criar()
    const a = await controle.abrirConversa('ip-d')
    const b = await controle.abrirConversa('ip-d')
    if (!a.ok || !b.ok) throw new Error()
    expect(await controle.autorizarTurno(a.conversa, 'ip-d', 0)).toEqual({ ok: false, motivo: 'conversa_invalida' })
    expect((await controle.autorizarTurno(b.conversa, 'ip-d', 0)).ok).toBe(true)
  })

  it('conversa inventada ou expirada não passa', async () => {
    const { controle, avancar } = criar()
    expect((await controle.autorizarTurno('nao-existe', 'ip-e', 0)).ok).toBe(false)
    const a = await controle.abrirConversa('ip-e')
    if (!a.ok) throw new Error()
    avancar(3 * 60 * 60 * 1000)
    expect(await controle.autorizarTurno(a.conversa, 'ip-e', 0)).toEqual({ ok: false, motivo: 'conversa_invalida' })
  })

  it('teto diário em reais: estourou, recusa com motivo "orcamento" (o widget cai no roteiro)', async () => {
    const { controle } = criar({ ...LIMITES_PADRAO, tetoDiaBrl: 0.05 })
    const reserva = reservaPorTurnoBrl(5.5)
    let autorizados = 0
    for (let c = 0; c < 10; c++) {
      const a = await controle.abrirConversa(`ip-${c}`)
      if (!a.ok) continue
      const r = await controle.autorizarTurno(a.conversa, `ip-${c}`, reserva)
      if (r.ok) {
        autorizados++
        await controle.registrarGasto(reserva)
      } else expect(r.motivo).toBe('orcamento')
    }
    expect(autorizados).toBeGreaterThan(0)
    expect(autorizados).toBeLessThan(10)
    expect((await controle.gastos()).gastoDiaBrl).toBeLessThanOrEqual(0.05)
  })

  it('teto mensal vale mesmo com o diário sobrando', async () => {
    const { controle } = criar({ ...LIMITES_PADRAO, tetoDiaBrl: 100, tetoMesBrl: 1 })
    await controle.registrarGasto(0.999)
    expect(await controle.cabeNoOrcamento(0.01)).toBe(false)
  })

  it('custo em reais com o câmbio configurável', () => {
    // 10 mil tokens de entrada e 500 de saída no Haiku 5.5: US$ 0,001 + US$ 0,00025 = US$ 0,00125.
    expect(custoBrl({ input_tokens: 10_000, output_tokens: 500 }, 5.5)).toBeCloseTo(0.006875, 6)
    expect(custoBrl({ input_tokens: 10_000, output_tokens: 500 }, 6)).toBeCloseTo(0.0075, 6)
    // Leitura de cache sai a 0,1x.
    expect(custoBrl({ input_tokens: 0, output_tokens: 0, cache_read_input_tokens: 10_000 }, 5.5)).toBeCloseTo(0.00055, 6)
  })

  it('a reserva do pior turno cabe ~5 mil vezes no teto de R$ 50/mês', () => {
    const vezes = 50 / reservaPorTurnoBrl(5.5)
    expect(vezes).toBeGreaterThan(4000)
  })

  it('dia no fuso de São Paulo', () => {
    expect(diaSaoPaulo(new Date('2026-10-09T02:00:00Z'))).toBe('2026-10-08')
    expect(diaSaoPaulo(new Date('2026-10-09T03:00:00Z'))).toBe('2026-10-09')
  })

  it('métricas agregadas, sem conteúdo', async () => {
    const { controle } = criar()
    await controle.abrirConversa('ip-m')
    await controle.somarMetrica('recusas')
    const m = await controle.metricas()
    expect(m.conversas).toBe(1)
    expect(m.recusas).toBe(1)
    expect(Object.keys(m).sort()).toEqual(
      ['bloqueiosEntrada', 'bloqueiosSaida', 'conversas', 'custoBrl', 'dia', 'fallbacks', 'gastoMesBrl', 'recusas', 'turnos'].sort(),
    )
  })
})
