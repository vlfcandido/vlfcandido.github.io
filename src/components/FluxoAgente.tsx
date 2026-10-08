import { useEffect, useRef, useState } from 'react'
import { caminhosFluxo, type CaminhoFluxo, type NoFluxo } from '../conteudo'

/** Os quatro pontos do fluxo: nome e o que acontece ali. */
const NOS: Record<NoFluxo, { titulo: string; sub: string }> = {
  whatsapp: { titulo: 'WhatsApp', sub: 'o cliente escreve' },
  agente: { titulo: 'Agente', sub: 'entende e decide' },
  sistemas: { titulo: 'Agenda, ERP e CRM', sub: 'consulta e grava' },
  equipe: { titulo: 'Pessoa da equipe', sub: 'assume quando o robô não resolve' },
}

const AUTOR = { cliente: 'Cliente', robo: 'Agente', equipe: 'Equipe' } as const

/** `true` quando a pessoa pediu menos movimento no sistema. */
function poucoMovimento(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * "Como eu ligo um agente ao que a sua empresa já usa", interativo. Uma conversa de exemplo passa
 * pelo fluxo etapa a etapa: o botão toca a conversa e cada ponto do desenho é clicável. Há dois
 * caminhos, o que o agente resolve e o que vai para alguém da equipe. Com movimento reduzido nada
 * avança sozinho: a pessoa segue com "Próxima etapa".
 */
export function FluxoAgente() {
  const [caminho, setCaminho] = useState<CaminhoFluxo['id']>('resolve')
  const [etapa, setEtapa] = useState(0)
  const [tocando, setTocando] = useState(false)
  const timer = useRef<number | undefined>(undefined)
  const atual = caminhosFluxo.find((c) => c.id === caminho) ?? caminhosFluxo[0]
  const passo = atual.etapas[etapa]
  const ultima = etapa === atual.etapas.length - 1

  // Tocando, avança uma etapa por vez até o fim.
  useEffect(() => {
    if (!tocando) return
    if (ultima) {
      setTocando(false)
      return
    }
    timer.current = window.setTimeout(() => setEtapa((e) => e + 1), 1700)
    return () => window.clearTimeout(timer.current)
  }, [tocando, etapa, ultima])

  /** Começa a conversa do começo; com movimento reduzido, só volta à primeira etapa. */
  function tocar() {
    setEtapa(0)
    setTocando(!poucoMovimento())
  }

  /** Clique num ponto: vai à etapa dele, trocando de caminho se o ponto só existe no outro. */
  function irPara(no: NoFluxo) {
    setTocando(false)
    let alvo = atual
    if (!alvo.etapas.some((e) => e.no === no)) alvo = caminhosFluxo.find((c) => c.etapas.some((e) => e.no === no)) ?? atual
    setCaminho(alvo.id)
    setEtapa(alvo.etapas.findIndex((e) => e.no === no))
  }

  function escolherCaminho(id: CaminhoFluxo['id']) {
    setTocando(false)
    setCaminho(id)
    setEtapa(0)
  }

  // Traços já percorridos: até o agente, e dele para o lado do caminho escolhido.
  const percorrido = {
    entrada: etapa >= 1,
    sistemas: caminho === 'resolve' && etapa >= 2,
    equipe: caminho === 'equipe' && etapa >= 2,
  }
  const volta = ultima

  const mensagens = atual.etapas.slice(0, etapa + 1).flatMap((e) => (e.mensagem ? [e.mensagem] : []))

  return (
    <figure aria-labelledby="fluxo-titulo" className="mt-20 border-t border-linha pt-10 lg:grid lg:grid-cols-[17rem_1fr] lg:gap-12">
      <figcaption>
        <h3 id="fluxo-titulo" className="text-[1.45rem] leading-[1.25] font-semibold">
          Como eu ligo um agente ao que a sua empresa já usa
        </h3>
        <p className="prosa mt-3 text-[1.03rem] text-grafite">
          WhatsApp, agenda, ERP e CRM conversando, com uma pessoa da equipe por perto quando o robô não resolve.
        </p>
        <div role="group" aria-label="Caminho da conversa" className="mt-6 flex flex-wrap gap-2">
          {caminhosFluxo.map((c) => (
            <button
              key={c.id}
              type="button"
              aria-pressed={c.id === caminho}
              onClick={() => escolherCaminho(c.id)}
              className={`chip rounded-full border px-4 py-2 text-[0.95rem] font-medium ${
                c.id === caminho ? 'border-cobalto bg-cobalto text-nevoa' : 'border-linha bg-folha text-tinta hover:border-cobalto hover:text-cobalto'
              }`}
            >
              {c.rotulo}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={tocar}
          className="botao-acao mt-4 inline-flex items-center gap-2 rounded-full bg-cobalto px-5 py-3 font-semibold text-nevoa hover:bg-cobalto-forte"
        >
          <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
            <path d="M4 2.5v11l9-5.5z" fill="currentColor" />
          </svg>
          Ver uma conversa passar
        </button>
      </figcaption>

      <div className="mt-8 min-w-0 lg:mt-0">
        <div className="fluxo" data-caminho={caminho}>
          {(Object.keys(NOS) as NoFluxo[]).map((no) => {
            const aqui = passo.no === no
            const fora = (no === 'sistemas' && caminho === 'equipe') || (no === 'equipe' && caminho === 'resolve')
            return (
              <button
                key={no}
                type="button"
                aria-pressed={aqui}
                onClick={() => irPara(no)}
                data-no={no}
                data-aqui={aqui}
                data-fora={fora}
                className="fluxo-no rounded-xl border px-4 py-3 text-left"
              >
                <span className="block font-semibold">{NOS[no].titulo}</span>
                <span className="mt-0.5 block text-[0.92rem] leading-snug text-grafite">{NOS[no].sub}</span>
                {no === 'sistemas' && (
                  <span aria-hidden="true" className="mt-2 flex gap-1.5">
                    {['agenda', 'ERP', 'CRM'].map((s) => (
                      <span key={s} className="rounded border border-linha px-1.5 text-[0.78rem] text-grafite">
                        {s}
                      </span>
                    ))}
                  </span>
                )}
                {no === 'whatsapp' && volta && (
                  <span className="mt-2 block text-[0.85rem] font-semibold text-pitanga-texto">a resposta volta aqui</span>
                )}
              </button>
            )
          })}
          <span aria-hidden="true" className="fluxo-traco" data-t="entrada" data-feito={percorrido.entrada} />
          <span aria-hidden="true" className="fluxo-traco" data-t="sistemas" data-feito={percorrido.sistemas} />
          <span aria-hidden="true" className="fluxo-traco" data-t="equipe" data-feito={percorrido.equipe} />
        </div>

        <div aria-live="polite" className="mt-6 grid gap-5 rounded-2xl border border-linha bg-folha p-5 sm:grid-cols-[1fr_1fr] sm:p-6">
          <div>
            <p className="text-[0.92rem] font-semibold text-grafite">
              Etapa {etapa + 1} de {atual.etapas.length}: {NOS[passo.no].titulo}
            </p>
            <p key={`${caminho}-${etapa}`} className="troca prosa mt-2 text-[1.1rem] leading-[1.45]">
              {passo.texto}
            </p>
            <button
              type="button"
              onClick={() => {
                setTocando(false)
                setEtapa(ultima ? 0 : etapa + 1)
              }}
              className="sublinha mt-4 font-medium text-cobalto"
            >
              {ultima ? 'Recomeçar' : 'Próxima etapa'}
            </button>
          </div>
          <ul aria-label="Conversa de exemplo" className="space-y-2 border-t border-linha pt-4 sm:border-t-0 sm:border-l sm:pt-0 sm:pl-5">
            {mensagens.map((m) => (
              <li key={m.texto} className={`balao flex ${m.de === 'cliente' ? 'justify-start' : 'justify-end'}`}>
                <p
                  className={`max-w-[90%] rounded-2xl px-3.5 py-2 text-[0.96rem] leading-snug ${
                    m.de === 'cliente' ? 'rounded-bl-sm bg-nevoa text-tinta' : m.de === 'equipe' ? 'rounded-br-sm bg-mata text-nevoa' : 'rounded-br-sm bg-cobalto text-nevoa'
                  }`}
                >
                  <span className="sr-only">{AUTOR[m.de]}: </span>
                  {m.texto}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </figure>
  )
}
