import { perfil } from '../conteudo'
import { Ilustracao, Isobatas } from './Mare'

/** Rodapé: as isóbatas da identidade, autoria e aviso sobre marcas e dados fictícios. */
export function Rodape() {
  return (
    <footer className="relative isolate overflow-hidden border-t border-linha pb-24 sm:pb-0">
      <Isobatas className="pointer-events-none absolute inset-0 -z-10 h-full w-full opacity-70" />
      <div className="mx-auto flex max-w-7xl items-end gap-5 px-4 py-10 sm:px-8 sm:py-12">
        <Ilustracao nome="gaivota" className="size-12 shrink-0 text-mar" />
        <p className="max-w-[60ch] text-[0.9rem] text-grafite">
          {perfil.nome}, {new Date().getFullYear()}. Marcas e logos pertencem às respectivas empresas. Os prints de projetos
          usam dados fictícios.
        </p>
      </div>
    </footer>
  )
}
