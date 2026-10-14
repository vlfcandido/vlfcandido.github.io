// Cabeçalho do site novo (14/10/2026). Antes: régua de profundidade da Maré (níveis com cotas, fileira de chips
// no celular e régua lateral fixa em tela larga), apagada junto com src/lib/niveis.ts (ver git log).
import { useEffect, useState, type MouseEvent } from 'react'
import { perfil } from '../conteudo'
import { caminhoPublico } from '../lib/assets'
import { irParaSecao } from '../lib/destino'
import { HASH_PROJETOS, type Rota } from '../lib/rota'
import { SITE } from '../lib/site'
import { WHATSAPP } from '../lib/whatsapp'
import { BotaoTema } from './BotaoTema'
import { IconeConversa } from './IconeConversa'

/** Âncoras da home, na ordem de leitura. */
const SECOES = [
  { id: 'trabalhos', rotulo: 'Trabalhos' },
  { id: 'como', rotulo: 'Como funciona' },
  { id: 'quem', rotulo: 'Quem sou' },
] as const

/**
 * Diz qual seção da home está na faixa do meio da tela, para o item do menu ganhar o traço de marca-texto.
 * Fora da home, não observa nada.
 *
 * @param ativo `true` na home.
 * @returns o id da seção à vista (só as do menu) ou `null`.
 */
function useSecaoAVista(ativo: boolean): string | null {
  const [secao, setSecao] = useState<string | null>(null)
  useEffect(() => {
    setSecao(null)
    if (!ativo || !('IntersectionObserver' in window)) return
    const obs = new IntersectionObserver(
      (entradas) => {
        for (const e of entradas) if (e.isIntersecting) setSecao(e.target.id)
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    // As seções fora do menu entram na conta só para apagar o traço quando a pessoa sobe de volta.
    for (const id of ['inicio', 'prototipo', 'empresas', ...SECOES.map((s) => s.id)]) {
      const el = document.getElementById(id)
      if (el) obs.observe(el)
    }
    return () => obs.disconnect()
  }, [ativo])
  return SECOES.some((s) => s.id === secao) ? secao : null
}

/**
 * Clique numa âncora que já está no endereço não dispara `hashchange`, e o item parecia quebrado (Task 10): a
 * rolagem é feita aqui mesmo, sem mexer no histórico.
 *
 * @param e evento do clique.
 * @param id seção de destino.
 */
function mesmaAncora(e: MouseEvent<HTMLAnchorElement>, id: string) {
  if (window.location.hash !== `#${id}` || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
  e.preventDefault()
  irParaSecao(id, !window.matchMedia('(prefers-reduced-motion: reduce)').matches)
}

/**
 * Cabeçalho: o nome em Fraunces com o endereço do site, as âncoras da home, os exemplos navegáveis, o tema e o
 * WhatsApp. No celular é estático (nada fixo por cima da página) e a navegação vira uma linha rolável no polegar;
 * a partir do tablet ele acompanha a rolagem (`md:sticky`).
 *
 * @param props.rota página atual: na de projetos, as âncoras levam de volta à home.
 */
export function Cabecalho({ rota }: { rota: Rota }) {
  const secao = useSecaoAVista(rota === 'inicio')
  return (
    <header className="cabecalho md:sticky md:top-0">
      <div className="cabecalho-grade mx-auto max-w-7xl px-4 sm:px-8">
        <a href="#/" className="cabecalho-marca toque">
          <span className="cabecalho-nome">{perfil.nome}</span>
          <span className="cabecalho-site">{SITE}</span>
        </a>
        <nav aria-label="Seções" className="cabecalho-nav">
          <ul>
            {SECOES.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} aria-current={secao === s.id ? 'location' : undefined} onClick={(e) => mesmaAncora(e, s.id)}>
                  {s.rotulo}
                </a>
              </li>
            ))}
            {/* Task 10: a galeria completa no menu (antes só se chegava a ela pelo botão do bloco de trabalhos). */}
            <li>
              <a href={HASH_PROJETOS} aria-current={rota === 'projetos' ? 'page' : undefined}>
                Projetos
              </a>
            </li>
            {/* Peças navegáveis (HTML estático em public/trabalhos/), na mesma aba: elas têm volta própria. */}
            <li>
              <a href={caminhoPublico(import.meta.env.BASE_URL, 'trabalhos/')}>Exemplos navegáveis</a>
            </li>
          </ul>
        </nav>
        <BotaoTema />
        <a href={WHATSAPP} target="_blank" rel="noopener" className="cta cta-compacta toque">
          <IconeConversa tamanho={18} />
          WhatsApp
          <span className="sr-only"> (abre em nova aba)</span>
        </a>
      </div>
    </header>
  )
}
