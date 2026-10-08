import { useState, type KeyboardEvent } from 'react'
import type { PecaProps } from './tipos'

/** Um passo do robô na árvore: quantos chegam e quantos desistem ali (em % de quem começou). */
interface No {
  id: string
  nome: string
  chegam: number
  desistem: number
  pai?: string
  /** Posição no desenho largo (canto superior esquerdo da caixa). */
  x: number
  y: number
  nivel: number
}

// Árvore e percentuais ilustrativos (rotulados na página). O mecanismo é o que o Waizer mostra:
// por onde a conversa passa e onde as pessoas desistem.
const NOS: No[] = [
  { id: 'inicio', nome: 'Início', chegam: 100, desistem: 8, x: 10, y: 150, nivel: 0 },
  { id: 'menu', nome: 'Menu principal', chegam: 92, desistem: 0, pai: 'inicio', x: 175, y: 150, nivel: 1 },
  { id: 'boleto', nome: '2ª via de boleto', chegam: 40, desistem: 3, pai: 'menu', x: 345, y: 40, nivel: 2 },
  { id: 'pedido', nome: 'Status do pedido', chegam: 30, desistem: 0, pai: 'menu', x: 345, y: 150, nivel: 2 },
  { id: 'outro', nome: 'Outro assunto', chegam: 22, desistem: 0, pai: 'menu', x: 345, y: 260, nivel: 2 },
  { id: 'resolvido-1', nome: 'Resolvido', chegam: 37, desistem: 0, pai: 'boleto', x: 525, y: 40, nivel: 3 },
  { id: 'cpf', nome: 'Pede o CPF', chegam: 30, desistem: 18, pai: 'pedido', x: 525, y: 150, nivel: 3 },
  { id: 'nao-entendi', nome: '“Não entendi”', chegam: 22, desistem: 13, pai: 'outro', x: 525, y: 260, nivel: 3 },
  { id: 'resolvido-2', nome: 'Resolvido', chegam: 12, desistem: 0, pai: 'cpf', x: 695, y: 150, nivel: 4 },
  { id: 'atendente', nome: 'Atendente', chegam: 9, desistem: 0, pai: 'nao-entendi', x: 695, y: 260, nivel: 4 },
]

const L = 130
const A = 42
const GARGALO = 10

const LEITURA: Record<string, string> = {
  cpf: 'O gargalo: 30% chegam e 18% desistem quando o robô pede o CPF. Trocar a pergunta por uma consulta pelo número do telefone resolveria a maior perda da árvore.',
  'nao-entendi': 'Quem cai no “não entendi” desiste em mais da metade das vezes. É o lugar de ensinar o robô os assuntos novos.',
  inicio: '8% saem antes de escolher qualquer coisa: costuma ser a mensagem de boas-vindas longa demais.',
}

/** A árvore em profundidade (pai, depois os filhos), para a lista do celular ler na ordem certa. */
function emProfundidade(pai?: string): No[] {
  return NOS.filter((n) => n.pai === pai).flatMap((n) => [n, ...emProfundidade(n.id)])
}

/** Texto da leitura de um passo. */
function leitura(n: No): string {
  return LEITURA[n.id] ?? `${n.chegam}% das conversas passam por aqui${n.desistem ? `, e ${n.desistem}% desistem neste passo` : ''}.`
}

/**
 * Peça da Wiv: a árvore de uma conversa de robô, com a espessura do galho pelo volume e o coral onde as
 * pessoas desistem. No computador é o desenho; no celular, a mesma árvore em lista recuada.
 */
export function ArvoreConversa(_: PecaProps) {
  const [sel, setSel] = useState('cpf')
  const no = NOS.find((n) => n.id === sel)!
  const porId = Object.fromEntries(NOS.map((n) => [n.id, n]))

  const teclado = (id: string) => (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      setSel(id)
    }
  }

  return (
    <div className="arvore">
      <svg viewBox="0 0 835 350" className="hidden w-full lg:block" role="group" aria-label="Árvore da conversa">
        {NOS.filter((n) => n.pai).map((n) => {
          const p = porId[n.pai!]
          const x1 = p.x + L
          const y1 = p.y + A / 2
          const x2 = n.x
          const y2 = n.y + A / 2
          const meio = (x1 + x2) / 2
          return (
            <path
              key={`a-${n.id}`}
              d={`M${x1} ${y1} C${meio} ${y1} ${meio} ${y2} ${x2} ${y2}`}
              fill="none"
              stroke="var(--mar)"
              strokeOpacity="0.35"
              strokeWidth={Math.max(2, n.chegam * 0.32)}
            />
          )
        })}
        {NOS.filter((n) => n.desistem > 0).map((n) => (
          <g key={`d-${n.id}`}>
            <path
              d={`M${n.x + L / 2} ${n.y + A} v26`}
              stroke="var(--coral)"
              strokeWidth={Math.max(2, n.desistem * 0.32)}
              strokeLinecap="round"
            />
            <text x={n.x + L / 2 + 12} y={n.y + A + 24} fontSize="13" fill="var(--coral-texto)" fontWeight="600">
              −{n.desistem}% desistem
            </text>
          </g>
        ))}
        {NOS.map((n) => {
          const gargalo = n.desistem >= GARGALO
          const ativo = n.id === sel
          return (
            <g
              key={n.id}
              role="button"
              tabIndex={0}
              aria-pressed={ativo}
              aria-label={`${n.nome}: ${n.chegam}% chegam${n.desistem ? `, ${n.desistem}% desistem` : ''}`}
              onClick={() => setSel(n.id)}
              onKeyDown={teclado(n.id)}
              className="arvore-no cursor-pointer"
            >
              <rect
                x={n.x}
                y={n.y}
                width={L}
                height={A}
                rx="8"
                fill={ativo ? 'var(--raso)' : 'var(--papel-alto)'}
                stroke={gargalo ? 'var(--coral)' : ativo ? 'var(--mar)' : 'var(--linha)'}
                strokeWidth={gargalo || ativo ? 2 : 1}
              />
              <text x={n.x + 10} y={n.y + 18} fontSize="13" fontWeight="600" fill="var(--fundo)">
                {n.nome}
              </text>
              <text x={n.x + 10} y={n.y + 34} fontSize="12" fill="var(--fundo-suave)">
                {n.chegam}% chegam
              </text>
            </g>
          )
        })}
      </svg>

      <ul className="space-y-1 lg:hidden" aria-label="Árvore da conversa">
        {emProfundidade().map((n) => (
          <li key={n.id} style={{ paddingLeft: `${n.nivel * 0.9}rem` }}>
            <button
              type="button"
              aria-pressed={n.id === sel}
              onClick={() => setSel(n.id)}
              className={`w-full rounded-md border-l-2 px-3 py-2 text-left ${n.id === sel ? 'border-cobalto bg-raso' : 'border-linha'}`}
            >
              <span className="flex items-baseline justify-between gap-2">
                <span className={`text-[0.95rem] font-semibold ${n.desistem >= GARGALO ? 'text-pitanga-texto' : ''}`}>{n.nome}</span>
                <span className="text-[0.82rem] text-grafite tabular-nums">{n.chegam}%</span>
              </span>
              <span className="mt-1 flex h-2 overflow-hidden rounded-sm" aria-hidden="true">
                <span className="bg-mar/40" style={{ width: `${n.chegam - n.desistem}%` }} />
                <span className="bg-pitanga" style={{ width: `${n.desistem}%` }} />
              </span>
            </button>
          </li>
        ))}
      </ul>

      <p className="mt-5 rounded-lg border border-linha bg-folha p-4 text-[1rem] leading-relaxed" aria-live="polite">
        <span className="font-semibold">{no.nome}. </span>
        {leitura(no)}
      </p>
    </div>
  )
}
