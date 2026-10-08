import { links, perfil } from '../conteudo'
import { GITHUB, LINKEDIN } from '../visuais'
import { LinkExterno } from './LinkExterno'

/** Fechamento: o convite, o botão do LinkedIn e os outros perfis em segundo plano. */
export function Contato() {
  const noventaENove = links.find((l) => l.rotulo === '99Freelas')
  return (
    <section id="contato" aria-labelledby="contato-titulo" className="scroll-mt-24 pt-4 pb-16 sm:pb-24">
      <div className="rounded-2xl bg-cobalto px-6 py-12 text-nevoa sm:px-14 sm:py-16">
        <h2 id="contato-titulo" className="max-w-[18ch] text-[2.2rem] leading-[1.05] font-bold tracking-tight sm:text-[3.2rem]">
          Conte o que você precisa.
        </h2>
        <p className="prosa mt-5 max-w-[48ch] text-[1.2rem] opacity-90">{perfil.convite}</p>
        <LinkExterno
          href={LINKEDIN}
          className="botao-acao mt-8 inline-block rounded-full bg-nevoa px-7 py-4 text-[1.1rem] font-semibold text-cobalto hover:bg-folha"
        >
          Falar comigo no LinkedIn
        </LinkExterno>
      </div>
      <p className="mt-6 flex flex-wrap gap-x-8 gap-y-2 text-grafite">
        {noventaENove && (
          <LinkExterno href={noventaENove.url} className="underline decoration-linha underline-offset-4 hover:text-tinta">
            99Freelas
          </LinkExterno>
        )}
        <LinkExterno href={GITHUB} className="underline decoration-linha underline-offset-4 hover:text-tinta">
          GitHub
        </LinkExterno>
      </p>
    </section>
  )
}
