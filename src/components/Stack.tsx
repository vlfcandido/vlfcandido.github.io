import { stack } from '../conteudo'
import { Secao } from './Secao'

/** Tabela de tecnologias por camada. */
export function Stack() {
  return (
    <Secao id="stack" numero="03" titulo="Stack">
      <table className="w-full border-collapse text-sm">
        <caption className="sr-only">Tecnologias por camada</caption>
        <tbody>
          {stack.map((c) => (
            <tr key={c.camada} className="border-b border-linha align-top first:border-t">
              <th scope="row" className="w-32 py-3 pr-4 text-left font-medium sm:w-44">
                {c.camada}
              </th>
              <td className="py-3 font-mono text-[13px] leading-relaxed text-suave">{c.itens.join(' · ')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Secao>
  )
}
