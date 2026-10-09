import { links, perfil } from '../conteudo'
import { WHATSAPP } from '../lib/whatsapp'
import { GITHUB, LINKEDIN } from '../visuais'
import { IconeConversa } from './IconeConversa'
import { LinkExterno } from './LinkExterno'

/** Fechamento: o convite, o botão do WhatsApp e os outros perfis (LinkedIn, 99Freelas, GitHub) em segundo plano. */
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
        <div id="contato-cta" className="mt-6 shrink-0 lg:mt-0">
          <LinkExterno
            href={WHATSAPP}
            className="botao-acao contato-botao inline-flex items-center gap-2.5 rounded-full bg-nevoa py-3.5 pr-6 pl-5 text-[1.05rem] font-semibold text-cobalto hover:bg-folha sm:py-4 sm:pr-7 sm:pl-6 sm:text-[1.1rem]"
          >
            <IconeConversa tamanho={22} />
            Chamar no WhatsApp
          </LinkExterno>
          <p className="mt-3 text-[0.95rem] opacity-85">A mensagem já vai escrita. É só enviar.</p>
        </div>
      </div>
      <p className="mt-4 flex flex-wrap gap-x-8 gap-y-2 text-grafite">
        <LinkExterno href={LINKEDIN} className="sublinha hover:text-tinta">
          LinkedIn
        </LinkExterno>
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
