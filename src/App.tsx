import { Cabecalho } from './components/Cabecalho'
import { Cases } from './components/Cases'
import { ComoTrabalho } from './components/ComoTrabalho'
import { Contato } from './components/Contato'
import { Rodape } from './components/Rodape'
import { Sobre } from './components/Sobre'
import { Stack } from './components/Stack'

/** Página única do portfólio: abertura, cases, método, stack e contato. */
export function App() {
  return (
    <>
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-20 focus:bg-tinta focus:px-3 focus:py-2 focus:text-papel"
      >
        Pular para o conteúdo
      </a>
      <Cabecalho />
      <main id="conteudo" className="mx-auto max-w-6xl px-4 sm:px-6">
        <Sobre />
        <Cases />
        <ComoTrabalho />
        <Stack />
        <Contato />
      </main>
      <Rodape />
    </>
  )
}
