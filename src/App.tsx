import { useEffect, useRef, useState } from 'react'
import { Cabecalho } from './components/Cabecalho'
import { LinkedinFixo } from './components/LinkedinFixo'
import { Rodape } from './components/Rodape'
import { HASH_PROJETOS, hashAtual, projetoDoHash, rotaDoHash, secaoDoHash, type Rota } from './lib/rota'
import { PaginaInicio } from './paginas/Inicio'
import { PaginaProjetos } from './paginas/Projetos'

/** Troca um hash de versão antiga pelo atual sem criar entrada nova no histórico. */
function normalizarHash(): string {
  const novo = hashAtual(window.location.hash)
  if (novo) history.replaceState(null, '', novo)
  return window.location.hash
}

/** Lê o hash atual (já traduzido das versões antigas) e acompanha as mudanças. */
function useHash(): string {
  const [hash, setHash] = useState(normalizarHash)
  useEffect(() => {
    const aoMudar = () => setHash(normalizarHash())
    window.addEventListener('hashchange', aoMudar)
    return () => window.removeEventListener('hashchange', aoMudar)
  }, [])
  return hash
}

/**
 * Depois de cada render da rota, leva a pessoa ao destino: a seção da âncora ou o título da página.
 * O foco vai junto (tabindex -1) para leitor de tela e teclado continuarem dali, e a rolagem é
 * suave salvo quando o sistema pede menos movimento. Abrir e fechar o painel de projeto não conta.
 */
function useDestino(hash: string, rota: Rota) {
  const anterior = useRef<string | null>(null)
  useEffect(() => {
    const antes = anterior.current
    anterior.current = hash
    // Abrir ou fechar o painel de um projeto não mexe na rolagem nem no foco: o painel cuida disso.
    if (projetoDoHash(hash) || (hash === HASH_PROJETOS && antes && projetoDoHash(antes))) return
    const id = secaoDoHash(hash)
    const alvo = id ? document.getElementById(id) : rota === 'projetos' ? document.querySelector('main h1') : null
    const suave = !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!alvo) {
      window.scrollTo({ top: 0 })
      return
    }
    if (!(alvo instanceof HTMLElement)) return
    if (!alvo.hasAttribute('tabindex')) alvo.setAttribute('tabindex', '-1')
    alvo.focus({ preventScroll: true })
    if (id) alvo.scrollIntoView({ behavior: suave ? 'smooth' : 'auto', block: 'start' })
    else window.scrollTo({ top: 0 })
  }, [hash, rota])
}

/** Site com duas páginas: a principal, comercial, e a de projetos, com o detalhe técnico. */
export function App() {
  const hash = useHash()
  const rota = rotaDoHash(hash)
  useDestino(hash, rota)
  return (
    <>
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-30 focus:rounded focus:bg-tinta focus:px-3 focus:py-2 focus:text-nevoa"
      >
        Pular para o conteúdo
      </a>
      <Cabecalho rota={rota} />
      <main id="conteudo" className="mx-auto max-w-7xl px-4 sm:px-8">
        {rota === 'projetos' ? <PaginaProjetos hash={hash} /> : <PaginaInicio />}
      </main>
      <Rodape />
      <LinkedinFixo rota={rota} />
    </>
  )
}
