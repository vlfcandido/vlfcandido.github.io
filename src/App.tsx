import { Abertura } from './components/Abertura'
import { Cabecalho } from './components/Cabecalho'
import { Clientes } from './components/Clientes'
import { Empresas } from './components/Empresas'
import { Imprensa } from './components/Imprensa'
import { ComoTrabalho } from './components/ComoTrabalho'
import { Contato } from './components/Contato'
import { DefsDiagramas } from './components/Diagramas'
import { LinkedinFixo } from './components/LinkedinFixo'
import { Projetos } from './components/Projetos'
import { Rodape } from './components/Rodape'

/** Página única: abertura, projetos, clientes, imprensa, método e contato. */
export function App() {
  return (
    <>
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-30 focus:rounded focus:bg-tinta focus:px-3 focus:py-2 focus:text-nevoa"
      >
        Pular para o conteúdo
      </a>
      <DefsDiagramas />
      <Cabecalho />
      <main id="conteudo" className="mx-auto max-w-7xl px-4 sm:px-8">
        <Abertura />
        <Empresas />
        <Projetos />
        <Clientes />
        <Imprensa />
        <ComoTrabalho />
        <Contato />
      </main>
      <Rodape />
      <LinkedinFixo />
    </>
  )
}
