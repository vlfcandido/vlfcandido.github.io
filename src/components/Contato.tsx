import { links, perfil } from '../conteudo'
import { LINKEDIN } from '../visuais'
import { LinkExterno } from './LinkExterno'

/** Fechamento: o convite e o LinkedIn como porta principal; os outros perfis vêm depois. */
export function Contato() {
  const outros = links.filter((l) => l.url !== LINKEDIN)
  return (
    <section id="contato" aria-labelledby="contato-titulo" className="scroll-mt-24 border-t border-linha py-16 sm:py-24">
      <div className="rounded-xl bg-cobalto px-6 py-12 text-nevoa sm:px-12 sm:py-16">
        <h2 id="contato-titulo" className="max-w-[18ch] text-[2.2rem] leading-[1.05] font-bold tracking-tight sm:text-[3.4rem]">
          Conte o que você precisa.
        </h2>
        <p className="prosa mt-5 max-w-[52ch] text-[1.2rem] opacity-90">{perfil.convite}</p>
        <LinkExterno
          href={LINKEDIN}
          className="mt-8 inline-block rounded-full bg-nevoa px-7 py-4 text-[1.1rem] font-semibold text-cobalto hover:bg-folha"
        >
          Falar comigo no LinkedIn
        </LinkExterno>
      </div>
      <ul className="mt-8 flex flex-wrap gap-x-10 gap-y-3">
        {outros.map((l) => (
          <li key={l.url}>
            <LinkExterno href={l.url} className="group">
              <span className="font-semibold underline decoration-linha decoration-2 underline-offset-4 group-hover:decoration-cobalto">
                {l.rotulo}
              </span>
              <span className="text-grafite">, {l.descricao}</span>
            </LinkExterno>
          </li>
        ))}
      </ul>
    </section>
  )
}
