import { perfil } from '../conteudo'
import { GITHUB, LINKEDIN } from '../visuais'
import { BotaoTema } from './BotaoTema'
import { LinkExterno } from './LinkExterno'

const SECOES = [
  { id: 'projetos', rotulo: 'Projetos' },
  { id: 'clientes', rotulo: 'Clientes' },
  { id: 'imprensa', rotulo: 'Imprensa' },
  { id: 'como-trabalho', rotulo: 'Como trabalho' },
] as const

/** Cabeçalho fixo: nome, seções e a chamada do LinkedIn sempre à vista. */
export function Cabecalho() {
  return (
    <header className="sticky top-0 z-20 border-b border-linha/70 bg-nevoa/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:gap-5 sm:px-8">
        <a href="#inicio" className="mr-auto text-[1.05rem] font-bold tracking-tight">
          {perfil.nome}
        </a>
        <nav aria-label="Seções" className="hidden lg:block">
          <ul className="flex gap-6 text-[0.95rem] text-grafite">
            {SECOES.map((s) => (
              <li key={s.id}>
                <a className="hover:text-tinta" href={`#${s.id}`}>
                  {s.rotulo}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <LinkExterno href={GITHUB} className="hidden text-[0.95rem] text-grafite hover:text-tinta sm:inline">
          GitHub
        </LinkExterno>
        <BotaoTema />
        <LinkExterno
          href={LINKEDIN}
          className="rounded-full bg-cobalto px-4 py-2 text-[0.95rem] font-semibold whitespace-nowrap text-nevoa hover:bg-cobalto-forte"
        >
          <span className="sm:hidden">LinkedIn</span>
          <span className="hidden sm:inline">Falar comigo no LinkedIn</span>
        </LinkExterno>
      </div>
    </header>
  )
}
