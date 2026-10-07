import { cases } from '../conteudo'
import { CardCase } from './CardCase'
import { Secao } from './Secao'

/** Grade de cases: primeiro os públicos, com link para a fonte, depois os projetos próprios. */
export function Cases() {
  return (
    <Secao id="cases" numero="01" titulo="Cases e projetos">
      <p className="max-w-2xl text-suave">
        Primeiro os cases públicos, com link para quem publicou. Depois, projetos próprios, onde o código é a prova.
      </p>
      <ul className="mt-8 grid gap-6 md:grid-cols-2">
        {cases.map((c) => (
          <li key={c.slug}>
            <CardCase item={c} />
          </li>
        ))}
      </ul>
    </Secao>
  )
}
