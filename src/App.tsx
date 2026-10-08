import { useEffect, useState } from 'react'
import { Cabecalho } from './components/Cabecalho'
import { DefsDiagramas } from './components/Diagramas'
import { LinkedinFixo } from './components/LinkedinFixo'
import { Rodape } from './components/Rodape'
import { rotaDoHash, type Rota } from './lib/rota'
import { PaginaInicio } from './paginas/Inicio'
import { PaginaProjetos } from './paginas/Projetos'

/** Lê a rota do hash atual e acompanha as mudanças; ao trocar de página, volta ao topo. */
function useRota(): Rota {
  const [rota, setRota] = useState<Rota>(() => rotaDoHash(window.location.hash))
  useEffect(() => {
    function aoMudar() {
      // Âncora da própria página (#como-funciona) o navegador rola sozinho; troca de página volta ao topo.
      if (!/^#[^/]/.test(window.location.hash)) window.scrollTo({ top: 0 })
      setRota(rotaDoHash(window.location.hash))
    }
    window.addEventListener('hashchange', aoMudar)
    return () => window.removeEventListener('hashchange', aoMudar)
  }, [])
  return rota
}

/** Site com duas páginas: a principal, comercial, e a de projetos, com o detalhe técnico. */
export function App() {
  const rota = useRota()
  return (
    <>
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-30 focus:rounded focus:bg-tinta focus:px-3 focus:py-2 focus:text-nevoa"
      >
        Pular para o conteúdo
      </a>
      <DefsDiagramas />
      <Cabecalho rota={rota} />
      <main id="conteudo" className="mx-auto max-w-7xl px-4 sm:px-8">
        {rota === 'projetos' ? <PaginaProjetos /> : <PaginaInicio />}
      </main>
      <Rodape />
      <LinkedinFixo rota={rota} />
    </>
  )
}
