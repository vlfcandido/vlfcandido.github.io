import type { JSX } from 'react'
import type { Oferta } from '../conteudo'

// Microilustrações das ofertas, no traço da Maré (grade de 48, traço de 2px na cor do texto)
// com um único acento coral. Decorativas: ficam fora do leitor de tela.

const CORAL = 'var(--pitanga)'

/** Balão de conversa com a lua: atendimento que segue depois do expediente. */
function Whatsapp() {
  return (
    <>
      <path d="M8 12h24a4 4 0 0 1 4 4v12a4 4 0 0 1-4 4H18l-7 6v-6H8a4 4 0 0 1-4-4V16a4 4 0 0 1 4-4Z" />
      <path d="M11 20h16M11 25h10" />
      <path d="M40 6a6 6 0 1 0 5 9a5 5 0 0 1-5-9Z" stroke={CORAL} />
    </>
  )
}

/** Duas folhas e a volta que se fecha sozinha: o trabalho repetido que some. */
function Repetido() {
  return (
    <>
      <path d="M6 8h16v22H6z" />
      <path d="M10 14h8M10 19h8M10 24h5" />
      <path d="M26 18h16v22H26z" />
      <path d="M30 24h8M30 29h8M30 34h5" />
      <path d="M24 6c8 0 13 3 14 9" stroke={CORAL} />
      <path d="M34.5 12.5L38 15.5L40.8 11.5" stroke={CORAL} />
    </>
  )
}

/** Janela de navegador com um painel dentro. */
function Site() {
  return (
    <>
      <rect x="4" y="8" width="40" height="32" rx="3" />
      <path d="M4 15h40" />
      <path d="M9 11.5h1M13 11.5h1" />
      <path d="M10 22h10v12H10z" />
      <path d="M25 22h13M25 27h13M25 32h8" />
      <path d="M10 34l4-5l3 3l3-4" stroke={CORAL} />
    </>
  )
}

/** Três ferramentas ligadas por fios, com o dado passando no meio. */
function Integracao() {
  return (
    <>
      <rect x="4" y="6" width="14" height="12" rx="2" />
      <rect x="30" y="6" width="14" height="12" rx="2" />
      <rect x="17" y="30" width="14" height="12" rx="2" />
      <path d="M18 12h12M11 18v6c0 3 2 5 5 5h1M37 18v6c0 3-2 5-5 5h-1" />
      <circle cx="24" cy="12" r="2.4" fill={CORAL} stroke={CORAL} />
    </>
  )
}

/** Chaves de código com um encaixe no meio: o sistema ou a API feitos sob medida. */
function SobMedida() {
  return (
    <>
      <path d="M14 8c-4 0-5 2-5 5v5c0 3-2 5-5 6c3 1 5 3 5 6v5c0 3 1 5 5 5" />
      <path d="M34 8c4 0 5 2 5 5v5c0 3 2 5 5 6c-3 1-5 3-5 6v5c0 3-1 5-5 5" />
      <path d="M20 22h8v6a4 4 0 0 1-8 0z" stroke={CORAL} />
      <path d="M22 18v4M26 18v4M24 32v4" stroke={CORAL} />
    </>
  )
}

/** Escudo com o visto: o sistema que voltou ao ar, corrigido e sem brecha. */
function Resgate() {
  return (
    <>
      <path d="M24 5l16 6v11c0 10-7 18-16 21C15 40 8 32 8 22V11z" />
      <path d="M17 24l5 5l9-10" stroke={CORAL} />
    </>
  )
}

const DESENHOS: Record<Oferta['id'], () => JSX.Element> = {
  integracao: Integracao,
  repetido: Repetido,
  resgate: Resgate,
  'sob-medida': SobMedida,
  site: Site,
  whatsapp: Whatsapp,
}

/**
 * Ícone desenhado de uma oferta.
 *
 * @param id qual oferta.
 * @param className tamanho e cor (o traço segue `currentColor`).
 */
export function IconeOferta({ id, className = 'size-12' }: { id: Oferta['id']; className?: string }) {
  // Oferta sem desenho próprio usa a janela do navegador, para trocar o texto sem quebrar.
  const Desenho = DESENHOS[id] ?? Site
  return (
    <svg
      viewBox="0 0 48 48"
      aria-hidden="true"
      focusable="false"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <Desenho />
    </svg>
  )
}
