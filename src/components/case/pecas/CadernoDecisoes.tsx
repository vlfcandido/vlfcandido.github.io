import { useId, useState } from 'react'
import { PrintAmpliavel } from '../PrintAmpliavel'
import type { PecaProps } from './tipos'

/** Uma decisão do caderno: o que decidi, por quê, e em qual das duas telas ela aparece. */
interface Decisao {
  decidi: string
  porque: string
  /** 0 = diagnóstico (print principal), 1 = plano do dia (print extra). */
  tela: 0 | 1
  ondeAparece: string
}

// Só decisões que o banco de provas sustenta (validação antes do aluno, revisão espaçada, ADK + Gemini,
// decisões registradas, testes, pagamento como interface). Nada de número de ADR inventado.
const DECISOES: Decisao[] = [
  {
    decidi: 'Nada que a IA gera chega ao aluno sem validação.',
    porque: 'Questão errada ensina errado. A geração passa por uma checagem antes de ir para a tela.',
    tela: 0,
    ondeAparece: 'No diagnóstico, cada questão diz por que foi escolhida.',
  },
  {
    decidi: 'O plano se refaz com o desempenho, e a revisão é espaçada.',
    porque: 'Lista fixa trata igual quem acerta e quem erra. A matéria volta quando está para ser esquecida.',
    tela: 1,
    ondeAparece: 'No plano do dia, cada bloco traz o porquê da escolha.',
  },
  {
    decidi: 'Agentes com Google ADK e Gemini, e não um prompt solto.',
    porque: 'Cada agente tem uma tarefa e uma saída com formato conhecido, que dá para testar.',
    tela: 0,
    ondeAparece: 'O diagnóstico é montado pelos agentes.',
  },
  {
    decidi: 'Toda decisão de arquitetura vira registro escrito.',
    porque: 'Daqui a seis meses, o porquê some da memória. No repositório, não.',
    tela: 1,
    ondeAparece: '53 registros até 07/10/2026, no repositório público.',
  },
  {
    decidi: 'Teste antes de avançar.',
    porque: 'Num produto com IA, o que não tem teste quebra calado. Hoje são 1.603 testes passando, com CI verde.',
    tela: 0,
    ondeAparece: 'Rodados em 07/10/2026.',
  },
  {
    decidi: 'Pagamento só como interface, até haver aluno.',
    porque: 'Cobrar exige suporte, nota e estorno. Isso entra quando houver quem pague; antes, seria código parado.',
    tela: 1,
    ondeAparece: 'Ainda sem usuário pagante.',
  },
]

/**
 * Peça do AprovaOS: um caderno de engenharia com as decisões do produto. Escolher uma decisão mostra
 * o porquê e troca a tela real ao lado para aquela em que a decisão aparece.
 */
export function CadernoDecisoes({ item }: PecaProps) {
  const [atual, setAtual] = useState(0)
  const idTela = useId()
  const telas = [item.print, item.printExtra]
  const d = DECISOES[atual]
  const print = telas[d.tela] ?? item.print
  return (
    <div className="caderno grid gap-8 lg:grid-cols-[1.05fr_1fr] lg:items-start">
      <ol className="caderno-folha rounded-lg border border-linha" aria-label="Decisões">
        {DECISOES.map((x, i) => {
          const aberta = i === atual
          return (
            <li key={x.decidi} className="caderno-linha">
              <button
                type="button"
                aria-pressed={aberta}
                aria-controls={idTela}
                onClick={() => setAtual(i)}
                className="caderno-botao grid w-full grid-cols-[2.6rem_1fr] text-left"
              >
                <span aria-hidden="true" className="caderno-num font-display italic">
                  {i + 1}
                </span>
                <span className="min-w-0 py-3 pr-4 pl-2">
                  <span className={`block font-display text-[1.12rem] leading-[1.45] ${aberta ? 'font-semibold' : ''}`}>{x.decidi}</span>
                  {aberta && (
                    <span className="caderno-porque mt-1 block text-[0.98rem] leading-relaxed text-grafite">
                      <span className="font-semibold text-tinta">Porque </span>
                      {x.porque.charAt(0).toLowerCase() + x.porque.slice(1)}
                    </span>
                  )}
                </span>
              </button>
            </li>
          )
        })}
      </ol>
      <div id={idTela} aria-live="polite" className="lg:sticky lg:top-24">
        {print && <PrintAmpliavel key={print.arquivo} print={print} legenda={d.ondeAparece} />}
      </div>
    </div>
  )
}
