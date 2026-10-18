// Cabeçalho do site novo (14/10/2026). Antes: régua de profundidade da Maré (níveis com cotas, fileira de chips
// no celular e régua lateral fixa em tela larga), apagada junto com src/lib/niveis.ts (ver git log).
import { useEffect, useId, useState, type MouseEvent } from 'react'
import { flushSync } from 'react-dom'
import { perfil } from '../conteudo'
import { NOME_PECAS } from '../home/conteudo'
import { caminhoPublico } from '../lib/assets'
import { irParaSecao } from '../lib/destino'
import { HASH_PROJETOS, type Rota } from '../lib/rota'
import { SITE } from '../lib/site'
import { WHATSAPP } from '../lib/whatsapp'
import { BotaoTema } from './BotaoTema'
import { IconeConversa } from './IconeConversa'

/**
 * Âncoras da home, na ordem de leitura. 18/10/2026: "Destaques" saiu do menu, porque era um terceiro nome para os
 * casos de trabalho; a seção passou a se chamar "Projetos", e o item "Projetos" leva à página completa.
 */
const SECOES = [
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
    for (const id of ['inicio', 'experimente', 'destaques', 'empresas', ...SECOES.map((s) => s.id)]) {
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
 * Cabeçalho: o nome em Fraunces com o endereço do site, "Experimente ao vivo", "Projetos", as âncoras da home,
 * o tema e o WhatsApp. No celular é estático (nada fixo por cima da página) e a navegação fica num menu recolhível, aberto
 * no próprio fluxo da página (empurra o conteúdo, nunca cobre); a partir do tablet ele acompanha a rolagem
 * (`md:sticky`) e a navegação fica sempre à vista.
 * Fix final (14/10/2026, revisor: "topo do celular pesado, menu em 2 linhas"): antes, no celular, o menu ocupava
 * duas linhas fixas sob a marca (≈ 153 px de cabeçalho); agora é uma linha de 56 px com o botão "Menu".
 *
 * @param props.rota página atual: na de projetos, as âncoras levam de volta à home.
 */
export function Cabecalho({ rota }: { rota: Rota }) {
  const secao = useSecaoAVista(rota === 'inicio')
  const [aberto, setAberto] = useState(false)
  const idNav = useId()
  // Troca de página fecha o menu; Esc também, devolvendo o foco ao botão.
  useEffect(() => setAberto(false), [rota])
  useEffect(() => {
    if (!aberto) return
    const aoTeclar = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      setAberto(false)
      document.querySelector<HTMLButtonElement>('.cabecalho-menu')?.focus()
    }
    window.addEventListener('keydown', aoTeclar)
    return () => window.removeEventListener('keydown', aoTeclar)
  }, [aberto])
  const fechar = () => setAberto(false)
  return (
    <header className="cabecalho md:sticky md:top-0">
      <div className="cabecalho-grade mx-auto max-w-7xl px-4 sm:px-8">
        <a href="#/" className="cabecalho-marca toque">
          <span className="cabecalho-nome">{perfil.nome}</span>
          <span className="cabecalho-site">{SITE}</span>
        </a>
        <button
          type="button"
          className="cabecalho-menu toque"
          aria-expanded={aberto}
          aria-controls={idNav}
          onClick={() => setAberto((a) => !a)}
        >
          <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true">
            <path d={aberto ? 'M5 5l10 10M15 5L5 15' : 'M3 6h14M3 10h14M3 14h14'} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          Menu
        </button>
        <nav id={idNav} aria-label="Seções" className="cabecalho-nav" data-aberto={aberto}>
          <ul>
            {/* Peças navegáveis (HTML estático em public/trabalhos/), na mesma aba: elas têm volta própria.
                18/10/2026: primeiro item do menu, com o nome único que a home, /trabalhos/ e os cartões usam. */}
            <li>
              <a href={caminhoPublico(import.meta.env.BASE_URL, 'trabalhos/')} onClick={fechar}>
                {NOME_PECAS}
              </a>
            </li>
            {/* Casos de trabalho real: o nome "Projetos" é o mesmo da seção da home e do título de #/projetos. */}
            <li>
              <a href={HASH_PROJETOS} aria-current={rota === 'projetos' ? 'page' : undefined} onClick={fechar}>
                Projetos
              </a>
            </li>
            {SECOES.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} aria-current={secao === s.id ? 'location' : undefined} onClick={(e) => {
                    // 15/10/2026 (medir_site, check 13): o menu aberto empurra a página; a rolagem da mesma âncora
                    // era medida com ele aberto e o título parava ~200 px acima da tela. Fecha de forma síncrona antes.
                    flushSync(fechar)
                    mesmaAncora(e, s.id)
                  }}>
                  {s.rotulo}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <BotaoTema />
        <a href={WHATSAPP} target="_blank" rel="noopener" className="cta cta-compacta toque">
          <IconeConversa tamanho={18} />
          {/* No celular só o ícone (o texto fica para leitor de tela); o WhatsApp com texto está logo abaixo, na prova. */}
          <span className="cta-compacta-texto">WhatsApp</span>
          <span className="sr-only"> (abre em nova aba)</span>
        </a>
      </div>
    </header>
  )
}
