import type { PecaProps } from './tipos'

const MEDIDAS = [
  { nome: 'Latência', como: 'tempo da chamada inteira' },
  { nome: 'Primeiro token', como: 'quanto demora para a resposta começar a chegar' },
  { nome: 'Erros', como: 'chamadas que falham ou estouram o tempo' },
  { nome: 'Custo', como: 'o que cada caminho gasta pela mesma carga' },
]

/**
 * Peça do benchmark de gateway de IA: a ficha de laboratório do experimento, em papel quadriculado.
 * Pergunta, montagem e medidas preenchidas; a coluna de resultado fica em branco, com o carimbo de
 * "não publicado", porque o resultado não foi versionado.
 */
export function FichaLaboratorio(_: PecaProps) {
  return (
    <div className="laboratorio relative overflow-hidden rounded-lg border border-linha p-5 sm:p-8">
      <dl className="relative grid gap-6">
        <div>
          <dt className="text-[0.9rem] font-semibold text-grafite">Pergunta</dt>
          <dd className="mt-1 font-display text-[1.3rem] leading-snug sm:text-[1.5rem]">
            Chamar o modelo direto pelo SDK ou passar por um proxy no meio?
          </dd>
        </div>
        <div>
          <dt className="text-[0.9rem] font-semibold text-grafite">Montagem</dt>
          <dd className="mt-2 grid gap-3 sm:grid-cols-2">
            <p className="rounded-md border border-linha bg-folha p-3">
              <span className="font-semibold">Caminho A, LiteLLM SDK.</span> A aplicação chama o provedor direto, com a biblioteca.
            </p>
            <p className="rounded-md border border-linha bg-folha p-3">
              <span className="font-semibold">Caminho B, LiteLLM Proxy.</span> A aplicação fala com um serviço no meio, que chama o provedor.
            </p>
          </dd>
        </div>
        <div>
          <dt className="text-[0.9rem] font-semibold text-grafite">O que medir, nos dois caminhos</dt>
          <dd className="mt-2 overflow-x-auto">
            <table className="w-full min-w-[20rem] border-collapse text-left text-[0.95rem]">
              <thead>
                <tr className="border-b-2 border-tinta">
                  <th scope="col" className="py-2 pr-3 font-semibold">Medida</th>
                  <th scope="col" className="py-2 pr-3 font-semibold">A</th>
                  <th scope="col" className="py-2 font-semibold">B</th>
                </tr>
              </thead>
              <tbody>
                {MEDIDAS.map((m) => (
                  <tr key={m.nome} className="border-b border-linha">
                    <th scope="row" className="py-2.5 pr-3 align-top font-normal">
                      <span className="font-semibold">{m.nome}</span>
                      <span className="block text-[0.85rem] text-grafite">{m.como}</span>
                    </th>
                    <td className="laboratorio-vazio py-2.5 pr-3 align-top text-grafite">em branco</td>
                    <td className="laboratorio-vazio py-2.5 align-top text-grafite">em branco</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </dd>
        </div>
        <div>
          <dt className="text-[0.9rem] font-semibold text-grafite">Conclusão</dt>
          <dd className="mt-1 text-[1.02rem]">Só depois que os números forem publicados com data. Sem eles, não há o que concluir.</dd>
          <dd className="mt-5">
            <span className="carimbo">Resultado não publicado</span>
          </dd>
        </div>
      </dl>
    </div>
  )
}
