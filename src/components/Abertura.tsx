import { numeros, oferta, perfil } from '../conteudo'
import { GITHUB, LINKEDIN, printsDosCasos } from '../visuais'
import { FonteLink } from './FonteLink'
import { LinkExterno } from './LinkExterno'
import { Print } from './Print'

const PILHA = [printsDosCasos['nexus-quant'][0], printsDosCasos['aprovaos'][0], printsDosCasos['nexus-clips'][0]]

/** Abertura: a chamada em tipo grande ao lado de três produtos reais empilhados. */
export function Abertura() {
  return (
    <section id="inicio" aria-labelledby="inicio-titulo" className="scroll-mt-24 pt-10 pb-16 sm:pt-16 lg:pb-24">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-7">
          <p className="text-[1.05rem] text-grafite">{perfil.titulo}</p>
          <h1
            id="inicio-titulo"
            className="mt-4 text-[2.15rem] leading-[1.06] font-[680] tracking-[-0.02em] text-balance sm:text-[3rem] xl:text-[3.6rem]"
          >
            {perfil.chamada}
          </h1>
          <p className="prosa mt-6 max-w-[62ch] text-[1.15rem] text-grafite">{perfil.resumo}</p>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
            <LinkExterno
              href={LINKEDIN}
              className="rounded-full bg-cobalto px-6 py-3.5 text-[1.05rem] font-semibold text-nevoa hover:bg-cobalto-forte"
            >
              Falar comigo no LinkedIn
            </LinkExterno>
            <LinkExterno href={GITHUB} className="font-medium underline decoration-linha decoration-2 underline-offset-4 hover:decoration-cobalto">
              Ver o código no GitHub
            </LinkExterno>
          </div>
          <p className="prosa mt-4 max-w-[52ch] text-grafite italic">{perfil.notaTrabalho}</p>
        </div>

        <div className="relative lg:col-span-5" aria-label="Três produtos que construí">
          <div className="relative mx-auto aspect-[10/9] max-w-[580px] lg:mt-4">
            <Print print={PILHA[2]} prioridade className="absolute! top-0 right-0 w-[74%]!" />
            <Print print={PILHA[1]} prioridade className="absolute! top-[22%] left-0 w-[74%]!" />
            <Print print={PILHA[0]} prioridade className="absolute! bottom-0 right-[3%] w-[84%]!" />
          </div>
        </div>
      </div>

      <div className="mt-16 grid gap-x-10 gap-y-8 border-t border-linha pt-10 md:grid-cols-2 lg:mt-24 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <h2 className="text-2xl font-bold tracking-tight">O que eu faço</h2>
          <dl className="mt-6 space-y-5">
            {oferta.map((o) => (
              <div key={o.titulo}>
                <dt className="text-[1.1rem] font-semibold">{o.titulo}</dt>
                <dd className="prosa mt-1 text-grafite">{o.descricao}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="lg:col-span-6 lg:col-start-7">
          <h2 className="text-2xl font-bold tracking-tight">Números que dá para conferir</h2>
          <ul className="mt-6 space-y-5">
            {numeros.map((n) => (
              <li key={n.valor} className="prosa text-[1.15rem]">
                <strong className="grifo font-titulo text-[1.5rem] font-bold whitespace-nowrap">{n.valor}</strong>{' '}
                {n.rotulo}.{' '}
                <span className="text-[0.95rem] text-grafite">
                  Fonte: <FonteLink fonte={n.fonte} />
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
