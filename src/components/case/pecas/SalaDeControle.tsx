import { useState } from 'react'
import type { PecaProps } from './tipos'

/** Estado de uma lâmpada do painel e de um cartão de risco. */
type Estado = 'ligado' | 'simulacao' | 'desligado'

const ROTULO_ESTADO: Record<Estado, string> = { ligado: 'Ligado', simulacao: 'Simulação', desligado: 'Desligado' }

/** Um risco tratado: o sintoma, o que eu fiz e como está hoje. */
interface Risco {
  titulo: string
  sintoma: string
  feito: string
  hoje: Estado
  hojeTexto: string
}

// Só o que o banco de provas sustenta: reconciliação com a corretora, idempotência, Prometheus/Grafana,
// painel Next.js, ML testado e descartado, market making desligado, só simulação. Nenhum valor em dinheiro.
const RISCOS: Risco[] = [
  {
    titulo: 'A ordem some no caminho',
    sintoma: 'A ordem sai, a resposta da corretora não volta, e o sistema já não sabe se ela existe.',
    feito: 'A corretora é a fonte da verdade. Um reconciliador compara o que ela diz com o banco, e quem corrige é o banco.',
    hoje: 'ligado',
    hojeTexto: 'Reconciliação ligada',
  },
  {
    titulo: 'Reinício no meio de um envio',
    sintoma: 'O serviço cai depois de mandar a ordem e antes de anotar. Ao voltar, manda de novo.',
    feito: 'Ordens idempotentes: cada uma sai com identificador próprio, e repetir o envio não cria uma segunda.',
    hoje: 'ligado',
    hojeTexto: 'Idempotência ligada',
  },
  {
    titulo: 'Falhar sem ninguém olhando',
    sintoma: 'Um sistema que roda 24 horas erra de madrugada, e o erro só aparece no dia seguinte.',
    feito: 'Métricas no Prometheus, painéis no Grafana e um painel próprio em Next.js com as ordens e os pares.',
    hoje: 'ligado',
    hojeTexto: 'Monitoramento ligado',
  },
  {
    titulo: 'Um modelo de ML para decidir',
    sintoma: 'A vontade de pôr aprendizado de máquina no meio porque parece mais sofisticado.',
    feito: 'Testei e descartei. A vitrine conta o que deu errado em vez de esconder.',
    hoje: 'desligado',
    hojeTexto: 'Descartado',
  },
  {
    titulo: 'Market making',
    sintoma: 'Uma estratégia que fica o tempo todo com ordens na mesa multiplica o que pode dar errado.',
    feito: 'Ficou desligada. Primeiro o sistema prova que não erra a conta; depois se fala em estratégia.',
    hoje: 'desligado',
    hojeTexto: 'Desligado',
  },
]

/** Lâmpada do painel: cor e palavra juntas, nunca só a cor. */
function Lampada({ nome, estado }: { nome: string; estado: Estado }) {
  return (
    <li className="flex items-center gap-2.5 rounded-md border border-linha px-3 py-2">
      <span aria-hidden="true" className={`lampada lampada-${estado}`} />
      <span className="text-[0.92rem] text-grafite">{nome}</span>
      <span className="ml-auto text-[0.92rem] font-semibold">{ROTULO_ESTADO[estado]}</span>
    </li>
  )
}

/**
 * Peça do sistema de ordens: uma sala de controle sempre escura, com as lâmpadas do estado atual e um
 * cartão de incidente para cada risco, no formato sintoma, o que fiz e como está hoje.
 */
export function SalaDeControle(_: PecaProps) {
  // No celular a sala mostra um risco por vez, escolhido nos botões; no computador, todos em grade.
  // Antes (até 08/10/2026) os cinco cartões empilhavam no celular e a peça passava de 2.500 px de altura.
  const [ativo, setAtivo] = useState(0)
  return (
    <div className="zona-escura sala rounded-xl border border-linha bg-nevoa p-4 text-tinta sm:p-6">
      <ul className="grid gap-2 sm:grid-cols-3" aria-label="Estado agora">
        <Lampada nome="Modo" estado="simulacao" />
        <Lampada nome="Reconciliação" estado="ligado" />
        <Lampada nome="Market making" estado="desligado" />
      </ul>
      <div className="mt-5 md:hidden">
        <p className="text-[0.85rem] font-semibold text-grafite">Escolha um risco</p>
        <div className="mt-2 flex flex-wrap gap-2" role="group" aria-label="Riscos">
          {RISCOS.map((r, i) => (
            <button
              key={r.titulo}
              type="button"
              onClick={() => setAtivo(i)}
              aria-pressed={ativo === i}
              aria-label={`Risco ${i + 1}: ${r.titulo}`}
              className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-[0.9rem] font-semibold ${ativo === i ? 'border-mar bg-raso text-tinta' : 'border-linha text-grafite'}`}
            >
              <span aria-hidden="true" className={`lampada lampada-${r.hoje}`} />
              {i + 1}
            </button>
          ))}
        </div>
      </div>
      <ol className="mt-4 grid gap-4 md:mt-5 md:grid-cols-2">
        {RISCOS.map((r, i) => (
          <li
            key={r.titulo}
            className={`incidente rounded-lg border border-linha bg-folha p-4 sm:p-5 ${i === 0 ? 'md:col-span-2' : ''} ${i === ativo ? '' : 'max-md:hidden'}`}
          >
            <div className="flex items-baseline justify-between gap-3">
              <h3 className="text-[1.15rem] leading-snug font-semibold">{r.titulo}</h3>
              <span className="shrink-0 text-[0.85rem] text-grafite">Risco {i + 1} de {RISCOS.length}</span>
            </div>
            <dl className={`mt-3 grid gap-3 text-[0.98rem] leading-relaxed ${i === 0 ? 'md:grid-cols-[1fr_1fr_auto]' : ''}`}>
              <div>
                <dt className="text-[0.85rem] font-semibold text-grafite">Sintoma</dt>
                <dd>{r.sintoma}</dd>
              </div>
              <div>
                <dt className="text-[0.85rem] font-semibold text-grafite">O que fiz</dt>
                <dd>{r.feito}</dd>
              </div>
              <div>
                <dt className="text-[0.85rem] font-semibold text-grafite">Hoje</dt>
                <dd className="mt-0.5 flex items-center gap-2 font-semibold">
                  <span aria-hidden="true" className={`lampada lampada-${r.hoje}`} />
                  {r.hojeTexto}
                </dd>
              </div>
            </dl>
          </li>
        ))}
      </ol>
    </div>
  )
}
