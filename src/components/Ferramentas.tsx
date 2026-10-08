import { numeros, stack } from '../conteudo'
import { FonteLink } from './FonteLink'

/** Números com fonte e as ferramentas do dia a dia, para quem quer o detalhe técnico. */
export function Ferramentas() {
  return (
    <section id="ferramentas" aria-labelledby="ferramentas-titulo" className="scroll-mt-24 border-t border-linha py-16 sm:py-20">
      <div className="grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <h2 id="ferramentas-titulo" className="text-[1.8rem] font-bold tracking-tight">
            Números que dá para conferir
          </h2>
          <ul className="mt-6 space-y-5">
            {numeros.map((n) => (
              <li key={n.valor} className="prosa text-[1.1rem]">
                <strong className="grifo font-titulo text-[1.4rem] font-bold whitespace-nowrap">{n.valor}</strong> {n.rotulo}.{' '}
                <span className="text-[0.95rem] text-grafite">
                  Fonte: <FonteLink fonte={n.fonte} />
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className="lg:col-span-6 lg:col-start-7">
          <h2 className="text-[1.8rem] font-bold tracking-tight">Ferramentas do dia a dia</h2>
          <dl className="mt-6 grid gap-x-10 gap-y-6 sm:grid-cols-2">
            {stack.map((c) => (
              <div key={c.camada}>
                <dt className="font-semibold">{c.camada}</dt>
                <dd className="prosa mt-1 text-grafite">{c.itens.join(', ')}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}
