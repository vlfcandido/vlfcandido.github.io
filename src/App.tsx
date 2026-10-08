import { useEffect, useRef, useState } from 'react'
import { Cabecalho } from './components/Cabecalho'
import { LinkedinFixo } from './components/LinkedinFixo'
import { Rodape } from './components/Rodape'
import { HASH_PROJETOS, hashAtual, movimentoDaTroca, projetoDoHash, rotaDoHash, secaoDoHash, type Rota } from './lib/rota'
import { iniciarRevelacao } from './lib/revelar'
import { comTransicao } from './lib/transicao'
import { PaginaInicio } from './paginas/Inicio'
import { PaginaProjetos } from './paginas/Projetos'

/** Troca um hash de versão antiga pelo atual sem criar entrada nova no histórico. */
function normalizarHash(): string {
  const novo = hashAtual(window.location.hash)
  if (novo) history.replaceState(null, '', novo)
  return window.location.hash
}

/**
 * Lê o hash atual (já traduzido das versões antigas) e acompanha as mudanças. Quando a troca muda de
 * página (início, projetos, case), ela roda dentro de uma View Transition; âncora e filtro, não.
 * Sem suporte (ou com menos movimento), a troca é direta e o CSS cuida do fallback.
 */
function useHash(): string {
  const [hash, setHash] = useState(normalizarHash)
  const atual = useRef(hash)
  useEffect(() => {
    const aoMudar = () => {
      const novo = normalizarHash()
      const tipo = movimentoDaTroca(atual.current, novo)
      atual.current = novo
      document.documentElement.dataset.navegou = '1'
      if (tipo) comTransicao(() => setHash(novo), tipo)
      else setHash(novo)
    }
    window.addEventListener('hashchange', aoMudar)
    return () => window.removeEventListener('hashchange', aoMudar)
  }, [])
  return hash
}

/**
 * Depois de cada render da rota, leva a pessoa ao destino: a seção da âncora ou o título da página.
 * O foco vai junto (tabindex -1) para leitor de tela e teclado continuarem dali, e a rolagem é
 * suave salvo quando o sistema pede menos movimento. O case de projeto abre no topo; ao voltar dele,
 * o foco volta ao card do projeto.
 */
function useDestino(hash: string, rota: Rota) {
  const anterior = useRef<string | null>(null)
  useEffect(() => {
    const antes = anterior.current
    anterior.current = hash
    const suave = !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    // Case de projeto (página inteira desde 08/10/2026): abre no topo, com o foco no título do case.
    if (projetoDoHash(hash)) {
      window.scrollTo({ top: 0, behavior: 'instant' })
      document.getElementById('case-titulo')?.focus({ preventScroll: true })
      return
    }
    // Voltar de um case para a galeria: foco e rolagem no card de onde a pessoa saiu.
    const deCase = hash === HASH_PROJETOS && antes ? projetoDoHash(antes) : null
    const card = deCase ? document.getElementById(`card-${deCase}`) : null
    if (card) {
      card.focus({ preventScroll: true })
      card.scrollIntoView({ block: 'center', behavior: 'instant' })
      return
    }
    const id = secaoDoHash(hash)
    const alvo = id ? document.getElementById(id) : rota === 'projetos' ? document.querySelector('main h1') : null
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
  // Entrada das seções ao rolar: refaz a lista a cada página ou case (o DOM novo ainda não foi observado).
  const pagina = projetoDoHash(hash) ?? rota
  useEffect(() => iniciarRevelacao(document.getElementById('conteudo') ?? document), [pagina])
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
        {/* Fallback sem View Transition: a página nova entra com um fade curto (ver `.pagina-troca`). */}
        <div key={rota} className="pagina-troca">
          {rota === 'projetos' ? <PaginaProjetos hash={hash} /> : <PaginaInicio />}
        </div>
      </main>
      <Rodape />
      <LinkedinFixo rota={rota} />
    </>
  )
}
