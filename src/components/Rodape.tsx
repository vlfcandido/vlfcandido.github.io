import { perfil } from '../conteudo'
import { CartaNautica } from './CartaNautica'
import { Ilustracao, Isobatas } from './Mare'

/** Rodapé: as isóbatas da identidade, autoria e aviso sobre marcas e dados fictícios. */
export function Rodape() {
  return (
    <footer className="relative isolate overflow-hidden border-t border-linha bg-nevoa pb-24 sm:pb-0">
      <Isobatas className="pointer-events-none absolute inset-0 -z-10 h-full w-full opacity-70" />
      <CartaNautica
        versao="faixa"
        sizes="(min-width: 640px) 50vw, 100vw"
        className="carta-faixa pointer-events-none absolute top-0 right-0 -z-10 h-full w-full sm:w-[55%]"
      />
      <div className="mx-auto flex max-w-7xl items-end gap-5 px-4 py-10 sm:px-8 sm:py-12">
        <Ilustracao nome="gaivota" className="size-12 shrink-0 text-mar" />
        <p className="max-w-[60ch] text-[0.9rem] text-grafite">
          {perfil.nome}, {new Date().getFullYear()}. Marcas e logos pertencem às respectivas empresas. Os prints de projetos
          usam dados fictícios. Ilustrações geradas com IA e editadas por Vinicius Candido.
        </p>
      </div>
    </footer>
  )
}
