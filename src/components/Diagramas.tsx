import type { ReactNode } from 'react'
import type { Diagrama } from '../visuais'

// Diagramas de arquitetura escritos à mão em SVG. As cores vêm das variáveis do tema,
// então o mesmo desenho funciona no claro e no escuro.

const T = 'var(--tinta)'
const F = 'var(--folha)'
const A = 'var(--cobalto)'
const G = 'var(--grafite)'
const M = 'var(--marca)'

interface CaixaProps {
  x: number
  y: number
  l: number
  a?: number
  titulo: string
  sub?: string
  destaque?: boolean
}

/** Caixa de um componente do sistema, com título e uma linha de apoio. */
function Caixa({ x, y, l, a = 64, titulo, sub, destaque }: CaixaProps) {
  return (
    <g>
      <rect x={x} y={y} width={l} height={a} rx={10} fill={F} stroke={destaque ? A : T} strokeWidth={destaque ? 2.5 : 1.5} />
      <text x={x + 14} y={y + (sub ? 27 : a / 2 + 6)} fill={T} fontSize={16} fontWeight={650}>
        {titulo}
      </text>
      {sub && (
        <text x={x + 14} y={y + 47} fill={G} fontSize={13}>
          {sub}
        </text>
      )}
    </g>
  )
}

/** Seta com cabeça desenhada, de (x1,y1) a (x2,y2), com curva opcional. */
function Seta({ d, cor = T, tracejada }: { d: string; cor?: string; tracejada?: boolean }) {
  return (
    <path
      d={d}
      fill="none"
      stroke={cor}
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeDasharray={tracejada ? '5 6' : undefined}
      markerEnd={cor === A ? 'url(#ponta-a)' : 'url(#ponta)'}
    />
  )
}

/** Nota manuscrita ao lado de uma seta. */
function Nota({ x, y, children }: { x: number; y: number; children: ReactNode }) {
  return (
    <text x={x} y={y} fill={G} fontSize={13} fontStyle="italic" fontFamily="var(--font-texto)">
      {children}
    </text>
  )
}

/** Pontas de seta compartilhadas por todos os diagramas; renderizado uma vez na página. */
export function DefsDiagramas() {
  return (
    <svg width="0" height="0" aria-hidden="true" className="absolute">
    <defs>
      <marker id="ponta" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
        <path d="M1 1 L9 5 L1 9" fill="none" stroke={T} strokeWidth={1.6} strokeLinecap="round" />
      </marker>
      <marker id="ponta-a" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
        <path d="M1 1 L9 5 L1 9" fill="none" stroke={A} strokeWidth={1.6} strokeLinecap="round" />
      </marker>
    </defs>
    </svg>
  )
}

/** Bot de trading: corretora, serviço de execução, reconciliação, filas e painel. Hoje roda em simulação. */
function NexusQuant() {
  return (
    <>
      <Caixa x={20} y={40} l={170} titulo="Corretora" sub="em modo simulado" />
      <Caixa x={300} y={40} l={230} titulo="Serviço de execução" sub="Python e FastAPI" destaque />
      <Caixa x={640} y={40} l={150} titulo="Painel" sub="Next.js" />
      <Caixa x={300} y={190} l={230} titulo="Reconciliação" sub="confere cada ordem na corretora" />
      <Caixa x={20} y={190} l={170} titulo="Redis Streams" sub="eventos de mercado" />
      <Caixa x={640} y={190} l={150} titulo="PostgreSQL" sub="trades e ciclos" />
      <Caixa x={300} y={330} l={230} titulo="Monitoramento" sub="alerta quando algo diverge" />
      <Seta d="M190 64 C240 64 250 64 296 64" />
      <Seta d="M296 88 C250 88 240 88 194 88" cor={A} />
      <Nota x={208} y={56}>preços</Nota>
      <Nota x={208} y={110}>ordens</Nota>
      <Seta d="M530 72 C580 72 590 72 636 72" />
      <Seta d="M415 104 L415 186" />
      <Seta d="M190 222 C240 222 250 222 296 222" />
      <Seta d="M530 222 C580 222 590 222 636 222" />
      <Seta d="M415 258 L415 326" cor={A} />
      <rect x={560} y={330} width={230} height={64} rx={4} fill={M} opacity={0.9} />
      <text x={574} y={357} fill="var(--marca-tinta)" fontSize={15} fontWeight={650}>
        1.060 testes automáticos
      </text>
      <text x={574} y={378} fill="var(--marca-tinta)" fontSize={13}>
        rodando a cada mudança
      </text>
    </>
  )
}

/** Agente de vídeo: fontes, agente que escolhe a pauta, corte com legenda e narração. */
function NexusClips() {
  return (
    <>
      <Caixa x={20} y={30} l={150} a={52} titulo="X" />
      <Caixa x={20} y={100} l={150} a={52} titulo="YouTube" />
      <Caixa x={20} y={170} l={150} a={52} titulo="RSS" />
      <Caixa x={250} y={80} l={220} titulo="Agente LangGraph" sub="escolhe o tema do momento" destaque />
      <Caixa x={250} y={220} l={220} titulo="Claude API" sub="roteiro e ponto do corte" />
      <Caixa x={560} y={30} l={220} titulo="Whisper" sub="transcreve e marca o tempo" />
      <Caixa x={560} y={130} l={220} titulo="FFmpeg + TTS" sub="corte, legenda e narração" />
      <Caixa x={560} y={250} l={220} titulo="Painel React" sub="fila de cortes e contas" />
      <Seta d="M170 56 C210 56 215 100 246 104" />
      <Seta d="M170 126 L246 116" />
      <Seta d="M170 196 C210 196 215 140 246 132" />
      <Seta d="M360 144 L360 216" />
      <Seta d="M330 216 L330 148" cor={A} />
      <Seta d="M470 100 C510 100 520 62 556 62" />
      <Seta d="M670 94 L670 126" />
      <Seta d="M670 194 L670 246" />
      <Nota x={684} y={226}>corte com legenda</Nota>
      <Nota x={20} y={262}>fontes monitoradas</Nota>
      <rect x={20} y={300} width={450} height={70} rx={4} fill={M} opacity={0.9} />
      <text x={36} y={330} fill="var(--marca-tinta)" fontSize={15} fontWeight={650}>
        Protótipo em construção
      </text>
      <text x={36} y={352} fill="var(--marca-tinta)" fontSize={13}>
        o upload no YouTube já funciona; o resto do fluxo está sendo ligado
      </text>
    </>
  )
}

/** Assistente de investimentos: três agentes, como descritos na matéria pública. */
function Sicoob() {
  return (
    <>
      <Caixa x={20} y={150} l={190} titulo="Pergunta da equipe" sub="atendimento consultivo" />
      <Caixa x={290} y={150} l={210} titulo="Agente que encaminha" sub="entende o assunto" destaque />
      <Caixa x={550} y={70} l={240} titulo="Agente de investimentos" sub="responde sobre produtos" />
      <Caixa x={550} y={230} l={240} titulo="Perguntas frequentes" sub="agente das dúvidas do dia a dia" />
      <Seta d="M210 182 L286 182" />
      <Seta d="M500 172 C530 172 520 102 546 102" />
      <Seta d="M500 194 C530 194 520 262 546 262" />
      <Nota x={300} y={250}>três agentes, um assistente</Nota>
    </>
  )
}

const DESENHOS: Record<Diagrama, { titulo: string; altura: number; corpo: () => ReactNode }> = {
  'nexus-quant': { titulo: 'Como o bot de trading se organiza', altura: 410, corpo: NexusQuant },
  'nexus-clips': { titulo: 'Da notícia ao corte de vídeo', altura: 390, corpo: NexusClips },
  sicoob: { titulo: 'Assistente de investimentos com três agentes de IA', altura: 320, corpo: Sicoob },
}

/** Desenha o diagrama pedido; no celular rola na horizontal para manter o texto legível. */
export function DiagramaArquitetura({ id }: { id: Diagrama }) {
  const d = DESENHOS[id]
  const Corpo = d.corpo
  return (
    <figure className="max-w-full overflow-x-auto rounded-sm">
      <svg
        role="img"
        aria-label={d.titulo}
        viewBox={`0 0 800 ${d.altura}`}
        className="block w-full min-w-[640px] font-titulo"
      >
        <Corpo />
      </svg>
      <figcaption className="mt-2 text-[0.9rem] text-grafite sm:hidden">Arraste para o lado para ver o desenho inteiro.</figcaption>
    </figure>
  )
}
