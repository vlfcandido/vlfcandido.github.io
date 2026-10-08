import { passos, stack } from '../conteudo'
import { caminhoPublico } from '../lib/assets'
import { fotos } from '../visuais'

/** O jeito de trabalhar em quatro passos reais, na ordem em que acontecem, e a stack. */
export function ComoTrabalho() {
  const foto = fotos.quadro
  return (
    <section id="como-trabalho" aria-labelledby="como-titulo" className="scroll-mt-24 border-t border-linha py-16 sm:py-24">
      <div className="grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <h2 id="como-titulo" className="text-[2.2rem] leading-none font-bold tracking-tight sm:text-[3rem]">
            Como trabalho
          </h2>
          <figure className="mt-8">
            <img
              src={caminhoPublico(import.meta.env.BASE_URL, foto.arquivo)}
              alt={foto.alt}
              width={960}
              height={641}
              loading="lazy"
              className="aspect-[4/3] w-full rounded-md object-cover object-[60%_50%]"
            />
            <figcaption className="prosa mt-2 text-[0.95rem] text-grafite italic">
              O escopo cabe numa página antes de qualquer linha de código.
            </figcaption>
          </figure>
        </div>

        <ol className="relative space-y-10 lg:col-span-6 lg:col-start-7 lg:pt-20">
          {/* Trilho que liga os passos: a ordem aqui é real. */}
          <span aria-hidden="true" className="absolute top-2 bottom-2 left-[1.15rem] w-0.5 bg-linha lg:top-22" />
          {passos.map((p, i) => (
            <li key={p.titulo} className="relative grid grid-cols-[2.3rem_1fr] gap-5">
              <span className="relative grid size-[2.3rem] place-items-center rounded-full border-2 border-cobalto bg-nevoa text-[1.05rem] font-bold text-cobalto">
                {i + 1}
              </span>
              <div>
                <h3 className="text-[1.25rem] font-semibold">{p.titulo}</h3>
                <p className="prosa mt-1 text-[1.1rem] text-grafite">{p.descricao}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <div id="stack" className="mt-20 grid scroll-mt-24 gap-8 lg:grid-cols-12">
        <h2 className="text-[1.6rem] font-bold tracking-tight lg:col-span-3">Ferramentas do dia a dia</h2>
        <dl className="grid gap-x-10 gap-y-6 sm:grid-cols-2 lg:col-span-9">
          {stack.map((c) => (
            <div key={c.camada}>
              <dt className="font-semibold">{c.camada}</dt>
              <dd className="prosa mt-1 text-grafite">{c.itens.join(', ')}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
