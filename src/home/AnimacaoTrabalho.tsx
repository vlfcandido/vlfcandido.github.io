// Animação do topo (21/10/2026, pedido dele: o print grande da vitrine era "desperdício de espaço"). Uma cena só, numa
// janela de navegador: o site de um café fictício se monta peça por peça e ganha vida com a automação do WhatsApp (o
// cursor clica em "Fazer pedido", o agente de IA atende, o Pix confirma e chega o aviso de pedido novo). O movimento é
// todo CSS (home.css, bloco .anim); aqui ficam a estrutura e o laço. No celular, a cena tem layout próprio (container
// query no palco). Com reduced-motion fica o quadro final, parado. Antes: 3 cenas com abas (site, agentes, testes).
// Interação (21/10/2026, "mais interativo e inteligente"): com o mouse, a janela inclina em 3D com reflexo, as peças
// andam em profundidades diferentes e os botões são magnéticos; clicar (ou tocar) numa peça pausa a volta e mostra
// como ela é feita, com o componente e o teste. Tudo isso é enfeite de ponteiro: a cena continua aria-hidden.
import { useCallback, useEffect, useRef, useState, type MouseEvent, type PointerEvent, type ReactNode } from 'react'
import { conteudoHome } from './conteudo'

/**
 * Duração de uma volta, em ms. Coreografia em batidas (21/10/2026, pedido dele: "as coisas acontecerem mais juntas"):
 * montagem até 1,9 s, clique a 2,4 s, conversa de 2,5 a 5,0 s, confirmação a 5,0 s, quadro pronto e saída suave a 8,2 s.
 */
const VOLTA = 8600

/** Em que segundo cada mensagem da conversa chega (as da loja mostram "digitando" 0,7 s antes). */
const TEMPOS_CONVERSA = [2.5, 3.5, 4.1, 5.0]

/**
 * Reinicia a cena a cada volta enquanto ela está visível; parada (reduced-motion, fora da tela ou com uma peça
 * aberta no inspetor), não reinicia.
 *
 * @param pausado `true` enquanto uma peça está sendo inspecionada.
 * @returns o número da volta (vira `key` para a cena remontar) e o ref do palco.
 */
function useVolta(pausado: boolean) {
  const [volta, setVolta] = useState(0)
  const [visivel, setVisivel] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el || !('IntersectionObserver' in window)) return
    const obs = new IntersectionObserver(([e]) => setVisivel(e.isIntersecting), { threshold: 0.4 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  useEffect(() => {
    if (pausado || !visivel || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = window.setTimeout(() => setVolta((v) => v + 1), VOLTA)
    return () => window.clearTimeout(id)
  }, [visivel, volta, pausado])
  return { volta, ref }
}

/**
 * Uma peça do site: a vaga tracejada aparece primeiro e a peça chega de fora, encaixa com mola e as guias de
 * alinhamento piscam no encaixe.
 *
 * @param props.area área da grade (grid-template-areas da cena) e sufixo da classe da peça.
 * @param props.quando segundo em que a peça começa a chegar (as batidas estão no comentário de VOLTA).
 * @param props.de de onde a peça vem, em % do próprio tamanho, e o giro inicial.
 * @param props.fundo profundidade no paralaxe do mouse, em px por unidade de deslocamento (maior = mais perto).
 * @param props.foco área aberta no inspetor (as outras peças apagam), ou `null`.
 */
function Peca({ area, quando, de, fundo, foco, children }: {
  area: string
  quando: number
  de: [number, number, number]
  fundo: number
  foco: string | null
  children: ReactNode
}) {
  const [dx, dy, giro] = de
  const estilo = {
    gridArea: area, ['--q' as string]: `${quando}s`, ['--dx' as string]: `${dx}%`, ['--dy' as string]: `${dy}%`,
    ['--giro' as string]: `${giro}deg`, ['--d' as string]: fundo,
  }
  const apagada = foco !== null && foco !== area
  return (
    <div className="a-vaga" data-area={area} data-apagada={apagada || undefined} style={estilo}>
      <div className={`a-peca a-${area}`}>{children}</div>
    </div>
  )
}

/** Ícones dos cartões do site, em traço. */
const ICONES: Record<string, ReactNode> = {
  cardapio: <path d="M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3V4Zm4 5h6M9 12h6M9 15h4" />,
  pix: <path d="M12 3.5 20.5 12 12 20.5 3.5 12 12 3.5Zm-3.5 8.5h7" />,
  entrega: <path d="M6.5 17.5a2.5 2.5 0 1 0 0 .01M17.5 17.5a2.5 2.5 0 1 0 0 .01M6.5 17.5 10 9h4l3.5 8.5M10 9 8.5 6H6m8 3 1.5-3H18" />,
}

/**
 * O site do café: as peças, a conversa no celular, o cursor e o aviso de pedido novo.
 *
 * @param props.foco área aberta no inspetor, ou `null`.
 */
function SiteDoCafe({ foco }: { foco: string | null }) {
  const { site } = conteudoHome().animacao
  return (
    <div className="anim-site" aria-hidden="true">
      <Peca area="menu" foco={foco} fundo={3} quando={0.25} de={[0, -70, 0]}>
        <b className="a-marca"><i className="a-logo" />{site.marca}</b>
        <span className="a-links">{site.menu.map((m) => <span key={m}>{m}</span>)}</span>
        <span className="a-acao" data-magnetico>{site.acao}</span>
        <span className="a-hamburguer"><i /><i /><i /></span>
      </Peca>
      <Peca area="aberto" foco={foco} fundo={6} quando={0.6} de={[-40, 0, -3]}>
        <span className="a-aberto-selo"><i />{site.selo}</span>
      </Peca>
      <Peca area="titulo" foco={foco} fundo={8} quando={0.68} de={[-30, 10, -2]}>
        <p className="a-h">{site.titulo}</p>
      </Peca>
      <Peca area="texto" foco={foco} fundo={6} quando={0.76} de={[-30, 20, 2]}>
        <p className="a-p">{site.texto}</p>
      </Peca>
      <Peca area="botoes" foco={foco} fundo={10} quando={0.84} de={[-20, 60, -4]}>
        <span className="a-btn a-btn1" data-magnetico>
          {site.botoes[0]}
          <svg className="a-cursor" viewBox="0 0 24 24">
            <path d="M4 2 L4 19 L8.5 14.8 L11.6 21.5 L14.4 20.2 L11.3 13.7 L17.5 13.7 Z" />
          </svg>
        </span>
        <span className="a-btn a-btn2" data-magnetico>{site.botoes[1]}</span>
      </Peca>
      <Peca area="prova" foco={foco} fundo={5} quando={0.92} de={[-20, 60, 3]}>
        <span className="a-rostos"><i /><i /><i /></span>
        <span className="a-estrelas">★★★★★</span>
        <span className="a-prova">{site.prova}</span>
        <span className="a-pedidos">
          <span className="a-num"><span>{site.pedidos.antes}</span><span>{site.pedidos.depois}</span></span>
          {site.pedidos.rotulo}
        </span>
      </Peca>
      <Peca area="celular" foco={foco} fundo={14} quando={0.35} de={[40, -20, 5]}>
        <span className="a-fone">
          <span className="a-fone-topo"><i />{site.marca}<small>{site.agente}</small></span>
          <span className="a-conversa">
            {site.conversa.map((m, k) => (
              <span key={m.texto} className={`a-bolha a-${m.de}`} style={{ ['--t' as string]: `${TEMPOS_CONVERSA[k]}s` }}>
                {m.de === 'loja' && <small className="a-quem">{site.agente}</small>}
                {m.texto}
              </span>
            ))}
          </span>
        </span>
      </Peca>
      {site.cartoes.map((c, k) => (
        <Peca key={c.titulo} area={`c${k + 1}`} foco={foco} fundo={7} quando={1.15 + k * 0.08} de={[(k - 1) * 25, 60, (k - 1) * 4]}>
          <svg className={`a-icone a-icone-${c.icone}`} viewBox="0 0 24 24">{ICONES[c.icone]}</svg>
          <span className="a-cartao-texto"><b>{c.titulo}</b><span>{c.texto}</span></span>
        </Peca>
      ))}
      <span className="a-aviso"><i />{site.aviso}</span>
    </div>
  )
}

/** Uma peça aberta no inspetor: a área e a caixa dela no palco, em % (para acompanhar o tamanho da janela). */
interface Inspecao { area: string; x: number; y: number; l: number; a: number }

/**
 * Inclinação 3D, reflexo, paralaxe e botões magnéticos seguindo o mouse. Escreve só variáveis CSS na moldura (nada de
 * render do React a cada movimento); o desenho fica em home.css. Toque e reduced-motion não inclinam.
 *
 * @returns os handlers de mover e sair do ponteiro, para a moldura.
 */
function useInclinacao() {
  const quadro = useRef(0)
  const mover = useCallback((e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const el = e.currentTarget
    const { clientX, clientY } = e
    cancelAnimationFrame(quadro.current)
    quadro.current = requestAnimationFrame(() => {
      const r = el.getBoundingClientRect()
      const px = ((clientX - r.left) / r.width) * 2 - 1
      const py = ((clientY - r.top) / r.height) * 2 - 1
      el.style.setProperty('--px', px.toFixed(3))
      el.style.setProperty('--py', py.toFixed(3))
      el.style.setProperty('--gx', `${((px + 1) * 50).toFixed(1)}%`)
      el.style.setProperty('--gy', `${((py + 1) * 50).toFixed(1)}%`)
      el.dataset.mouse = ''
      // Botões magnéticos: a menos de 90 px do centro, andam até 30% da distância na direção do mouse.
      el.querySelectorAll<HTMLElement>('[data-magnetico]').forEach((b) => {
        const c = b.getBoundingClientRect()
        const dx = clientX - (c.left + c.width / 2)
        const dy = clientY - (c.top + c.height / 2)
        const perto = Math.hypot(dx, dy) < 90
        b.style.setProperty('--mx', perto ? `${(dx * 0.3).toFixed(1)}px` : '0px')
        b.style.setProperty('--my', perto ? `${(dy * 0.3).toFixed(1)}px` : '0px')
      })
    })
  }, [])
  const sair = useCallback((e: PointerEvent<HTMLDivElement>) => {
    cancelAnimationFrame(quadro.current)
    const el = e.currentTarget
    for (const v of ['--px', '--py', '--gx', '--gy']) el.style.removeProperty(v)
    delete el.dataset.mouse
    el.querySelectorAll<HTMLElement>('[data-magnetico]').forEach((b) => {
      b.style.removeProperty('--mx')
      b.style.removeProperty('--my')
    })
  }, [])
  return { mover, sair }
}

/**
 * Janela de navegador com o endereço do site e o selo "No ar", e o site do café se montando e atendendo dentro dela.
 *
 * @param props.className classes de posição e visibilidade (o topo usa uma no PC e outra no celular).
 */
export function AnimacaoTrabalho({ className = '' }: { className?: string }) {
  const { animacao } = conteudoHome()
  const [inspecao, setInspecao] = useState<Inspecao | null>(null)
  const { volta, ref } = useVolta(inspecao !== null)
  const { mover, sair } = useInclinacao()
  // Esc fecha o inspetor.
  useEffect(() => {
    if (!inspecao) return
    const aoTeclar = (e: KeyboardEvent) => e.key === 'Escape' && setInspecao(null)
    window.addEventListener('keydown', aoTeclar)
    return () => window.removeEventListener('keydown', aoTeclar)
  }, [inspecao])
  const inspecionar = (e: MouseEvent<HTMLDivElement>) => {
    const vaga = (e.target as HTMLElement).closest<HTMLElement>('.a-vaga')
    const area = vaga?.dataset.area
    if (!vaga || !area || inspecao?.area === area) return setInspecao(null)
    const p = e.currentTarget.getBoundingClientRect()
    const v = vaga.getBoundingClientRect()
    setInspecao({
      area,
      x: ((v.left - p.left) / p.width) * 100, y: ((v.top - p.top) / p.height) * 100,
      l: (v.width / p.width) * 100, a: (v.height / p.height) * 100,
    })
  }
  const ficha = inspecao ? animacao.inspecao[inspecao.area as keyof typeof animacao.inspecao] : null
  return (
    <figure className={`anim ${className}`} aria-label={animacao.titulo}>
      <div className="moldura-navegador" onPointerMove={mover} onPointerLeave={sair}>
        <div className="barra-janela" aria-hidden="true">
          <i />
          <i />
          <i />
          <span className="anim-endereco">
            <svg viewBox="0 0 24 24"><path d="M7 11V8a5 5 0 0 1 10 0v3M5 11h14v10H5z" /></svg>
            {animacao.endereco}
          </span>
          <span className="anim-no-ar">{animacao.status}</span>
        </div>
        {/* Clique numa peça abre o inspetor; é um enfeite de ponteiro sobre uma cena decorativa (aria-hidden). */}
        <div ref={ref} className="anim-palco" data-inspecionando={inspecao ? '' : undefined} onClick={inspecionar}>
          <SiteDoCafe key={volta} foco={inspecao?.area ?? null} />
          {inspecao && ficha && (
            <div className="a-inspetor" aria-hidden="true"
              style={{ left: `${inspecao.x}%`, top: `${inspecao.y}%`, width: `${inspecao.l}%`, height: `${inspecao.a}%` }}>
              <span className="a-ficha" data-embaixo={inspecao.y < 22 || undefined} data-direita={inspecao.x > 45 || undefined}>
                <code>{ficha.codigo}</code>
                <span className="a-ficha-teste">✓ teste: {ficha.teste}</span>
              </span>
            </div>
          )}
          <span className="anim-dica" aria-hidden="true">
            <span className="anim-dica-mouse">{animacao.dica.mouse}</span>
            <span className="anim-dica-toque">{animacao.dica.toque}</span>
          </span>
        </div>
      </div>
      <figcaption className="mt-3 text-sm text-grafite">{animacao.legenda}</figcaption>
    </figure>
  )
}
