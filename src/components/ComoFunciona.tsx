import { passos } from '../conteudo'

/** Como funciona: os quatro passos, na ordem em que acontecem. */
export function ComoFunciona() {
  return (
    <section id="como-funciona" aria-labelledby="como-titulo" className="scroll-mt-24 border-t border-linha py-16 sm:py-20">
      <h2 id="como-titulo" className="text-[2rem] leading-none font-bold tracking-tight sm:text-[2.6rem]">
        Como funciona
      </h2>
      <ol className="mt-10 grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
        {passos.map((p, i) => (
          <li key={p.titulo} className="grid grid-cols-[2.6rem_1fr] gap-4 lg:block">
            <span className="grid size-[2.6rem] place-items-center rounded-full bg-cobalto text-[1.1rem] font-bold text-nevoa">
              {i + 1}
            </span>
            <div className="lg:mt-5">
              <h3 className="text-[1.2rem] leading-snug font-semibold">{p.titulo}</h3>
              <p className="prosa mt-1.5 text-[1.05rem] text-grafite">{p.descricao}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}
