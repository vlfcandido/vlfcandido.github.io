import { perfil } from '../conteudo'
import { fotos } from '../visuais'
import { LinkExterno } from './LinkExterno'

/** Rodapé: autoria, créditos das fotos livres e aviso sobre marcas e dados fictícios. */
export function Rodape() {
  return (
    <footer className="border-t border-linha pb-24 sm:pb-0">
      <div className="mx-auto grid max-w-7xl gap-4 px-4 py-8 text-[0.9rem] text-grafite sm:px-8 md:grid-cols-2">
        <p>
          {perfil.nome}, {new Date().getFullYear()}. Os prints usam dados fictícios. Marcas e logos pertencem às
          respectivas empresas.
        </p>
        <p className="md:text-right">
          Fotos:{' '}
          {Object.values(fotos).map((f) => (
            <LinkExterno key={f.url} href={f.url} className="underline decoration-linha underline-offset-2 hover:text-tinta">
              {f.autor} no {f.origem} ({f.licenca})
            </LinkExterno>
          ))}
          . Diagramas e ilustrações desenhados para este site.
        </p>
      </div>
    </footer>
  )
}
