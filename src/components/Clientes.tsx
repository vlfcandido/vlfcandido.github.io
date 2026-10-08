import { gruposClientes, segmentos, type Cliente, type GrupoClientes, type Segmento } from '../clientes'
import { LinkExterno } from './LinkExterno'
import { Logo } from './Logo'

/** Separa os clientes de um grupo por segmento, na ordem definida em `segmentos`. */
function porSegmento(clientes: Cliente[]): [Segmento, Cliente[]][] {
  const ordem = Object.keys(segmentos) as Segmento[]
  return ordem
    .map((s) => [s, clientes.filter((c) => c.segmento === s)] as [Segmento, Cliente[]])
    .filter(([, lista]) => lista.length > 0)
}

/** Um grupo (Vertigo ou Wiv): legenda do vínculo, fonte e as logos por segmento. */
function Grupo({ grupo }: { grupo: GrupoClientes }) {
  return (
    <div className="py-12">
      <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2">
        <h3 className="text-[1.6rem] font-bold tracking-tight sm:text-[1.9rem]">{grupo.legenda}</h3>
        <p className="text-[0.95rem] text-grafite">
          {grupo.clientes.length} empresas. Fonte:{' '}
          <LinkExterno href={grupo.fonte.url} className="underline decoration-linha underline-offset-2 hover:text-tinta">
            {grupo.fonte.texto}
          </LinkExterno>
        </p>
      </div>
      <dl className="mt-8 space-y-8">
        {porSegmento(grupo.clientes).map(([seg, lista]) => (
          <div key={seg} className="grid gap-4 md:grid-cols-[200px_1fr] md:gap-8">
            <dt className="pt-2 text-[1rem] font-semibold text-grafite">{segmentos[seg]}</dt>
            <dd>
              <ul className="grid grid-cols-3 items-center gap-x-6 gap-y-6 sm:grid-cols-4 lg:grid-cols-6">
                {lista.map((c) => (
                  <li key={c.slug} className="flex h-12 items-center" title={c.nome}>
                    <Logo cliente={c} className="max-h-9 max-w-[88%]" />
                  </li>
                ))}
              </ul>
            </dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

/** Clientes dos projetos que liderei na Vertigo e na Wiv, agrupados por segmento. */
export function Clientes() {
  return (
    <section id="clientes" aria-labelledby="clientes-titulo" className="scroll-mt-24 border-t border-linha pt-16">
      <div className="grid gap-4 lg:grid-cols-12">
        <h2 id="clientes-titulo" className="text-[2.2rem] leading-none font-bold tracking-tight sm:text-[3rem] lg:col-span-6">
          Para quem já entreguei
        </h2>
        <p className="prosa max-w-[52ch] text-[1.15rem] text-grafite lg:col-span-5 lg:col-start-8">
          Órgãos públicos, bancos, indústria e varejo. Chatbots e análise de conversas, do setor público a empresas
          listadas na bolsa.
        </p>
      </div>
      <div className="divide-y divide-linha">
        {gruposClientes.map((g) => (
          <Grupo key={g.empresa} grupo={g} />
        ))}
      </div>
    </section>
  )
}
