import { noticias } from '../noticias'
import { LinkExterno } from './LinkExterno'

/** Imprensa em uma faixa: veículo e manchete curta, cada uma levando à matéria. */
export function Imprensa() {
  return (
    <section id="imprensa" aria-labelledby="imprensa-titulo" className="scroll-mt-24 border-t border-linha py-16 sm:py-20">
      <h2 id="imprensa-titulo" className="text-[2rem] leading-none font-bold tracking-tight sm:text-[2.6rem]">
        Saiu na imprensa
      </h2>
      <ul className="mt-8 divide-y divide-linha border-y border-linha">
        {noticias.map((n) => (
          <li key={n.id}>
            <LinkExterno
              href={n.url}
              className="group grid gap-1 py-4 sm:grid-cols-[11rem_1fr] sm:items-baseline sm:gap-6"
            >
              <span className="text-[0.98rem] font-semibold text-grafite">{n.veiculo}</span>
              <span className="text-[1.12rem] leading-snug underline decoration-transparent decoration-2 underline-offset-4 group-hover:decoration-cobalto">
                {n.titulo}
              </span>
            </LinkExterno>
          </li>
        ))}
      </ul>
    </section>
  )
}
