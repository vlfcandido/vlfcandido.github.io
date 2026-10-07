import type { Case } from '../conteudo'
import { caminhoPublico } from '../lib/assets'
import { FonteLink } from './FonteLink'

const ROTULO_TIPO: Record<Case['tipo'], string> = {
  publico: 'case público',
  proprio: 'projeto próprio',
}

/** Print do case ou, enquanto ele não existe, um espaço reservado neutro com o caminho esperado. */
function FiguraCase({ item }: { item: Case }) {
  const caminho = `prints/${item.slug}.png`
  if (item.temPrint) {
    return (
      <img
        src={caminhoPublico(import.meta.env.BASE_URL, caminho)}
        alt={item.alt}
        width={1280}
        height={800}
        loading="lazy"
        className="aspect-[16/10] w-full object-cover object-top"
      />
    )
  }
  return (
    <div
      role="img"
      aria-label={`Espaço reservado para o print: ${item.alt}`}
      className="flex aspect-[16/10] w-full flex-col items-center justify-center gap-1 bg-papel p-4 text-center"
    >
      <span className="font-mono text-xs text-suave">print em breve</span>
      <span className="font-mono text-xs break-all text-suave">public/{caminho}</span>
    </div>
  )
}

/** Card de um case: print, problema, o que foi feito, resultado com fonte e stack. */
export function CardCase({ item }: { item: Case }) {
  return (
    <article className="flex h-full flex-col border border-linha bg-superficie">
      <figure className="border-b border-linha">
        <FiguraCase item={item} />
      </figure>
      <div className="flex flex-1 flex-col p-5">
        <p className="font-mono text-xs tracking-wide text-destaque uppercase">{ROTULO_TIPO[item.tipo]}</p>
        <h3 className="mt-1 text-lg leading-snug font-semibold">{item.titulo}</h3>
        <dl className="mt-3 space-y-2 text-sm leading-relaxed">
          <div>
            <dt className="inline font-medium">Problema. </dt>
            <dd className="inline text-suave">{item.contexto}</dd>
          </div>
          <div>
            <dt className="inline font-medium">O que foi feito. </dt>
            <dd className="inline text-suave">{item.feito}</dd>
          </div>
          <div>
            <dt className="inline font-medium">Resultado. </dt>
            <dd className="inline">{item.metrica}</dd>
          </div>
        </dl>
        <p className="mt-3 font-mono text-xs text-suave">
          fonte: <FonteLink fonte={item.fonte} />
        </p>
        <ul aria-label="Stack" className="mt-auto flex flex-wrap gap-1.5 pt-4">
          {item.stack.map((s) => (
            <li key={s} className="border border-linha px-1.5 py-0.5 font-mono text-[11px] text-suave">
              {s}
            </li>
          ))}
        </ul>
      </div>
    </article>
  )
}
