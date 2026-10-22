import { useEffect, useLayoutEffect, useRef, useState, type RefObject } from 'react'
import { Cabecalho } from './components/Cabecalho'
import { ContatoFixo } from './components/ContatoFixo'
import { Rodape } from './components/Rodape'
import { HASH_PROJETOS, chaveDaPagina, hashAtual, movimentoDaTroca, projetoDoHash, rotaDoHash, secaoDoHash, separarConsultaDoHash, type Rota } from './lib/rota'
import { irParaSecao } from './lib/destino'
import { iniciarRevelacao } from './lib/revelar'
import { iniciarVida } from './lib/vida'
import { comTransicao } from './lib/transicao'
import { PaginaInicio } from './paginas/Inicio'
import { PaginaProjetos } from './paginas/Projetos'

/** Troca um hash de versão antiga pelo atual sem criar entrada nova no histórico. */
function normalizarHash(): string {
  // 15/10/2026: consulta colada no hash (#/projetos?_i=1) vai para o lugar dela, antes do hash.
  const comConsulta = separarConsultaDoHash(window.location.hash)
  if (comConsulta) {
    const busca = new URLSearchParams(window.location.search)
    new URLSearchParams(comConsulta.consulta).forEach((v, k) => busca.set(k, v))
    history.replaceState(null, '', `${window.location.pathname}?${busca}${comConsulta.hash}`)
  }
  const novo = hashAtual(window.location.hash)
  if (novo) history.replaceState(null, '', novo)
  return window.location.hash
}

/** Posição de rolagem de cada página (início, projetos) no momento em que a pessoa abriu um case dela. */
type Posicoes = Map<string, number>

/**
 * Lê o hash atual (já traduzido das versões antigas) e acompanha as mudanças. Quando a troca muda de
 * página (início, projetos, case), ela roda dentro de uma View Transition; âncora e filtro, não.
 * Sem suporte (ou com menos movimento), a troca é direta e o CSS cuida do fallback.
 *
 * @param posicoes onde guardar a rolagem da página de onde a pessoa sai para um case (para voltar ao mesmo ponto).
 */
function useHash(posicoes: RefObject<Posicoes>): string {
  const [hash, setHash] = useState(normalizarHash)
  const atual = useRef(hash)
  useEffect(() => {
    const aoMudar = () => {
      const novo = normalizarHash()
      const tipo = movimentoDaTroca(atual.current, novo)
      // Abrindo um case: a página de baixo ainda está na tela, então a rolagem lida aqui é a dela (§13).
      if (tipo === 'avancar' && !projetoDoHash(atual.current)) posicoes.current.set(chaveDaPagina(atual.current), window.scrollY)
      atual.current = novo
      document.documentElement.dataset.navegou = '1'
      if (tipo) comTransicao(() => setHash(novo), tipo)
      else setHash(novo)
    }
    window.addEventListener('hashchange', aoMudar)
    return () => window.removeEventListener('hashchange', aoMudar)
  }, [posicoes])
  return hash
}

/**
 * Depois de cada render da rota, leva a pessoa ao destino: a seção da âncora ou o título da página.
 * O foco vai junto (tabindex -1) para leitor de tela e teclado continuarem dali, e a rolagem é
 * suave salvo quando o sistema pede menos movimento. O case de projeto abre no topo; ao voltar dele,
 * a página volta ao mesmo ponto de onde a pessoa saiu (§13) e o foco volta ao card do projeto.
 * Em `useLayoutEffect`: dentro da View Transition, a rolagem já está no lugar quando a tela nova é fotografada.
 *
 * @param hash hash atual.
 * @param rota página do hash.
 * @param posicoes rolagens guardadas por `useHash` ao abrir um case.
 */
function useDestino(hash: string, rota: Rota, posicoes: RefObject<Posicoes>) {
  const anterior = useRef<string | null>(null)
  useLayoutEffect(() => {
    const antes = anterior.current
    anterior.current = hash
    const suave = !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    // Case de projeto (página inteira desde 08/10/2026): abre no topo, com o foco no título do case.
    if (projetoDoHash(hash)) {
      window.scrollTo({ top: 0, behavior: 'instant' })
      document.getElementById('case-titulo')?.focus({ preventScroll: true })
      return
    }
    // Voltar de um case: a página volta ao ponto exato de onde a pessoa saiu (início ou galeria), com o foco
    // no card do projeto. Sem posição guardada (link direto para o case), a galeria centra o card.
    const deCase = antes ? projetoDoHash(antes) : null
    const guardada = deCase ? posicoes.current.get(chaveDaPagina(hash)) : undefined
    const card = deCase ? document.getElementById(`card-${deCase}`) : null
    if (deCase && guardada !== undefined && !secaoDoHash(hash)) {
      posicoes.current.delete(chaveDaPagina(hash))
      window.scrollTo({ top: guardada, behavior: 'instant' })
      card?.focus({ preventScroll: true })
      return
    }
    if (card && hash === HASH_PROJETOS) {
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
    // Task 10: a âncora leva o TÍTULO da seção ao topo (abaixo do cabeçalho) e o marca por um instante.
    // Antes: alvo.scrollIntoView na seção, que no PC deixava "Como funciona" e "Quem sou" no mesmo lugar sem aviso.
    if (id) irParaSecao(id, suave)
    else window.scrollTo({ top: 0 })
  }, [hash, rota, posicoes])
}

/** Site com duas páginas: a principal, comercial, e a de projetos, com o detalhe técnico. */
export function App() {
  const posicoes = useRef<Posicoes>(new Map())
  const hash = useHash(posicoes)
  const rota = rotaDoHash(hash)
  useDestino(hash, rota, posicoes)
  // Entrada das seções ao rolar: refaz a lista a cada página ou case (o DOM novo ainda não foi observado).
  const pagina = projetoDoHash(hash) ?? rota
  useEffect(() => iniciarRevelacao(document.getElementById('conteudo') ?? document), [pagina])
  // Botões magnéticos e peças que reagem ao mouse (22/10/2026): um ouvinte só, para o site inteiro.
  useEffect(() => iniciarVida(), [])
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
      <ContatoFixo pagina={pagina} />
    </>
  )
}
