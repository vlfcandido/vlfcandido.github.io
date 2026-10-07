import { links, perfil } from '../conteudo'
import { LinkExterno } from './LinkExterno'
import { Secao } from './Secao'

/** Convite e links públicos (sem e-mail nem telefone, por decisão de privacidade). */
export function Contato() {
  return (
    <Secao id="contato" numero="04" titulo="Contato">
      <p className="max-w-2xl text-suave">{perfil.convite}</p>
      <ul className="mt-6 divide-y divide-linha border-y border-linha">
        {links.map((l) => (
          <li key={l.url}>
            <LinkExterno
              href={l.url}
              className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 py-4 hover:text-destaque"
            >
              <span>
                <span className="font-semibold">{l.rotulo}</span>
                <span className="text-suave"> · {l.descricao}</span>
              </span>
              <span className="font-mono text-xs break-all text-suave">{l.url.replace(/^https:\/\/(www\.)?/, '')}</span>
            </LinkExterno>
          </li>
        ))}
      </ul>
    </Secao>
  )
}
