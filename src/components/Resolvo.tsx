import { useEffect, type CSSProperties } from 'react'
import { oferta, ramosDemo, type Oferta } from '../conteudo'
import { Abas, idAba, idPainel } from './Abas'
import { IconeOferta } from './IconesOferta'

/**
 * Onde cada boia fica na carta do computador, em % da largura e da altura (a carta tem proporção
 * 40:17, a mesma do desenho). Ficam sobre a linha de sondagem tracejada, alternando águas rasas e fundas.
 */
const POSICOES: [number, number][] = [
  [11, 45],
  [28.5, 68],
  [45, 43],
  [62.5, 70],
  [77.5, 45],
  [91, 70],
]

/** "numa clínica", "num escritório": o ramo com o artigo certo. */
function noRamo(ramo: string): string | null {
  const r = ramosDemo.find((x) => x.id === ramo)
  if (!r) return null
  return `${ramo === 'escritorio' ? 'num' : 'numa'} ${r.rotulo.toLowerCase()}`
}

/**
 * O desenho da carta: terra no alto, três isóbatas com as cotas e a linha de sondagem que passa
 * pelas boias. Decorativo; só aparece no computador.
 */
function DesenhoCarta() {
  return (
    <svg viewBox="0 0 800 340" aria-hidden="true" focusable="false" className="carta-desenho absolute inset-0 h-full w-full" fill="none">
      <path
        d="M0 0H800V34C730 52 676 26 600 42C520 60 470 32 392 48C300 68 236 40 152 58C92 70 40 58 0 66Z"
        className="carta-terra"
        fill="var(--areia)"
        stroke="var(--fundo-suave)"
        strokeWidth="1.25"
      />
      <g stroke="var(--linha)" strokeWidth="1.5" strokeLinecap="round">
        <path d="M0 108C80 92 150 118 240 100C340 80 420 114 520 96C620 78 700 108 800 90" />
        <path d="M0 196C90 178 170 210 270 188C380 164 450 208 560 186C660 166 730 200 800 178" />
        <path d="M0 290C100 270 190 306 300 282C410 258 490 302 600 280C690 262 750 290 800 276" />
      </g>
      <g fill="var(--fundo-suave)" fontFamily="var(--font-display)" fontStyle="italic" fontSize="13">
        <text x="14" y="100">5</text>
        <text x="14" y="188">10</text>
        <text x="14" y="282">20</text>
      </g>
      <g fill="var(--fundo-suave)" fillOpacity="0.7" fontFamily="var(--font-display)" fontStyle="italic" fontSize="11">
        <text x="160" y="140">7</text>
        <text x="300" y="128">6</text>
        <text x="430" y="160">9</text>
        <text x="690" y="132">8</text>
        <text x="130" y="262">14</text>
        <text x="410" y="300">22</text>
        <text x="560" y="250">17</text>
        <text x="760" y="320">24</text>
      </g>
      <path
        d="M88 153C140 180 190 230 228 231C290 233 320 150 360 146C420 140 450 236 500 238C560 240 580 158 620 153C680 148 700 238 728 238"
        stroke="var(--mar)"
        strokeOpacity="0.55"
        strokeWidth="1.5"
        strokeDasharray="2 7"
        strokeLinecap="round"
      />
    </svg>
  )
}

/** Antes e depois de uma oferta: o exemplo concreto, escrito como ilustração. */
function AntesDepois({ o }: { o: Oferta }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="border-l-2 border-linha pl-3 sm:pl-4">
        <p className="text-[0.92rem] font-semibold text-grafite">Antes</p>
        <p className="prosa mt-1 text-[1rem] leading-snug text-grafite sm:text-[1.05rem]">{o.antes}</p>
      </div>
      <div className="border-l-2 border-pitanga pl-3 sm:pl-4">
        <p className="text-[0.92rem] font-semibold text-pitanga-texto">Depois</p>
        <p className="mt-1 text-[1.02rem] leading-snug font-semibold text-tinta sm:text-[1.1rem]">{o.depois}</p>
      </div>
    </div>
  )
}

interface Props {
  /** Ramo escolhido no "Qual é o seu negócio?", para marcar a oferta sugerida. */
  ramo: string
  /** Oferta sondada agora (a página guarda, porque ela também troca a cena da demonstração). */
  ativa: Oferta['id']
  aoSondar: (id: Oferta['id']) => void
}

/**
 * O que eu resolvo, como uma carta náutica: as seis ofertas são boias e sondar uma (tocar, clicar
 * ou chegar pelas setas) abre ao lado o que ela resolve, com um antes e depois. No computador as
 * boias ficam sobre o desenho da carta, com o painel ao lado; no celular, viram uma régua
 * deslizável com o painel embaixo. É o mesmo HTML; muda só a forma.
 */
export function Resolvo({ ramo, ativa, aoSondar }: Props) {
  const sugerida = oferta.find((o) => o.ramos.includes(ramo))?.id
  const onde = noRamo(ramo)

  // No celular a régua de boias rola de lado: a boia sondada fica sempre à vista, sem mexer na página.
  useEffect(() => {
    const boia = document.getElementById(idAba('oferta', ativa))
    const regua = boia?.parentElement
    if (!boia || !regua || regua.scrollWidth <= regua.clientWidth) return
    const suave = !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    regua.scrollTo({ left: boia.offsetLeft - (regua.clientWidth - boia.offsetWidth) / 2, behavior: suave ? 'smooth' : 'auto' })
  }, [ativa])

  return (
    <section id="o-que-eu-resolvo" aria-labelledby="resolvo-titulo" className="secao scroll-mt-24 border-t border-linha">
      <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-2">
        <h2 id="resolvo-titulo" className="titulo-secao">
          O que eu resolvo
        </h2>
        <p className="prosa max-w-[44ch] text-[1.02rem] text-grafite">Sonde uma boia para ver o antes e o depois.</p>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 lg:mt-8 lg:grid-cols-12 lg:items-center lg:gap-10">
        <div className="carta-ofertas min-w-0 lg:col-span-8">
          <DesenhoCarta />
          <Abas
            base="oferta"
            rotulo="Ofertas"
            ativa={ativa}
            aoTrocar={(id) => aoSondar(id as Oferta['id'])}
            abas={oferta.map((o, i) => ({
              id: o.id,
              estilo: { '--x': `${POSICOES[i]?.[0] ?? 50}%`, '--y': `${POSICOES[i]?.[1] ?? 50}%` } as CSSProperties,
              rotulo: (
                <>
                  <span aria-hidden="true" className="boia-marca" />
                  <span className="boia-rotulo">
                    {o.curto ?? o.titulo}
                    {o.id === sugerida && onde && <span className="sr-only">, sugerida para o seu ramo</span>}
                  </span>
                </>
              ),
            }))}
            className="boias rolagem-lateral"
            classeAba={(marcada) => `boia ${marcada ? 'is-ativa' : ''}`}
          />
        </div>

        {oferta.map((o) => (
          <div
            key={o.id}
            role="tabpanel"
            id={idPainel('oferta', o.id)}
            aria-labelledby={idAba('oferta', o.id)}
            hidden={o.id !== ativa}
            className="lg:col-span-4"
          >
            <div className="troca border-l-2 border-pitanga pl-5 lg:pl-6">
              <div className="flex items-start gap-3">
                <IconeOferta id={o.id} className="size-10 shrink-0 text-cobalto lg:size-11" />
                <h3 className="text-[1.2rem] leading-snug font-semibold text-balance lg:text-[1.3rem]">{o.titulo}</h3>
              </div>
              <p className="prosa mt-2 text-[1.02rem] text-grafite">{o.descricao}</p>
              <div className="mt-4">
                <AntesDepois o={o} />
              </div>
              <p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[0.9rem] text-grafite">
                {o.id === sugerida && onde && (
                  <span className="inline-flex items-center gap-2 font-semibold text-pitanga-texto">
                    <span aria-hidden="true" className="size-2 shrink-0 rounded-full bg-pitanga" />
                    Por onde eu começaria {onde}
                  </span>
                )}
                <span>Exemplo ilustrativo.</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
