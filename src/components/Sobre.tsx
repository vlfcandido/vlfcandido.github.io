import { numeros, oferta, perfil } from '../conteudo'
import { FonteLink } from './FonteLink'

/** Abertura: quem sou, a oferta em quatro linhas e os números com fonte. */
export function Sobre() {
  return (
    <section id="sobre" aria-labelledby="sobre-titulo" className="scroll-mt-20 py-12 sm:py-20">
      <p className="font-mono text-xs text-suave">{perfil.titulo}</p>
      <h1 id="sobre-titulo" className="mt-2 text-3xl font-semibold tracking-tight sm:text-5xl">
        {perfil.nome}
      </h1>
      <p className="mt-6 max-w-3xl text-lg leading-relaxed sm:text-xl">{perfil.chamada}</p>
      <p className="mt-4 max-w-3xl leading-relaxed text-suave">{perfil.resumo}</p>

      <h2 className="sr-only">O que eu faço</h2>
      <dl className="mt-10 grid gap-px border border-linha bg-linha sm:grid-cols-2">
        {oferta.map((o) => (
          <div key={o.titulo} className="bg-superficie p-5">
            <dt className="font-semibold">{o.titulo}</dt>
            <dd className="mt-1 text-sm leading-relaxed text-suave">{o.descricao}</dd>
          </div>
        ))}
      </dl>

      <h2 className="sr-only">Números com fonte</h2>
      <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {numeros.map((n) => (
          <li key={n.valor} className="border-l-2 border-destaque pl-4">
            <p className="font-mono text-2xl font-semibold">{n.valor}</p>
            <p className="mt-1 text-sm leading-snug">{n.rotulo}</p>
            <p className="mt-2 font-mono text-xs text-suave">
              fonte: <FonteLink fonte={n.fonte} />
            </p>
          </li>
        ))}
      </ul>
    </section>
  )
}
