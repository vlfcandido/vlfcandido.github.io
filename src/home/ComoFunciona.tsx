// Bloco 5: como funciona, em 5 passos, e a garantia escrita (30 dias de correção, decisão dele de 14/10/2026).
import { conteudoHome } from './conteudo'
import { Marcacao } from './Marcacao'

const FRASE_MARCADA = '30 dias de correção'

/** Quinto bloco da home: os passos numerados e a garantia. */
export function ComoFunciona() {
  const { passos, garantia } = conteudoHome()
  const [antes, depois] = garantia.split(FRASE_MARCADA)
  return (
    <section id="como" className="secao">
      <h2 className="titulo-bloco">Como funciona</h2>
      <ol className="mt-10 grid gap-x-6 md:grid-cols-5">
        {passos.map((p, i) => (
          <li key={p.titulo} className="grid grid-cols-[3.5rem_1fr] gap-x-3 border-t border-linha py-5 md:block md:py-6">
            <span className="numero-passo" aria-hidden="true">
              {i + 1}
            </span>
            <div className="md:mt-5">
              <h3 className="text-lg leading-snug font-semibold">{p.titulo}</h3>
              <p className="mt-1.5 text-sm text-grafite">{p.texto}</p>
            </div>
          </li>
        ))}
      </ol>
      <p className="mt-10 max-w-3xl text-xl leading-relaxed sm:text-2xl">
        {antes}
        <Marcacao tipo="grifo">{FRASE_MARCADA}</Marcacao>
        {depois}
      </p>
    </section>
  )
}
