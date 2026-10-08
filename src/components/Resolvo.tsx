import { oferta } from '../conteudo'
import { DiagramaMare } from './DiagramaMare'

/** O que eu resolvo: quatro ofertas escritas como resultado para quem contrata. */
export function Resolvo() {
  return (
    <section id="o-que-eu-resolvo" aria-labelledby="resolvo-titulo" className="scroll-mt-24 border-t border-linha py-20 sm:py-28">
      <h2 id="resolvo-titulo" className="text-[2rem] leading-[1.12] font-bold tracking-[0.004em] sm:text-[2.6rem]">
        O que eu resolvo
      </h2>
      <ul className="mt-10 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
        {oferta.map((o) => (
          <li key={o.titulo} className="border-t-[3px] border-cobalto pt-5">
            <h3 className="text-[1.25rem] leading-snug font-semibold text-balance">{o.titulo}</h3>
            <p className="prosa mt-2 text-[1.08rem] text-grafite">{o.descricao}</p>
          </li>
        ))}
      </ul>
      {/* Como eu integro: discreto. No computador o desenho fica à vista; no celular, atrás de um toque. */}
      <figure className="mt-16 hidden grid-cols-[15rem_1fr] items-center gap-8 border-t border-linha pt-10 lg:grid">
        <figcaption>
          <span className="block font-[family-name:var(--font-display)] text-[1.35rem] leading-[1.25] font-semibold">
            Como eu ligo um agente ao que a sua empresa já usa
          </span>
          <span className="prosa mt-3 block text-[1.02rem] text-grafite">
            WhatsApp, agenda, ERP e CRM conversando, com uma pessoa da equipe por perto quando o robô não resolve.
          </span>
        </figcaption>
        <DiagramaMare id="como-eu-integro" modo="largo" className="max-w-[880px]" />
      </figure>
      <details className="integro mt-12 rounded-xl border border-linha bg-folha/60 px-4 py-3 lg:hidden">
        <summary className="cursor-pointer py-1 font-semibold text-cobalto">Ver como eu ligo um agente ao que você já usa</summary>
        <DiagramaMare id="como-eu-integro" modo="estreito" className="mx-auto mt-4 max-w-[400px]" />
      </details>
    </section>
  )
}
