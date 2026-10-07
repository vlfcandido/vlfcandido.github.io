import { perfil } from '../conteudo'

const SECOES = [
  { id: 'cases', rotulo: 'Cases' },
  { id: 'como-trabalho', rotulo: 'Como trabalho' },
  { id: 'stack', rotulo: 'Stack' },
  { id: 'contato', rotulo: 'Contato' },
] as const

/** Cabeçalho fixo com o nome e a navegação por âncoras. */
export function Cabecalho() {
  return (
    <header className="sticky top-0 z-10 border-b border-linha bg-papel">
      <div className="mx-auto flex max-w-6xl flex-wrap items-baseline justify-between gap-x-6 gap-y-1 px-4 py-3 sm:px-6">
        <a href="#sobre" className="font-mono text-sm font-semibold tracking-tight">
          {perfil.nome}
        </a>
        <nav aria-label="Seções">
          <ul className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-suave">
            {SECOES.map((s) => (
              <li key={s.id}>
                <a className="hover:text-tinta" href={`#${s.id}`}>
                  {s.rotulo}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
}
