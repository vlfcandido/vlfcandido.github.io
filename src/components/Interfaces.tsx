import { useId, useMemo, useState, type CSSProperties, type KeyboardEvent, type PointerEvent, type ReactNode } from 'react'
import {
  camadasFront,
  etapasPedido,
  horasEtapas,
  notasEtapas,
  pedidosExemplo,
  serieDePedidos,
  situacoes,
  type ItemFront,
  type SituacaoPedido,
} from '../interfaces'
import { HASH_PROJETOS } from '../lib/rota'
import { comTransicao } from '../lib/transicao'

/** Rótulo do selo de cada pedido (o chip usa o plural). */
const SITUACAO_SINGULAR: Record<SituacaoPedido, string> = { pago: 'Pago', aguardando: 'Aguardando', atrasado: 'Atrasado' }

const reais = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

/** Moldura comum das três peças vivas: título da peça e o que dá para fazer com ela. */
function Peca({ titulo, dica, children, className = '' }: { titulo: string; dica: string; children: ReactNode; className?: string }) {
  const id = useId()
  return (
    <figure aria-labelledby={id} className={`peca flex flex-col rounded-2xl border border-linha bg-folha p-5 sm:p-7 ${className}`}>
      <figcaption>
        <p id={id} className="text-[1.08rem] leading-snug font-semibold">
          {titulo}
        </p>
        <p className="mt-1 text-[0.95rem] text-grafite">{dica}</p>
      </figcaption>
      <div className="mt-5 flex flex-1 flex-col">{children}</div>
    </figure>
  )
}

/**
 * Gráfico de pedidos por dia. O gráfico inteiro é um controle deslizante: passar o dedo ou o
 * mouse, ou usar as setas do teclado, escolhe o dia, e o número em cima mostra o valor.
 */
function GraficoPedidos() {
  const [periodo, setPeriodo] = useState<7 | 30>(7)
  const serie = useMemo(() => serieDePedidos(periodo), [periodo])
  const [indice, setIndice] = useState(serie.length - 1)
  const i = Math.min(indice, serie.length - 1)
  const maximo = Math.max(...serie.map((d) => d.pedidos))
  const total = serie.reduce((s, d) => s + d.pedidos, 0)
  const atual = serie[i]

  function trocarPeriodo(p: 7 | 30) {
    if (p === periodo) return
    setPeriodo(p)
    setIndice(p - 1)
  }

  function peloPonteiro(e: PointerEvent<HTMLDivElement>) {
    const caixa = e.currentTarget.getBoundingClientRect()
    const x = Math.min(Math.max(e.clientX - caixa.left, 0), caixa.width - 1)
    setIndice(Math.floor((x / caixa.width) * serie.length))
  }

  function pelaTecla(e: KeyboardEvent<HTMLDivElement>) {
    const passos: Record<string, number> = { ArrowLeft: -1, ArrowDown: -1, ArrowRight: 1, ArrowUp: 1, PageDown: -7, PageUp: 7 }
    let novo = i
    if (e.key in passos) novo = i + passos[e.key]
    else if (e.key === 'Home') novo = 0
    else if (e.key === 'End') novo = serie.length - 1
    else return
    e.preventDefault()
    setIndice(Math.min(Math.max(novo, 0), serie.length - 1))
  }

  return (
    <Peca titulo="Pedidos por dia" dica="Passe o dedo ou o mouse nas barras, ou use as setas do teclado." className="lg:col-span-7">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <p aria-hidden="true" className="leading-none">
          <span className="block font-display text-[2.6rem] font-semibold tabular-nums sm:text-[3rem]">{atual.pedidos}</span>
          <span className="mt-2 block text-[0.95rem] text-grafite">
            pedidos {atual.quando}
          </span>
        </p>
        <div role="group" aria-label="Período do gráfico" className="inline-flex rounded-full border border-linha bg-nevoa p-1">
          {([7, 30] as const).map((p) => (
            <button
              key={p}
              type="button"
              aria-pressed={periodo === p}
              onClick={() => trocarPeriodo(p)}
              className={`chip rounded-full px-4 py-1.5 text-[0.92rem] font-medium ${periodo === p ? 'bg-cobalto text-nevoa' : 'text-tinta hover:text-cobalto'}`}
            >
              {p} dias
            </button>
          ))}
        </div>
      </div>

      <div
        role="slider"
        tabIndex={0}
        aria-label="Dia do gráfico de pedidos"
        aria-valuemin={1}
        aria-valuemax={serie.length}
        aria-valuenow={i + 1}
        aria-valuetext={`${atual.extenso}: ${atual.pedidos} pedidos`}
        onKeyDown={pelaTecla}
        onPointerDown={peloPonteiro}
        onPointerMove={peloPonteiro}
        className="grafico mt-6 flex h-44 cursor-crosshair touch-pan-y items-end gap-[3px] rounded-lg sm:h-52 sm:gap-1.5"
      >
        {serie.map((d, n) => (
          <div key={`${periodo}-${n}`} className="flex h-full flex-1 flex-col justify-end">
            <div
              data-ativo={n === i}
              className="barra w-full rounded-t-[3px]"
              style={{ '--altura': `${(d.pedidos / maximo) * 100}%` } as CSSProperties}
            />
          </div>
        ))}
      </div>
      <div aria-hidden="true" className="mt-2 flex gap-[3px] text-[0.8rem] text-grafite sm:gap-1.5">
        {serie.map((d, n) => (
          <span key={n} className={`flex-1 text-center tabular-nums ${n === i ? 'font-semibold text-tinta' : ''}`}>
            {periodo === 7 || n % 5 === 4 || n === i ? d.rotulo : ''}
          </span>
        ))}
      </div>
      <p className="mt-4 border-t border-linha pt-3 text-[0.95rem] text-grafite">
        {total} pedidos em {periodo} dias, média de {Math.round(total / periodo)} por dia. Dados de exemplo.
      </p>
    </Peca>
  )
}

/** Cartão de status de um pedido: o botão avança a etapa e a linha mostra onde ele está. */
function StatusPedido() {
  const [etapa, setEtapa] = useState(1)
  const ultima = etapa === etapasPedido.length - 1
  return (
    <Peca titulo="Pedido 1048, de Marina Costa" dica="Avance o pedido e veja a linha acompanhar." className="lg:col-span-5">
      <ol className="status-linha" aria-label="Etapas do pedido">
        {etapasPedido.map((nome, n) => {
          const estado = n < etapa ? 'feito' : n === etapa ? 'ativo' : 'depois'
          return (
            <li key={nome} data-estado={estado} aria-current={n === etapa ? 'step' : undefined} className="status-etapa">
              <span aria-hidden="true" className="status-ponto" />
              <span className="status-nome">{nome}</span>
              <span className="sr-only">{estado === 'feito' ? ', concluída' : estado === 'ativo' ? ', etapa atual' : ''}</span>
            </li>
          )
        })}
      </ol>
      <p className="mt-6 text-[0.92rem] font-semibold text-grafite">Histórico</p>
      <ol aria-live="polite" className="mt-2 flex flex-col-reverse">
        {etapasPedido.slice(0, etapa + 1).map((nome, n) => (
          <li key={nome} className={`grid grid-cols-[3.2rem_1fr] gap-3 border-t border-linha py-2 text-[0.95rem] ${n === etapa ? 'troca' : 'text-grafite'}`}>
            <span className="tabular-nums">{horasEtapas[n]}</span>
            <span>
              <span className={n === etapa ? 'font-semibold' : ''}>{nome}.</span> {notasEtapas[n]}
            </span>
          </li>
        ))}
      </ol>
      <div className="mt-auto pt-6">
        <button
          type="button"
          onClick={() => setEtapa(ultima ? 0 : etapa + 1)}
          className="botao-acao inline-flex items-center rounded-full bg-cobalto px-5 py-2.5 text-[0.98rem] font-semibold text-nevoa"
        >
          {ultima ? 'Recomeçar o pedido' : `Marcar como ${etapasPedido[etapa + 1].toLowerCase()}`}
        </button>
      </div>
    </Peca>
  )
}

/** Lista de pedidos com filtro: trocar o chip reorganiza a lista com uma transição curta. */
function FiltroPedidos() {
  const [filtro, setFiltro] = useState<SituacaoPedido | 'todos'>('todos')
  const lista = filtro === 'todos' ? pedidosExemplo : pedidosExemplo.filter((p) => p.situacao === filtro)
  const chips: { valor: SituacaoPedido | 'todos'; rotulo: string; total: number }[] = [
    { valor: 'todos', rotulo: 'Todos', total: pedidosExemplo.length },
    ...(Object.keys(situacoes) as SituacaoPedido[]).map((s) => ({
      valor: s,
      rotulo: situacoes[s],
      total: pedidosExemplo.filter((p) => p.situacao === s).length,
    })),
  ]
  return (
    <Peca titulo="Pedidos da semana" dica="Filtre pela situação; a lista se reorganiza." className="lg:col-span-7">
      <div role="group" aria-label="Filtrar pedidos" className="flex flex-wrap gap-2">
        {chips.map((c) => {
          const marcado = filtro === c.valor
          return (
            <button
              key={c.valor}
              type="button"
              aria-pressed={marcado}
              onClick={() => c.valor !== filtro && comTransicao(() => setFiltro(c.valor))}
              className={`chip inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-[0.92rem] font-medium ${
                marcado ? 'border-cobalto bg-cobalto text-nevoa' : 'border-linha bg-folha text-tinta hover:border-cobalto hover:text-cobalto'
              }`}
            >
              {c.rotulo} <span className={marcado ? 'opacity-80' : 'text-grafite'}>{c.total}</span>
            </button>
          )
        })}
      </div>
      <p aria-live="polite" className="sr-only">
        {lista.length} pedidos
      </p>
      <ul className="mt-5 divide-y divide-linha border-y border-linha">
        {lista.map((p) => (
          <li
            key={p.numero}
            style={{ viewTransitionName: `pedido-${p.numero}` } as CSSProperties}
            className="grid grid-cols-[3.4rem_1fr_auto] items-center gap-3 py-3 sm:grid-cols-[4rem_1fr_7rem_6.5rem]"
          >
            <span className="text-[0.92rem] text-grafite tabular-nums">{p.numero}</span>
            <span className="min-w-0 truncate font-medium">{p.cliente}</span>
            <span className="hidden text-right tabular-nums sm:block">{reais(p.valor)}</span>
            <span data-situacao={p.situacao} className="selo justify-self-end rounded-full px-2.5 py-1 text-[0.85rem] font-semibold">
              {SITUACAO_SINGULAR[p.situacao]}
            </span>
          </li>
        ))}
      </ul>
    </Peca>
  )
}

/**
 * A pilha de frontend em camadas, da superfície (a tela) ao fundo (a garantia), no desenho de
 * profundidade da Maré. Tocar num item mostra onde ele foi usado de verdade.
 */
function PilhaFront() {
  const [escolhido, setEscolhido] = useState<ItemFront>(camadasFront[0].itens[0])
  return (
    <Peca titulo="Com o que eu construo" dica="Toque num item para ver onde ele foi usado." className="lg:col-span-5">
      <ol className="pilha flex flex-col gap-1.5">
        {camadasFront.map((c, n) => (
          <li key={c.id} className="pilha-camada rounded-lg px-4 py-3" style={{ '--fundura': n } as CSSProperties}>
            <p className="text-[0.98rem] leading-snug font-semibold">{c.titulo}</p>
            <p className="text-[0.92rem] leading-snug text-grafite">{c.papel}</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {c.itens.map((it) => {
                const marcado = escolhido.nome === it.nome
                return (
                  <button
                    key={it.nome}
                    type="button"
                    aria-pressed={marcado}
                    aria-controls="pilha-onde"
                    onClick={() => setEscolhido(it)}
                    className={`chip rounded-full border px-3 py-1 text-[0.9rem] font-medium ${
                      marcado ? 'border-cobalto bg-cobalto text-nevoa' : 'border-linha bg-folha text-tinta hover:border-cobalto hover:text-cobalto'
                    }`}
                  >
                    {it.nome}
                  </button>
                )
              })}
            </div>
          </li>
        ))}
      </ol>
      <p id="pilha-onde" aria-live="polite" className="mt-4 border-l-2 border-pitanga pl-4 text-[1rem]">
        <span key={escolhido.nome} className="troca block">
          <span className="font-semibold">{escolhido.nome}:</span> {escolhido.onde}
        </span>
      </p>
    </Peca>
  )
}

/**
 * Interfaces que eu construo: quatro peças vivas, feitas neste site, para mostrar a experiência
 * em vez de descrevê-la. Os dados são de exemplo; a pilha cita só o que tem prova.
 */
export function Interfaces() {
  return (
    <section id="interfaces" aria-labelledby="interfaces-titulo" className="scroll-mt-24 border-t border-linha py-20 sm:py-28">
      <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-4">
        <div>
          <h2 id="interfaces-titulo" className="text-[2rem] leading-[1.12] font-bold tracking-[0.004em] sm:text-[2.6rem]">
            Interfaces que eu construo
          </h2>
          <p className="prosa mt-3 max-w-[56ch] text-[1.08rem] text-grafite">
            Painel bom é o que a equipe entende sem treinamento. As peças abaixo funcionam: mexa nelas. Foram feitas aqui em
            React; em cada projeto eu uso o que o seu sistema já tem, seja React, Next.js ou Vue.js.
          </p>
        </div>
        <a href={`${HASH_PROJETOS}/tipo/frontend`} className="sublinha text-[1.02rem] font-semibold text-cobalto">
          Ver os painéis que já fiz
        </a>
      </div>
      <div className="mt-10 grid gap-5 lg:grid-cols-12">
        <GraficoPedidos />
        <StatusPedido />
        <FiltroPedidos />
        <PilhaFront />
      </div>
    </section>
  )
}
