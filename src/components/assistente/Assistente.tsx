import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { assistenteVisivel, urlDoWorker } from '../../chatbot/cliente'
import { TEXTOS } from '../../chatbot/textos'

// O painel (e o roteiro, os textos e o cliente) só baixa quando o visitante abre o assistente.
const Painel = lazy(() => import('./Painel').then((m) => ({ default: m.Painel })))

/**
 * Botão flutuante "Monte o escopo" e o painel do assistente. Escondido em produção até o Worker estar no ar
 * (`VITE_ASSISTENTE=ligado` no build); em desenvolvimento aparece sempre. No celular, fica acima da barra do
 * LinkedIn.
 */
export function Assistente() {
  const [aberto, setAberto] = useState(false)
  const botao = useRef<HTMLButtonElement>(null)
  const jaAbriu = useRef(false)

  // Ao fechar, o foco volta para o botão que abriu o painel.
  useEffect(() => {
    if (aberto) jaAbriu.current = true
    else if (jaAbriu.current) botao.current?.focus()
  }, [aberto])

  if (!assistenteVisivel(import.meta.env)) return null
  const url = urlDoWorker(import.meta.env)
  const fechar = () => setAberto(false)

  return (
    <>
      {!aberto && (
        <button ref={botao} type="button" onClick={() => setAberto(true)} className="lancador-assistente botao-acao" aria-haspopup="dialog">
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <path d="M7 3h7l4 4v14H7z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
            <path d="M14 3v4h4M10 12h5M10 15.5h5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          {TEXTOS.botao}
        </button>
      )}
      {aberto && (
        <Suspense fallback={null}>
          <Painel urlWorker={url} aoFechar={fechar} />
        </Suspense>
      )}
    </>
  )
}
