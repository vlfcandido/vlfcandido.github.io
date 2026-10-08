// Configuração do Worker: o que vem do ambiente (wrangler.toml e segredos) e o que é fixo no código.
// Tudo que custa dinheiro é fixo aqui ou no servidor; o navegador nunca escolhe modelo, prompt nem max_tokens.

/** Variáveis e segredos que o Worker recebe da Cloudflare. */
export interface Ambiente {
  MODO?: string
  PROVEDOR?: string
  ANTHROPIC_API_KEY?: string
  GROQ_API_KEY?: string
  TURNSTILE_SECRET?: string
  TURNSTILE_SITE_KEY?: string
  CHAVE_ASSINATURA?: string
  METRICAS_TOKEN?: string
  CAMBIO_BRL_POR_USD?: string
  TETO_DIA_BRL?: string
  TETO_MES_BRL?: string
  ORIGENS?: string
}

/** Provedores de IA suportados. */
export type Provedor = 'groq' | 'anthropic'

/** Modelo, preços oficiais (US$ por milhão de tokens) e limites de um provedor. */
export interface TabelaModelo {
  id: string
  entradaUsd: number
  saidaUsd: number
  cacheEscritaUsd: number
  cacheLeituraUsd: number
  maxTokens: number
}

/** Claude Haiku 5.5 (Anthropic), prompts até 100 mil tokens. Escrita no cache = 1,25x a entrada; leitura = 0,1x. */
export const MODELO = {
  id: 'claude-haiku-5-5',
  entradaUsd: 0.1,
  saidaUsd: 0.5,
  cacheEscritaUsd: 0.125,
  cacheLeituraUsd: 0.01,
  maxTokens: 900,
  esforco: 'low' as const,
} as const

/**
 * GPT-OSS 120B no Groq (modelo de produção; preços da página do modelo em console.groq.com, conferidos em
 * 08/10/2026). O raciocínio é cobrado como saída, por isso o teto de saída é maior que o do Claude. Sem
 * cobrança de escrita no cache.
 */
export const MODELO_GROQ = {
  id: 'openai/gpt-oss-120b',
  entradaUsd: 0.15,
  saidaUsd: 0.6,
  cacheEscritaUsd: 0.15,
  cacheLeituraUsd: 0.075,
  maxTokens: 2000,
  esforco: 'low' as const,
} as const

/** Tabela de preços e limites de cada provedor. */
export const TABELAS: Record<Provedor, TabelaModelo> = { anthropic: MODELO, groq: MODELO_GROQ }

/** Pior caso de um turno, para reservar o orçamento antes de chamar a API (tokens). */
export const PIOR_TURNO = { entrada: 14_000 }

/** Chave de assinatura só para o modo simulado sem segredo configurado (desenvolvimento local). */
const CHAVE_DEV = 'chave-de-desenvolvimento-do-modo-simulado'

/** Configuração já lida e validada. */
export interface Config {
  modo: 'simulado' | 'real'
  provedor: Provedor
  /** Chave do provedor escolhido. */
  chaveApi: string | null
  turnstileSecreto: string | null
  turnstileSite: string | null
  chaveAssinatura: string
  metricasToken: string | null
  cambio: number
  tetoDiaBrl: number
  tetoMesBrl: number
  origens: string[]
}

/** Lê um número positivo do ambiente, com valor padrão quando falta ou é inválido. */
function numero(valor: string | undefined, padrao: number): number {
  const n = Number(String(valor ?? '').replace(',', '.'))
  return Number.isFinite(n) && n > 0 ? n : padrao
}

/**
 * Lê a configuração do ambiente do Worker.
 *
 * @param env variáveis e segredos.
 * @returns a configuração; no modo real sem `CHAVE_ASSINATURA`, lança erro (sem ela o histórico pode ser forjado).
 */
export function lerConfig(env: Ambiente): Config {
  const provedor: Provedor = env.PROVEDOR === 'anthropic' ? 'anthropic' : 'groq'
  const modo = env.MODO === 'real' ? 'real' : 'simulado'
  const chaveAssinatura = env.CHAVE_ASSINATURA || (modo === 'simulado' ? CHAVE_DEV : '')
  if (!chaveAssinatura) throw new Error('CHAVE_ASSINATURA ausente no modo real')
  return {
    modo,
    provedor,
    chaveApi: (provedor === 'groq' ? env.GROQ_API_KEY : env.ANTHROPIC_API_KEY) || null,
    turnstileSecreto: env.TURNSTILE_SECRET || null,
    turnstileSite: env.TURNSTILE_SITE_KEY || null,
    chaveAssinatura,
    metricasToken: env.METRICAS_TOKEN || null,
    cambio: numero(env.CAMBIO_BRL_POR_USD, 5.5),
    tetoDiaBrl: numero(env.TETO_DIA_BRL, 3),
    tetoMesBrl: numero(env.TETO_MES_BRL, 50),
    origens: (env.ORIGENS || 'https://vlfcandido.github.io')
      .split(',')
      .map((o) => o.trim())
      .filter(Boolean),
  }
}

/** Uso de tokens de uma resposta, nos campos que a API devolve. */
export interface Uso {
  input_tokens: number
  output_tokens: number
  cache_creation_input_tokens?: number | null
  cache_read_input_tokens?: number | null
}

/**
 * Converte o uso de tokens em reais.
 *
 * @param uso campo `usage` da resposta.
 * @param cambio reais por dólar.
 * @param provedor de quem são os preços (padrão: anthropic).
 * @returns custo do turno em R$.
 */
export function custoBrl(uso: Uso, cambio: number, provedor: Provedor = 'anthropic'): number {
  const MODELO = TABELAS[provedor]
  const usd =
    (uso.input_tokens * MODELO.entradaUsd +
      uso.output_tokens * MODELO.saidaUsd +
      (uso.cache_creation_input_tokens ?? 0) * MODELO.cacheEscritaUsd +
      (uso.cache_read_input_tokens ?? 0) * MODELO.cacheLeituraUsd) /
    1_000_000
  return usd * cambio
}

/**
 * Custo do pior turno em reais, reservado antes de cada chamada.
 *
 * @param cambio reais por dólar.
 * @param provedor de quem são os preços (padrão: anthropic).
 * @returns R$ do pior caso.
 */
export function reservaPorTurnoBrl(cambio: number, provedor: Provedor = 'anthropic'): number {
  return custoBrl({ input_tokens: PIOR_TURNO.entrada, output_tokens: TABELAS[provedor].maxTokens }, cambio, provedor)
}
