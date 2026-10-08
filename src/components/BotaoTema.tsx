import { useEffect, useState } from 'react'

type Tema = 'claro' | 'escuro'

/** Tema em uso agora: o escolhido pela pessoa ou, sem escolha, o do sistema. */
function temaAtual(): Tema {
  const salvo = document.documentElement.dataset.tema
  if (salvo === 'claro' || salvo === 'escuro') return salvo
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'escuro' : 'claro'
}

/** Alterna entre claro e escuro e lembra a escolha neste navegador. */
export function BotaoTema() {
  const [tema, setTema] = useState<Tema>('claro')

  useEffect(() => setTema(temaAtual()), [])

  function alternar() {
    const novo: Tema = tema === 'escuro' ? 'claro' : 'escuro'
    document.documentElement.dataset.tema = novo
    try {
      localStorage.setItem('tema', novo)
    } catch {
      // Sem armazenamento (aba privada): o tema vale só até recarregar.
    }
    setTema(novo)
  }

  const rotulo = tema === 'escuro' ? 'Usar tema claro' : 'Usar tema escuro'
  return (
    <button
      type="button"
      onClick={alternar}
      aria-label={rotulo}
      title={rotulo}
      className="grid size-9 place-items-center rounded-full text-grafite hover:bg-folha hover:text-tinta"
    >
      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
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
