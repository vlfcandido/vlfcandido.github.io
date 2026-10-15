import { conteudoHome } from '../home/conteudo'
import { WHATSAPP } from '../lib/whatsapp'
import { IconeConversa } from './IconeConversa'
import { LinkExterno } from './LinkExterno'

// Task 10: caixa em tinta e botão em marca-texto (antes cobalto da Maré, fora da paleta de um destaque só).
/**
 * Fechamento de #/projetos: a mesma chamada da home e o botão do WhatsApp. 15/10/2026 (revisor, rodada 2): antes o
 * título era "Conte o que você precisa." com o convite "Me chame no WhatsApp e conte o que você precisa. Respondo com o
 * preço fechado e o prazo." (a frase repetida), e embaixo vinha a linha LinkedIn · 99Freelas · GitHub, que o rodapé
 * repetia logo depois; o 99Freelas foi para o rodapé.
 */
export function Contato() {
  const { chamada } = conteudoHome()
  return (
    <section id="contato" aria-labelledby="contato-titulo" className="scroll-mt-24 pt-2 pb-12 lg:pb-20">
      <div className="rounded-2xl bg-tinta px-5 py-7 text-nevoa sm:px-12 sm:py-12 lg:flex lg:items-end lg:justify-between lg:gap-12">
        <div>
          <h2 id="contato-titulo" className="max-w-[18ch] text-[1.75rem] leading-[1.1] font-bold tracking-[0.004em] sm:text-[2.6rem]">
            {chamada.titulo}
          </h2>
          <p className="prosa mt-3 max-w-[48ch] text-[1.05rem] opacity-90 sm:text-[1.1rem]">Respondo com o preço fechado e o prazo.</p>
        </div>
        <div id="contato-cta" className="mt-6 shrink-0 lg:mt-0">
          <LinkExterno
            href={WHATSAPP}
            className="botao-acao contato-botao inline-flex items-center gap-2.5 rounded-full bg-marca py-3.5 pr-6 pl-5 text-[1.05rem] font-semibold text-marca-tinta hover:brightness-105 sm:py-4 sm:pr-7 sm:pl-6 sm:text-[1.1rem]"
          >
            <IconeConversa tamanho={22} />
            Chamar no WhatsApp
          </LinkExterno>
          <p className="mt-3 text-[0.95rem] opacity-85">A mensagem já vai escrita. É só enviar.</p>
        </div>
      </div>
    </section>
  )
}
