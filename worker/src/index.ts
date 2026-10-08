// Entrada do Worker na Cloudflare: lê o ambiente, liga o Durable Object, escolhe o modelo e entrega o pedido
// para a camada HTTP. Sem chave e sem MODO=real, o Worker roda SIMULADO (sem custo).

import { lerConfig, type Ambiente } from './config'
import type { ControleDO } from './do'
import { criarApp } from './http'
import { ModeloClaude, type Modelo } from './modelo'
import { ModeloSimulado } from './simulado'
import { criarVerificador } from './turnstile'

export { ControleDO } from './do'

/** Ambiente com o binding do Durable Object. */
interface Env extends Ambiente {
  CONTROLE: DurableObjectNamespace<ControleDO>
}

export default {
  /**
   * Trata cada requisição do widget.
   *
   * @param request requisição HTTP.
   * @param env variáveis, segredos e bindings.
   * @returns resposta JSON.
   */
  async fetch(request: Request, env: Env): Promise<Response> {
    const config = lerConfig(env)
    const controle = env.CONTROLE.get(env.CONTROLE.idFromName('global'))
    let modelo: Modelo | null = null
    if (config.modo === 'simulado') modelo = new ModeloSimulado()
    else if (config.chaveApi) modelo = new ModeloClaude(config.chaveApi)
    const turnstile = config.turnstileSecreto ? criarVerificador(config.turnstileSecreto) : null
    return criarApp({ config, controle, modelo, turnstile })(request)
  },
} satisfies ExportedHandler<Env>
