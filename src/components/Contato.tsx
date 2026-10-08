import { links, perfil } from '../conteudo'
import { GITHUB, LINKEDIN } from '../visuais'
import { LinkExterno } from './LinkExterno'

/** Fechamento: o convite, o botão do LinkedIn e os outros perfis em segundo plano. */
export function Contato() {
  const noventaENove = links.find((l) => l.rotulo === '99Freelas')
  return (
    <section id="contato" aria-labelledby="contato-titulo" className="scroll-mt-24 pt-2 pb-12 lg:pb-20">
      <div className="rounded-2xl bg-cobalto px-5 py-7 text-nevoa sm:px-12 sm:py-12 lg:flex lg:items-end lg:justify-between lg:gap-12">
        <div>
          <h2 id="contato-titulo" className="max-w-[18ch] text-[1.75rem] leading-[1.1] font-bold tracking-[0.004em] sm:text-[2.6rem]">
            Conte o que você precisa.
          </h2>
          <p className="prosa mt-3 max-w-[48ch] text-[1.05rem] opacity-90 sm:text-[1.1rem]">{perfil.convite}</p>
        </div>
        <LinkExterno
          href={LINKEDIN}
          className="botao-acao mt-5 inline-block shrink-0 rounded-full bg-nevoa px-6 py-3.5 text-[1.05rem] sm:px-7 sm:py-4 sm:text-[1.1rem] font-semibold text-cobalto hover:bg-folha"
        >
          Falar comigo no LinkedIn
        </LinkExterno>
      </div>
      <p className="mt-4 flex flex-wrap gap-x-8 gap-y-2 text-grafite">
        {noventaENove && (
          <LinkExterno href={noventaENove.url} className="sublinha hover:text-tinta">
            99Freelas
          </LinkExterno>
        )}
        <LinkExterno href={GITHUB} className="sublinha hover:text-tinta">
          GitHub
        </LinkExterno>
      </p>
    </section>
  )
}
