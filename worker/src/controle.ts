// Limites de uso e orçamento em reais (estudo de 08/10/2026, "Teto de custo", camadas 2 e 3).
// A lógica fica aqui, sobre um armazém abstrato, para ser testada em Node; em produção ela roda dentro de
// um Durable Object (src/do.ts), que serializa os pedidos e torna os contadores consistentes.
// Nada de conteúdo de conversa é guardado: só contadores, o id da conversa e o hash diário do IP.

import { LIMITES } from '../../src/chatbot/protocolo'

/** Armazém chave-valor mínimo (o `storage` do Durable Object cumpre este contrato). */
export interface Armazem {
  get<T>(chave: string): Promise<T | undefined>
  put<T>(chave: string, valor: T): Promise<void>
  delete(chave: string): Promise<boolean>
  /** Chaves que começam com o prefixo. */
  listar(prefixo: string): Promise<string[]>
}

/** Armazém em memória, para testes e para o eval. */
export class ArmazemMemoria implements Armazem {
  private readonly dados = new Map<string, unknown>()

  /** Lê uma chave. */
  async get<T>(chave: string): Promise<T | undefined> {
    return this.dados.get(chave) as T | undefined
  }

  /** Grava uma chave. */
  async put<T>(chave: string, valor: T): Promise<void> {
    this.dados.set(chave, valor)
  }

  /** Apaga uma chave. */
  async delete(chave: string): Promise<boolean> {
    return this.dados.delete(chave)
  }

  /** Lista chaves pelo prefixo. */
  async listar(prefixo: string): Promise<string[]> {
    return [...this.dados.keys()].filter((k) => k.startsWith(prefixo))
  }
}

/** Limites do controle, em reais e em contagens. */
export interface LimitesControle {
  tetoDiaBrl: number
  tetoMesBrl: number
  turnosPorConversa: number
  mensagensPorIpDia: number
  /** Conversa sem mensagem por mais tempo que isto expira. */
  validadeConversaMs: number
}

/** Limites padrão: os do estudo, com o teto em reais (decisão dele, 08/10/2026). */
export const LIMITES_PADRAO: LimitesControle = {
  tetoDiaBrl: 3,
  tetoMesBrl: 50,
  turnosPorConversa: LIMITES.turnosPorConversa,
  mensagensPorIpDia: LIMITES.mensagensPorIpDia,
  validadeConversaMs: 2 * 60 * 60 * 1000,
}

/** Registro de uma conversa aberta: só contagem e data, nunca texto. */
interface RegistroConversa {
  turnos: number
  ultimaMs: number
  ip: string
}

/** Contadores agregados do dia (o único "log" do assistente). */
export interface Metricas {
  conversas: number
  turnos: number
  recusas: number
  bloqueiosEntrada: number
  bloqueiosSaida: number
  fallbacks: number
  custoBrl: number
}

const METRICAS_VAZIAS: Metricas = {
  conversas: 0,
  turnos: 0,
  recusas: 0,
  bloqueiosEntrada: 0,
  bloqueiosSaida: 0,
  fallbacks: 0,
  custoBrl: 0,
}

/** Resultado de uma autorização. */
export type Autorizacao =
  | { ok: true; restantes: number }
  | { ok: false; motivo: 'orcamento' | 'limite_ip' | 'limite_conversa' | 'conversa_invalida' }

/**
 * Data no fuso de São Paulo (UTC-3, sem horário de verão desde 2019), para o dia e o mês do orçamento.
 *
 * @param agora instante.
 * @returns `AAAA-MM-DD`.
 */
export function diaSaoPaulo(agora: Date): string {
  return new Date(agora.getTime() - 3 * 60 * 60 * 1000).toISOString().slice(0, 10)
}

/** Controle de limites, orçamento e métricas. */
export class Controle {
  /**
   * @param armazem onde os contadores vivem.
   * @param limites tetos e contagens.
   * @param relogio fonte do horário (injetável nos testes).
   * @param novoId gerador de id de conversa.
   */
  constructor(
    private readonly armazem: Armazem,
    private readonly limites: LimitesControle = LIMITES_PADRAO,
    private readonly relogio: () => Date = () => new Date(),
    private readonly novoId: () => string = () => crypto.randomUUID(),
  ) {}

  private dia(): string {
    return diaSaoPaulo(this.relogio())
  }

  private mes(): string {
    return this.dia().slice(0, 7)
  }

  /**
   * Abre uma conversa nova para o IP e encerra a anterior dele (1 conversa simultânea por IP).
   *
   * @param ip hash diário do IP (nunca o IP puro).
   * @returns o id novo, ou o motivo da recusa.
   */
  async abrirConversa(ip: string): Promise<{ ok: true; conversa: string } | { ok: false; motivo: 'limite_ip' }> {
    await this.limparSeVirouODia()
    const usados = (await this.armazem.get<number>(`ip:${this.dia()}:${ip}`)) ?? 0
    if (usados >= this.limites.mensagensPorIpDia) return { ok: false, motivo: 'limite_ip' }
    const anterior = await this.armazem.get<string>(`ipconv:${ip}`)
    if (anterior) await this.armazem.delete(`conv:${anterior}`)
    const conversa = this.novoId()
    const registro: RegistroConversa = { turnos: 0, ultimaMs: this.relogio().getTime(), ip }
    await this.armazem.put(`conv:${conversa}`, registro)
    await this.armazem.put(`ipconv:${ip}`, conversa)
    await this.somarMetrica('conversas', 1)
    return { ok: true, conversa }
  }

  /**
   * Autoriza um turno: confere a conversa, os limites e, quando a resposta usa IA, o orçamento.
   * Só conta o turno quando autoriza.
   *
   * @param conversa id da conversa.
   * @param ip hash diário do IP.
   * @param reservaBrl custo do pior turno, reservado contra o teto; 0 quando não há IA (simulado).
   * @returns restantes na conversa, ou o motivo da recusa.
   */
  async autorizarTurno(conversa: string, ip: string, reservaBrl: number): Promise<Autorizacao> {
    const registro = await this.armazem.get<RegistroConversa>(`conv:${conversa}`)
    const agora = this.relogio().getTime()
    if (!registro || agora - registro.ultimaMs > this.limites.validadeConversaMs) {
      return { ok: false, motivo: 'conversa_invalida' }
    }
    if (registro.turnos >= this.limites.turnosPorConversa) return { ok: false, motivo: 'limite_conversa' }
    const chaveIp = `ip:${this.dia()}:${ip}`
    const usados = (await this.armazem.get<number>(chaveIp)) ?? 0
    if (usados >= this.limites.mensagensPorIpDia) return { ok: false, motivo: 'limite_ip' }
    if (reservaBrl > 0 && !(await this.cabeNoOrcamento(reservaBrl))) return { ok: false, motivo: 'orcamento' }

    await this.armazem.put(`conv:${conversa}`, { ...registro, turnos: registro.turnos + 1, ultimaMs: agora })
    await this.armazem.put(chaveIp, usados + 1)
    await this.somarMetrica('turnos', 1)
    return { ok: true, restantes: this.limites.turnosPorConversa - registro.turnos - 1 }
  }

  /**
   * Diz se um gasto ainda cabe no teto do dia e do mês.
   *
   * @param brl gasto previsto.
   * @returns `true` quando cabe nos dois tetos.
   */
  async cabeNoOrcamento(brl: number): Promise<boolean> {
    const { gastoDiaBrl, gastoMesBrl } = await this.gastos()
    return gastoDiaBrl + brl <= this.limites.tetoDiaBrl && gastoMesBrl + brl <= this.limites.tetoMesBrl
  }

  /**
   * Soma o custo real de uma resposta ao dia e ao mês.
   *
   * @param brl custo em reais.
   */
  async registrarGasto(brl: number): Promise<void> {
    if (!(brl > 0)) return
    const chaveDia = `gasto:dia:${this.dia()}`
    const chaveMes = `gasto:mes:${this.mes()}`
    await this.armazem.put(chaveDia, ((await this.armazem.get<number>(chaveDia)) ?? 0) + brl)
    await this.armazem.put(chaveMes, ((await this.armazem.get<number>(chaveMes)) ?? 0) + brl)
    await this.somarMetrica('custoBrl', brl)
  }

  /** Gasto acumulado do dia e do mês, em reais. */
  async gastos(): Promise<{ gastoDiaBrl: number; gastoMesBrl: number }> {
    return {
      gastoDiaBrl: (await this.armazem.get<number>(`gasto:dia:${this.dia()}`)) ?? 0,
      gastoMesBrl: (await this.armazem.get<number>(`gasto:mes:${this.mes()}`)) ?? 0,
    }
  }

  /**
   * Soma um valor a um contador agregado do dia.
   *
   * @param campo contador.
   * @param valor quanto somar.
   */
  async somarMetrica(campo: keyof Metricas, valor = 1): Promise<void> {
    const chave = `met:${this.dia()}`
    const atual = (await this.armazem.get<Metricas>(chave)) ?? { ...METRICAS_VAZIAS }
    await this.armazem.put(chave, { ...atual, [campo]: atual[campo] + valor })
  }

  /** Métricas do dia de hoje. */
  async metricas(): Promise<Metricas & { dia: string; gastoMesBrl: number }> {
    const m = (await this.armazem.get<Metricas>(`met:${this.dia()}`)) ?? { ...METRICAS_VAZIAS }
    return { ...m, dia: this.dia(), gastoMesBrl: (await this.gastos()).gastoMesBrl }
  }

  /** Uma vez por dia, apaga contadores de IP e conversas de dias anteriores (minimização). */
  private async limparSeVirouODia(): Promise<void> {
    const hoje = this.dia()
    if ((await this.armazem.get<string>('limpeza')) === hoje) return
    for (const chave of await this.armazem.listar('ip:')) {
      if (!chave.startsWith(`ip:${hoje}:`)) await this.armazem.delete(chave)
    }
    const agora = this.relogio().getTime()
    for (const chave of await this.armazem.listar('conv:')) {
      const r = await this.armazem.get<RegistroConversa>(chave)
      if (!r || agora - r.ultimaMs > this.limites.validadeConversaMs) {
        await this.armazem.delete(chave)
        if (r && (await this.armazem.get<string>(`ipconv:${r.ip}`)) === chave.slice(5)) await this.armazem.delete(`ipconv:${r.ip}`)
      }
    }
    await this.armazem.put('limpeza', hoje)
  }
}
