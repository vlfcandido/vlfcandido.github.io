import { passos, perfil } from '../conteudo'
import { Secao } from './Secao'

/** Os quatro passos do jeito de trabalhar, numerados. */
export function ComoTrabalho() {
  return (
    <Secao id="como-trabalho" numero="02" titulo="Como eu trabalho">
      <ol className="grid gap-px border border-linha bg-linha sm:grid-cols-2">
        {passos.map((p, i) => (
          <li key={p.titulo} className="bg-superficie p-5">
            <p className="font-mono text-xs text-destaque">passo {String(i + 1).padStart(2, '0')}</p>
            <h3 className="mt-1 font-semibold">{p.titulo}</h3>
            <p className="mt-1 text-sm leading-relaxed text-suave">{p.descricao}</p>
          </li>
        ))}
      </ol>
      <p className="mt-4 text-sm text-suave">{perfil.notaTrabalho}</p>
    </Secao>
  )
}
