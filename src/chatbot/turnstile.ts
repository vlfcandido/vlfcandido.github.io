// Turnstile no navegador: carrega o script da Cloudflare só quando o visitante manda a 1ª mensagem com a IA
// ligada, e devolve o token. Nada carrega ao importar.

interface ApiTurnstile {
  render(
    alvo: HTMLElement,
    opcoes: {
      sitekey: string
      callback: (token: string) => void
      'error-callback': () => void
      'expired-callback': () => void
      appearance?: 'always' | 'execute' | 'interaction-only'
      size?: 'normal' | 'flexible' | 'compact'
      language?: string
    },
  ): string
  remove(id: string): void
}

declare global {
  interface Window {
    turnstile?: ApiTurnstile
  }
}

const SCRIPT = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
let carregando: Promise<ApiTurnstile> | null = null

/** Carrega o script do Turnstile uma vez. */
function carregar(): Promise<ApiTurnstile> {
  if (window.turnstile) return Promise.resolve(window.turnstile)
  carregando ??= new Promise((resolver, rejeitar) => {
    const s = document.createElement('script')
    s.src = SCRIPT
    s.async = true
    s.onload = () => (window.turnstile ? resolver(window.turnstile) : rejeitar(new Error('turnstile')))
    s.onerror = () => {
      carregando = null
      rejeitar(new Error('turnstile'))
    }
    document.head.appendChild(s)
  })
  return carregando
}

/**
 * Pede um token do Turnstile. O desafio só aparece quando a Cloudflare acha necessário (`interaction-only`).
 *
 * @param chave chave pública do site.
 * @param alvo elemento onde o desafio aparece, se aparecer.
 * @returns o token, ou `null` se não deu (o widget cai no roteiro fixo).
 */
export async function obterToken(chave: string, alvo: HTMLElement): Promise<string | null> {
  try {
    const api = await carregar()
    return await new Promise<string | null>((resolver) => {
      const id = api.render(alvo, {
        sitekey: chave,
        appearance: 'interaction-only',
        size: 'flexible',
        language: 'pt-br',
        callback: (token) => {
          resolver(token)
          setTimeout(() => api.remove(id), 0)
        },
        'error-callback': () => resolver(null),
        'expired-callback': () => resolver(null),
      })
    })
  } catch {
    return null
  }
}
