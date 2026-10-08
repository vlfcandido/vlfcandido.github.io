// Ponto de entrada: único módulo que executa algo ao carregar (monta o React na página).
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'
import { desregistrarServiceWorkers, recarregarSeHouverVersaoNova } from './lib/versao'
import './index.css'

const raiz = document.getElementById('root')
if (raiz) {
  createRoot(raiz).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}

// Versão guardada no navegador: limpa service workers antigos e confere se há deploy mais novo
// ao abrir, ao voltar para a aba e ao navegar pelo menu (no máximo uma vez por minuto).
if (import.meta.env.PROD) {
  let ultimaConferencia = 0
  const conferir = () => {
    if (Date.now() - ultimaConferencia < 60_000) return
    ultimaConferencia = Date.now()
    recarregarSeHouverVersaoNova(import.meta.env.BASE_URL).catch(() => undefined)
  }
  desregistrarServiceWorkers().catch(() => undefined)
  conferir()
  document.addEventListener('visibilitychange', () => document.visibilityState === 'visible' && conferir())
  window.addEventListener('hashchange', conferir)
}
