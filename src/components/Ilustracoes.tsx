import type { Ilustracao } from '../noticias'

// Ilustrações próprias para as notícias e histórias: nenhuma usa logo ou imagem da matéria.
// Traço em tinta, um acento cobalto e um toque de marca-texto, nas cores do tema.

const T = 'var(--tinta)'
const F = 'var(--folha)'
const N = 'var(--nevoa)'
const A = 'var(--cobalto)'
const G = 'var(--grafite)'
const M = 'var(--marca)'
const L = 'var(--linha)'

/** Balão de conversa com linhas de texto. */
function Balao({ x, y, l, a, cor = T, lado = 'e', preenchido }: { x: number; y: number; l: number; a: number; cor?: string; lado?: 'e' | 'd'; preenchido?: boolean }) {
  const rabo = lado === 'e' ? `M${x + 18} ${y + a} l-8 14 l20 -14` : `M${x + l - 18} ${y + a} l8 14 l-20 -14`
  return (
    <g>
      <rect x={x} y={y} width={l} height={a} rx={14} fill={preenchido ? cor : F} stroke={cor} strokeWidth={2} />
      <path d={rabo} fill={preenchido ? cor : F} stroke={cor} strokeWidth={2} strokeLinejoin="round" />
      <path
        d={`M${x + 16} ${y + a / 2 - 6} h${l * 0.62} M${x + 16} ${y + a / 2 + 8} h${l * 0.38}`}
        stroke={preenchido ? N : G}
        strokeWidth={4}
        strokeLinecap="round"
      />
    </g>
  )
}

function Agentes() {
  return (
    <>
      <Balao x={24} y={92} l={120} a={52} />
      <path d="M150 118 H196" stroke={T} strokeWidth={2} markerEnd="url(#ponta)" />
      <circle cx={232} cy={118} r={30} fill={A} />
      <circle cx={232} cy={118} r={11} fill={N} />
      {[
        [340, 60],
        [340, 176],
      ].map(([cx, cy]) => (
        <g key={cy}>
          <path d={`M262 118 C300 118 300 ${cy} ${cx - 30} ${cy}`} fill="none" stroke={T} strokeWidth={2} markerEnd="url(#ponta)" />
          <circle cx={cx} cy={cy} r={24} fill={F} stroke={A} strokeWidth={3} />
          <circle cx={cx} cy={cy} r={8} fill={A} />
        </g>
      ))}
      <rect x={292} y={212} width={92} height={10} fill={M} />
    </>
  )
}

function Atendimento() {
  return (
    <>
      <rect x={70} y={20} width={260} height={180} rx={16} fill={F} stroke={T} strokeWidth={2} />
      <Balao x={92} y={42} l={150} a={44} />
      <Balao x={160} y={110} l={150} a={44} cor={A} lado="d" preenchido />
      {/* sineta de concierge */}
      <path d="M150 232 a50 34 0 0 1 100 0 z" fill={M} stroke={T} strokeWidth={2} />
      <path d="M140 232 h120" stroke={T} strokeWidth={3} strokeLinecap="round" />
      <path d="M200 198 v-8 M192 190 h16" stroke={T} strokeWidth={3} strokeLinecap="round" />
    </>
  )
}

function Conversas() {
  const baloes = [
    [30, 30],
    [70, 96],
    [24, 160],
    [110, 190],
    [120, 40],
  ]
  return (
    <>
      {baloes.map(([x, y], i) => (
        <rect key={i} x={x} y={y} width={64} height={30} rx={10} fill={F} stroke={i === 2 ? A : G} strokeWidth={2} />
      ))}
      <path d="M200 40 L250 120 L200 200" fill="none" stroke={T} strokeWidth={2} strokeLinejoin="round" />
      {[60, 110, 80, 150, 125].map((h, i) => (
        <rect key={i} x={272 + i * 22} y={220 - h} width={14} height={h} fill={i === 3 ? A : L} />
      ))}
      <path d="M266 221 H384" stroke={T} strokeWidth={2} />
      <rect x={334} y={58} width={22} height={8} fill={M} />
    </>
  )
}

function Chatbot() {
  return (
    <>
      <rect x={140} y={10} width={120} height={230} rx={20} fill={F} stroke={T} strokeWidth={2} />
      <path d="M182 26 h36" stroke={L} strokeWidth={4} strokeLinecap="round" />
      <rect x={152} y={46} width={80} height={28} rx={9} fill={N} stroke={G} strokeWidth={1.5} />
      <rect x={170} y={84} width={78} height={28} rx={9} fill={A} />
      <rect x={152} y={122} width={64} height={28} rx={9} fill={N} stroke={G} strokeWidth={1.5} />
      <rect x={170} y={160} width={78} height={44} rx={9} fill={A} />
      <rect x={60} y={150} width={50} height={8} fill={M} />
      <path d="M40 120 C70 120 90 100 130 100" fill="none" stroke={T} strokeWidth={2} strokeDasharray="5 6" />
    </>
  )
}

function Parceria() {
  return (
    <>
      <rect x={70} y={60} width={150} height={120} rx={22} fill={F} stroke={T} strokeWidth={2.5} />
      <rect x={180} y={60} width={150} height={120} rx={22} fill="none" stroke={A} strokeWidth={4} />
      <rect x={180} y={60} width={40} height={120} fill={M} opacity={0.85} />
      <path d="M110 120 h40 M250 120 h40" stroke={G} strokeWidth={4} strokeLinecap="round" />
    </>
  )
}

const DESENHOS: Record<Ilustracao, () => React.JSX.Element> = {
  agentes: Agentes,
  atendimento: Atendimento,
  conversas: Conversas,
  chatbot: Chatbot,
  parceria: Parceria,
}

/** Ilustração de capa de uma notícia ou história, desenhada para o site. */
export function IlustracaoNoticia({ motivo, rotulo }: { motivo: Ilustracao; rotulo: string }) {
  const Desenho = DESENHOS[motivo]
  return (
    <svg role="img" aria-label={rotulo} viewBox="0 0 400 250" className="block h-auto w-full">
      <Desenho />
    </svg>
  )
}
