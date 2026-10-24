import { useEffect, useRef, useState } from 'react'
import { poucoMovimento } from '../../../lib/transicao'
import type { PecaProps } from './tipos'

/** Um passo do método, na ordem em que acontece na loja. */
interface Passo {
  titulo: string
  texto: string
}

/** Os três passos do diagnóstico, sempre nesta ordem. */
const PASSOS: Passo[] = [
  {
    titulo: 'Acesso',
    texto: 'Acesso ao painel da loja e ao catálogo do ERP, com a autorização de quem responde pela operação.',
  },
  {
    titulo: 'Varredura',
    texto:
      'Leitura pública das duas lojas e conferência, produto a produto, do que está cadastrado, do que tem estoque e do que aparece na vitrine.',
  },
  {
    titulo: 'Laudo',
    texto: 'Cada achado medido, com a origem do número, vira um bloco de escopo. O que não tem achado não entra.',
  },
]

/** A cadeia por onde o produto passa, do fornecedor até a vitrine. */
const ELOS = ['fornecedor', 'Olist DS Lite', 'Tiny', 'Tray']

/** As duas perdas do trilho: onde o catálogo encalha, em faixa. */
const PERDAS = ['quase 2 mil nunca vinculados ao Tiny', 'mais de 1.500 vinculados e fora da Tray']

/** Um bloco do laudo e o achado que o justifica. */
interface BlocoLaudo {
  achado: 'cadeia' | 'medicao'
  titulo: string
  texto: string
}

/** O escopo que sai do laudo: o que entra, sem valor e sem prazo. */
const LAUDO: BlocoLaudo[] = [
  {
    achado: 'cadeia',
    titulo: 'Catálogo vinculado ao ERP',
    texto: 'Todo produto do fornecedor vinculado ao Olist DS Lite e ao Tiny, sem item órfão pelo caminho.',
  },
  {
    achado: 'cadeia',
    titulo: 'Estoque religado',
    texto: 'O que tem estoque aparece na vitrine; o que esgotou sai dela.',
  },
  {
    achado: 'medicao',
    titulo: 'Medição unificada',
    texto: 'Um só conjunto de eventos entre GTM e GA4: a compra é contada uma vez.',
  },
]

/**
 * Peça das lojas virtuais: a mesa de diagnóstico, com os três passos do método, dois achados medidos
 * (a cadeia do catálogo e a medição duplicada) e o laudo que vira escopo. Não é clicável: nenhum botão,
 * nenhum link. O movimento é só de CSS, ligado quando a peça entra na tela; sem `IntersectionObserver`
 * ou com menos movimento pedido no sistema, a peça já nasce montada.
 *
 * @param _props projeto e case do item (a peça não lê nenhum dos dois: o conteúdo é o do diagnóstico).
 */
export function MesaDiagnostico(_props: PecaProps) {
  const [visivel, setVisivel] = useState(false)
  const alvo = useRef<HTMLElement>(null)

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined' || poucoMovimento()) {
      setVisivel(true)
      return
    }
    const el = alvo.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entrada]) => {
        if (!entrada.isIntersecting) return
        setVisivel(true)
        obs.disconnect()
      },
      { threshold: 0.25 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <section
      ref={alvo}
      // Marca o elemento que o IntersectionObserver observa: sem o ref ligado, a animação nunca entra e o teste
      // de servidor não pegaria um ref solto.
      data-observado=""
      aria-label="Mesa de diagnóstico"
      className={`mesa ${visivel ? 'mesa-visivel' : ''}`}
    >
      <ol className="mesa-passos" aria-label="Os três passos do diagnóstico">
        {PASSOS.map((p, i) => (
          <li key={p.titulo} className="mesa-passo">
            <span aria-hidden="true" className="mesa-passo-num">
              {i + 1}
            </span>
            <p className="font-display text-[1.12rem] font-semibold">{p.titulo}</p>
            <p className="prosa mt-1 text-[1rem] leading-relaxed text-grafite">{p.texto}</p>
          </li>
        ))}
      </ol>

      <div className="mt-10 rounded-lg border border-linha bg-folha p-5 sm:p-6">
        <h3 className="font-display text-[1.2rem] font-semibold">Achados</h3>
        <ul className="mt-5 space-y-8">
          <li data-achado="cadeia" className="mesa-achado">
            <p className="font-semibold">A cadeia do catálogo trava em dois elos</p>
            <p className="prosa mt-1.5 text-[1rem] leading-relaxed">
              O produto sai do fornecedor, passa pelo Olist DS Lite, pelo Tiny e chega à Tray. Em cada troca, parte do
              catálogo fica pelo caminho.
            </p>
            <ol aria-label="A cadeia, do fornecedor à vitrine" className="mesa-elos mt-4">
              {ELOS.map((elo) => (
                <li key={elo} className="mesa-elo">
                  {elo}
                </li>
              ))}
            </ol>
            <p className="mt-4 text-[0.98rem] font-semibold tabular-nums">
              quase 17 mil no catálogo · pouco mais de 5 mil com estoque · cerca de 2 mil na vitrine
            </p>
            <div className="mesa-trilho mt-3" aria-hidden="true">
              <span className="mesa-ponto" />
              <span className="mesa-corte" />
              <span className="mesa-ponto" />
              <span className="mesa-corte" />
              <span className="mesa-ponto" />
            </div>
            <ul className="mt-3 space-y-1.5">
              {PERDAS.map((perda) => (
                <li key={perda} className="grid grid-cols-[0.9rem_1fr] items-baseline gap-2 text-[0.95rem] text-grafite">
                  <span aria-hidden="true" className="mesa-risco" />
                  {perda}
                </li>
              ))}
            </ul>
            <p className="prosa mt-4 text-[1rem] leading-relaxed">
              São instrumentos de alto ticket — cada produto escondido é uma venda de milhares de reais parada no
              depósito.
            </p>
            <span className="mesa-origem mt-3">catálogo do ERP × vitrine, 20/10</span>
          </li>

          <li data-achado="medicao" className="mesa-achado">
            <p className="font-semibold">Duas medições no mesmo site</p>
            <p className="prosa mt-1.5 text-[1rem] leading-relaxed">
              A loja de moda carrega dois sistemas de medição no mesmo site (GTM e GA4), com o risco de contar a mesma
              compra duas vezes.
            </p>
            <span className="mesa-origem mt-3">leitura pública da loja de moda, 22/10</span>
          </li>
        </ul>
      </div>

      <div className="mt-8 rounded-lg border border-dashed border-linha p-5 sm:p-6">
        <h3 className="font-display text-[1.2rem] font-semibold">O que o laudo põe no escopo</h3>
        <dl className="mt-4 space-y-4">
          {LAUDO.map((b) => (
            <div key={b.titulo} className="mesa-laudo-linha">
              <dt data-achado={b.achado} className="font-semibold">
                {b.titulo}
              </dt>
              <dd className="prosa mt-0.5 text-[1rem] leading-relaxed text-grafite">{b.texto}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
