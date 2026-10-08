// Verificação do Turnstile (anti-robô da Cloudflare) na abertura de cada conversa.
// Doc: https://developers.cloudflare.com/turnstile/get-started/server-side-validation/

const URL_VERIFICACAO = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'

/** Função que confere um token do Turnstile; injetável para os testes. */
export type VerificadorTurnstile = (token: string, ip: string | null) => Promise<boolean>

/**
 * Cria o verificador com a chave secreta.
 *
 * @param segredo chave secreta do Turnstile (segredo do Worker).
 * @param buscar `fetch` (injetável).
 * @returns função que diz se o token é válido.
 */
export function criarVerificador(segredo: string, buscar: typeof fetch = fetch): VerificadorTurnstile {
  return async (token, ip) => {
    if (!token || token.length > 2048) return false
    const corpo = new FormData()
    corpo.append('secret', segredo)
    corpo.append('response', token)
    if (ip) corpo.append('remoteip', ip)
    try {
      const resposta = await buscar(URL_VERIFICACAO, { method: 'POST', body: corpo })
      const dados = (await resposta.json()) as { success?: boolean }
      return dados.success === true
    } catch {
      return false
    }
  }
}
