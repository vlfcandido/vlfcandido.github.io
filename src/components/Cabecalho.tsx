import { useEffect, useState } from 'react'
import { perfil } from '../conteudo'
import { HASH_PROJETOS, type Rota } from '../lib/rota'
import { LINKEDIN } from '../visuais'
import { BotaoTema } from './BotaoTema'
import { LinkExterno } from './LinkExterno'

const SECOES = [
  { href: '#o-que-eu-resolvo', rotulo: 'O que eu resolvo' },
  { href: '#resultados', rotulo: 'Resultados' },
  { href: '#como-funciona', rotulo: 'Como funciona' },
  { href: HASH_PROJETOS, rotulo: 'Projetos' },
] as const

/** Cabeçalho fixo: nome, seções (menu no celular), tema e o LinkedIn sempre à vista. */
export function Cabecalho({ rota }: { rota: Rota }) {
  const [menu, setMenu] = useState(false)
  // As seções da principal ficam no menu nas duas páginas: o App renderiza a principal e rola até a seção.
  const itens = rota === 'projetos' ? [{ href: '#/', rotulo: 'Início' }, ...SECOES] : SECOES
  const atual = (href: string) => (href === HASH_PROJETOS && rota === 'projetos' ? 'page' : undefined)

  useEffect(() => {
    if (!menu) return
    const fechar = (e: KeyboardEvent) => e.key === 'Escape' && setMenu(false)
    window.addEventListener('keydown', fechar)
    return () => window.removeEventListener('keydown', fechar)
  }, [menu])

  return (
    <header className="sticky top-0 z-20 border-b border-linha/70 bg-nevoa/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:gap-5 sm:px-8">
        <a href="#/" className="mr-auto inline-flex items-baseline gap-[0.15em] text-[1.05rem] font-bold tracking-[0.004em]">
          {perfil.nome}
          <span aria-hidden="true" className="ponto" />
        </a>
        <nav aria-label="Seções" className="hidden lg:block">
          <ul className="flex gap-6 text-[0.95rem] text-grafite">
            {itens.map((s) => (
              <li key={s.href}>
                <a className="sublinha leve hover:text-tinta aria-[current=page]:text-tinta" href={s.href} aria-current={atual(s.href)}>
                  {s.rotulo}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <BotaoTema />
        <LinkExterno
          href={LINKEDIN}
          className="botao-acao hidden rounded-full bg-cobalto px-4 py-2 text-[0.95rem] font-semibold whitespace-nowrap text-nevoa hover:bg-cobalto-forte sm:inline-block"
        >
          Falar comigo no LinkedIn
        </LinkExterno>
        <button
          type="button"
          onClick={() => setMenu((v) => !v)}
          aria-expanded={menu}
          aria-controls="menu-celular"
          className="grid size-10 place-items-center rounded-full border border-linha text-tinta lg:hidden"
        >
          <span className="sr-only">{menu ? 'Fechar menu' : 'Abrir menu'}</span>
          <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true">
            <path
              d={menu ? 'M5 5l10 10M15 5L5 15' : 'M3 6h14M3 10h14M3 14h14'}
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>
      {menu && (
        <nav id="menu-celular" aria-label="Seções" className="border-t border-linha lg:hidden">
          <ul className="mx-auto max-w-7xl px-4 py-2 sm:px-8">
            {itens.map((s) => (
              <li key={s.href}>
                <a href={s.href} aria-current={atual(s.href)} onClick={() => setMenu(false)} className="block py-3 text-[1.1rem] font-medium hover:text-cobalto">
                  {s.rotulo}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  )
}
