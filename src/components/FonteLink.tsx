import type { Fonte } from '../conteudo'
import { LinkExterno } from './LinkExterno'

/** Mostra a origem de um dado; vira link quando a fonte é pública. */
export function FonteLink({ fonte }: { fonte: Fonte }) {
  if (!fonte.url) return <span>{fonte.texto}</span>
  return (
    <LinkExterno
      href={fonte.url}
      className="underline decoration-linha underline-offset-2 hover:text-destaque hover:decoration-destaque"
    >
      {fonte.texto}
    </LinkExterno>
  )
}
