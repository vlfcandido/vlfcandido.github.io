import { oferta } from '../conteudo'

/** O que eu resolvo: quatro ofertas escritas como resultado para quem contrata. */
export function Resolvo() {
  return (
    <section id="o-que-eu-resolvo" aria-labelledby="resolvo-titulo" className="scroll-mt-24 border-t border-linha py-16 sm:py-20">
      <h2 id="resolvo-titulo" className="text-[2rem] leading-none font-bold tracking-tight sm:text-[2.6rem]">
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
    </section>
  )
}
