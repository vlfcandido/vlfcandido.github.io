import { useState } from 'react'
import { comTransicao, temViewTransition, poucoMovimento } from '../lib/transicao'

type Tema = 'claro' | 'escuro'

/** Cor da barra do navegador em cada tema (a mesma do papel; ver index.html). */
const COR_DA_BARRA: Record<Tema, string> = { claro: '#f7f4ee', escuro: '#161512' }

/** Tema em uso agora: o escolhido pela pessoa ou, sem escolha, o do sistema. */
function temaAtual(): Tema {
  const salvo = document.documentElement.dataset.tema
  if (salvo === 'claro' || salvo === 'escuro') return salvo
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'escuro' : 'claro'
}

/** A barra do navegador acompanha o tema escolhido (as metas do index.html só seguem o tema do sistema). */
function pintarBarra(tema: Tema) {
  for (const meta of document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]')) meta.content = COR_DA_BARRA[tema]
}

/**
 * Alterna entre claro e escuro e lembra a escolha neste navegador. Sem piscar (§13): o estado inicial já sai do
 * tema aplicado pelo index.html antes da pintura (antes começava em "claro" e trocava o ícone depois de montar);
 * com View Transition o site inteiro esmaece de uma vez; sem ela, as transições de cor ficam desligadas por um
 * quadro, para nada trocar de cor em tempos diferentes.
 */
export function BotaoTema() {
  const [tema, setTema] = useState<Tema>(temaAtual)

  function alternar() {
    const novo: Tema = tema === 'escuro' ? 'claro' : 'escuro'
    const raiz = document.documentElement
    const aplicar = () => {
      raiz.dataset.tema = novo
      pintarBarra(novo)
      setTema(novo)
    }
    if (temViewTransition() && !poucoMovimento()) comTransicao(aplicar, 'tema')
    else {
      raiz.dataset.trocandoTema = ''
      aplicar()
      requestAnimationFrame(() => requestAnimationFrame(() => delete raiz.dataset.trocandoTema))
    }
    try {
      localStorage.setItem('tema', novo)
    } catch {
      // Sem armazenamento (aba privada): o tema vale só até recarregar.
    }
  }

  const rotulo = tema === 'escuro' ? 'Usar tema claro' : 'Usar tema escuro'
  return (
    <button type="button" onClick={alternar} aria-label={rotulo} title={rotulo} data-tema={tema} className="botao-tema toque">
      <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
        {tema === 'escuro' ? (
          <g fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <circle cx="12" cy="12" r="4.2" />
            <path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M5.3 18.7l1.6-1.6M17.1 6.9l1.6-1.6" />
          </g>
        ) : (
          <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" fill="currentColor" />
        )}
      </svg>
    </button>
  )
}
