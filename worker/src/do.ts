// Durable Object que guarda os contadores do assistente (orçamento, limites por IP e por conversa, métricas).
// Uma instância global: o tráfego é pequeno, e um objeto só serializa os pedidos, o que mantém o orçamento
// consistente. O armazenamento é o SQLite do Durable Object (plano gratuito da Cloudflare).

import { DurableObject } from 'cloudflare:workers'
import { lerConfig, type Ambiente } from './config'
import { Controle, LIMITES_PADRAO, type Armazem, type Autorizacao, type Metricas } from './controle'

/** Adapta o `storage` do Durable Object ao contrato do armazém. */
class ArmazemDO implements Armazem {
  constructor(private readonly storage: DurableObjectStorage) {}

  /** Lê uma chave. */
  get<T>(chave: string): Promise<T | undefined> {
    return this.storage.get<T>(chave)
  }

  /** Grava uma chave. */
  put<T>(chave: string, valor: T): Promise<void> {
    return this.storage.put(chave, valor)
  }

  /** Apaga uma chave. */
  delete(chave: string): Promise<boolean> {
    return this.storage.delete(chave)
  }

  /** Lista chaves pelo prefixo. */
  async listar(prefixo: string): Promise<string[]> {
    return [...(await this.storage.list({ prefix: prefixo })).keys()]
  }
}

/** Controle do assistente exposto por RPC ao Worker. */
export class ControleDO extends DurableObject<Ambiente> {
  private readonly controle: Controle

  /**
   * @param ctx estado do Durable Object.
   * @param env variáveis do Worker (os tetos em reais vêm daqui).
   */
  constructor(ctx: DurableObjectState, env: Ambiente) {
    super(ctx, env)
    const config = lerConfig(env)
    this.controle = new Controle(new ArmazemDO(ctx.storage), {
      ...LIMITES_PADRAO,
      tetoDiaBrl: config.tetoDiaBrl,
      tetoMesBrl: config.tetoMesBrl,
    })
  }

  /** Abre conversa (encerra a anterior do mesmo IP). */
  abrirConversa(ip: string): Promise<{ ok: true; conversa: string } | { ok: false; motivo: 'limite_ip' }> {
    return this.controle.abrirConversa(ip)
  }

  /** Autoriza um turno. */
  autorizarTurno(conversa: string, ip: string, reservaBrl: number): Promise<Autorizacao> {
    return this.controle.autorizarTurno(conversa, ip, reservaBrl)
  }

  /** Soma o custo real de uma resposta. */
  registrarGasto(brl: number): Promise<void> {
    return this.controle.registrarGasto(brl)
  }

  /** Soma um contador agregado. */
  somarMetrica(campo: keyof Metricas, valor?: number): Promise<void> {
    return this.controle.somarMetrica(campo, valor)
  }

  /** Diz se um gasto cabe nos tetos. */
  cabeNoOrcamento(brl: number): Promise<boolean> {
    return this.controle.cabeNoOrcamento(brl)
  }

  /** Métricas do dia. */
  metricas(): Promise<Metricas & { dia: string; gastoMesBrl: number }> {
    return this.controle.metricas()
  }
}
