import { perfil } from '../conteudo'

/** Rodapé: autoria e aviso sobre marcas e dados fictícios. */
export function Rodape() {
  return (
    <footer className="border-t border-linha pb-24 sm:pb-0">
      <p className="mx-auto max-w-7xl px-4 py-8 text-[0.9rem] text-grafite sm:px-8">
        {perfil.nome}, {new Date().getFullYear()}. Marcas e logos pertencem às respectivas empresas. Os prints de projetos
        usam dados fictícios.
      </p>
    </footer>
  )
}
