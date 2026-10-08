import { useState } from 'react'
import type { PecaProps } from './tipos'

type Foco = 'fidelidade' | 'relevancia' | 'juiz' | 'ab'

/** Linha do diff: número, sinal (+, − ou contexto) e código. */
const DIFF: { n: number; s: ' ' | '+' | '-'; c: string }[] = [
  { n: 12, s: ' ', c: 'def total_do_pedido(itens):' },
  { n: 13, s: '-', c: '    total = 0' },
  { n: 14, s: '-', c: '    for i in itens: total += i.preco * i.qtd' },
  { n: 15, s: '+', c: '    total = sum(i.preco * i.qtd - i.desconto for i in itens)' },
  { n: 16, s: '+', c: '    if total < 0:' },
  { n: 17, s: '+', c: '        raise ValueError("total negativo")' },
  { n: 18, s: ' ', c: '    return total' },
]

const CHECAGENS: { id: Foco; nome: string; ferramenta: string; pergunta: string }[] = [
  { id: 'fidelidade', nome: 'Fidelidade', ferramenta: 'Ragas', pergunta: 'O comentário se apoia no trecho que a busca trouxe, ou inventou a regra?' },
  { id: 'relevancia', nome: 'Relevância', ferramenta: 'Ragas', pergunta: 'Fala do que estas linhas mudam, ou de outra coisa?' },
  { id: 'juiz', nome: 'LLM como juiz', ferramenta: 'DeepEval', pergunta: 'Um segundo modelo dá nota ao comentário com critério escrito.' },
  { id: 'ab', nome: 'Comparação de prompts', ferramenta: 'A/B', pergunta: 'Duas versões do prompt, na mesma base, para ver qual comenta melhor.' },
]

/**
 * Peça do revisor de código: um trecho de pull request com o comentário da IA preso à linha e, embaixo,
 * o boletim que mede esse comentário. Escolher uma checagem acende a parte do comentário que ela confere.
 */
export function DiffComNota(_: PecaProps) {
  const [foco, setFoco] = useState<Foco>('fidelidade')
  return (
    <div className="diff grid gap-6 lg:grid-cols-[1.25fr_1fr]">
      <div className="overflow-hidden rounded-lg border border-linha bg-folha">
        <p className="border-b border-linha bg-nevoa px-4 py-2 text-[0.88rem] text-grafite">pedidos/servico.py</p>
        <pre className="diff-codigo py-2 text-[0.8rem] leading-[1.75] sm:text-[0.86rem]">
          {DIFF.map((l) => (
            <span key={l.n} className={`diff-linha diff-${l.s === '+' ? 'mais' : l.s === '-' ? 'menos' : 'ctx'} ${foco === 'relevancia' && l.s === '+' ? 'diff-acesa' : ''}`}>
              <span className="diff-num" aria-hidden="true">
                {l.n}
              </span>
              <span className="diff-sinal">{l.s === ' ' ? ' ' : l.s === '-' ? '−' : '+'}</span>
              {l.c}
            </span>
          ))}
        </pre>
        <div className="mx-3 mb-3 rounded-md border border-linha bg-papel p-3.5 sm:ml-12">
          <p className="text-[0.85rem] font-semibold text-cobalto">Revisor com IA, na linha 16</p>
          <p className={`mt-1.5 text-[0.98rem] leading-relaxed ${foco === 'juiz' || foco === 'ab' ? 'diff-acesa-texto' : ''}`}>
            Item com desconto maior que o preço deixa o total negativo, e o pedido quebra aqui.{' '}
            <span className={foco === 'fidelidade' ? 'diff-acesa-texto' : ''}>A regra de descontos diz que o desconto não passa do preço do item.</span>{' '}
            Sugiro limitar no item, e não levantar erro no total.
          </p>
          <p className={`mt-2 inline-block rounded bg-raso px-2 py-0.5 text-[0.82rem] ${foco === 'fidelidade' ? 'ring-2 ring-pitanga' : ''}`}>
            trecho recuperado: regras/descontos.md
          </p>
        </div>
      </div>

      <div>
        <h3 className="font-display text-[1.25rem] font-semibold">Boletim do comentário</h3>
        <p className="mt-1 text-[0.92rem] text-grafite">Escolha uma checagem para ver o que ela olha.</p>
        <ul className="mt-4 divide-y divide-linha border-y border-linha">
          {CHECAGENS.map((c) => (
            <li key={c.id}>
              <button
                type="button"
                aria-pressed={foco === c.id}
                onClick={() => setFoco(c.id)}
                className={`grid w-full grid-cols-[1fr_auto] gap-x-3 gap-y-1 py-3 text-left ${foco === c.id ? '' : 'text-grafite'}`}
              >
                <span className={`font-semibold ${foco === c.id ? 'text-tinta' : ''}`}>{c.nome}</span>
                <span className="rounded-full border border-linha px-2 py-0.5 text-[0.8rem]">{c.ferramenta}</span>
                <span className="col-span-2 text-[0.95rem] leading-snug">{c.pergunta}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
