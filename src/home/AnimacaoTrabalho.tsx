// Animação do topo (21/10/2026, pedido dele: o print grande da vitrine era "desperdício de espaço"). Uma cena só, numa
// janela de navegador: o site de um café fictício se monta peça por peça e ganha vida com a automação do WhatsApp (o
// cursor clica em "Fazer pedido", o agente de IA atende, o Pix confirma e chega o aviso de pedido novo). O movimento é
// todo CSS (home.css, bloco .anim); aqui ficam a estrutura e o laço. No celular, a cena tem layout próprio (container
// query no palco). Com reduced-motion fica o quadro final, parado. Antes: 3 cenas com abas (site, agentes, testes).
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { conteudoHome } from './conteudo'

/**
 * Duração de uma volta, em ms. Coreografia em batidas (21/10/2026, pedido dele: "as coisas acontecerem mais juntas"):
 * montagem até 1,9 s, clique a 2,4 s, conversa de 2,5 a 5,0 s, confirmação a 5,0 s, quadro pronto e saída suave a 8,2 s.
 */
const VOLTA = 8600

/** Em que segundo cada mensagem da conversa chega (as da loja mostram "digitando" 0,7 s antes). */
const TEMPOS_CONVERSA = [2.5, 3.5, 4.1, 5.0]

/**
 * Reinicia a cena a cada volta enquanto ela está visível; parada (reduced-motion ou fora da tela), não reinicia.
 *
 * @returns o número da volta (vira `key` para a cena remontar) e o ref do palco.
 */
function useVolta() {
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
    if (!visivel || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = window.setTimeout(() => setVolta((v) => v + 1), VOLTA)
    return () => window.clearTimeout(id)
  }, [visivel, volta])
  return { volta, ref }
}

/**
 * Uma peça do site: a vaga tracejada aparece primeiro e a peça chega de fora, encaixa com mola e as guias de
 * alinhamento piscam no encaixe.
 *
 * @param props.area área da grade (grid-template-areas da cena) e sufixo da classe da peça.
 * @param props.quando segundo em que a peça começa a chegar (as batidas estão no comentário de VOLTA).
 * @param props.de de onde a peça vem, em % do próprio tamanho, e o giro inicial.
 */
function Peca({ area, quando, de, children }: { area: string; quando: number; de: [number, number, number]; children: ReactNode }) {
  const [dx, dy, giro] = de
  const estilo = { gridArea: area, ['--q' as string]: `${quando}s`, ['--dx' as string]: `${dx}%`, ['--dy' as string]: `${dy}%`, ['--giro' as string]: `${giro}deg` }
  return (
    <div className="a-vaga" style={estilo}>
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

/** O site do café: as peças, a conversa no celular, o cursor e o aviso de pedido novo. */
function SiteDoCafe() {
  const { site } = conteudoHome().animacao
  return (
    <div className="anim-site" aria-hidden="true">
      <Peca area="menu" quando={0.25} de={[0, -70, 0]}>
        <b className="a-marca"><i className="a-logo" />{site.marca}</b>
        <span className="a-links">{site.menu.map((m) => <span key={m}>{m}</span>)}</span>
        <span className="a-acao">{site.acao}</span>
        <span className="a-hamburguer"><i /><i /><i /></span>
      </Peca>
      <Peca area="aberto" quando={0.6} de={[-40, 0, -3]}>
        <span className="a-aberto-selo"><i />{site.selo}</span>
      </Peca>
      <Peca area="titulo" quando={0.68} de={[-30, 10, -2]}>
        <p className="a-h">{site.titulo}</p>
      </Peca>
      <Peca area="texto" quando={0.76} de={[-30, 20, 2]}>
        <p className="a-p">{site.texto}</p>
      </Peca>
      <Peca area="botoes" quando={0.84} de={[-20, 60, -4]}>
        <span className="a-btn a-btn1">
          {site.botoes[0]}
          <svg className="a-cursor" viewBox="0 0 24 24">
            <path d="M4 2 L4 19 L8.5 14.8 L11.6 21.5 L14.4 20.2 L11.3 13.7 L17.5 13.7 Z" />
          </svg>
        </span>
        <span className="a-btn a-btn2">{site.botoes[1]}</span>
      </Peca>
      <Peca area="prova" quando={0.92} de={[-20, 60, 3]}>
        <span className="a-rostos"><i /><i /><i /></span>
        <span className="a-estrelas">★★★★★</span>
        <span className="a-prova">{site.prova}</span>
        <span className="a-pedidos">
          <span className="a-num"><span>{site.pedidos.antes}</span><span>{site.pedidos.depois}</span></span>
          {site.pedidos.rotulo}
        </span>
      </Peca>
      <Peca area="celular" quando={0.35} de={[40, -20, 5]}>
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
        <Peca key={c.titulo} area={`c${k + 1}`} quando={1.15 + k * 0.08} de={[(k - 1) * 25, 60, (k - 1) * 4]}>
          <svg className={`a-icone a-icone-${c.icone}`} viewBox="0 0 24 24">{ICONES[c.icone]}</svg>
          <span className="a-cartao-texto"><b>{c.titulo}</b><span>{c.texto}</span></span>
        </Peca>
      ))}
      <span className="a-aviso"><i />{site.aviso}</span>
    </div>
  )
}

/**
 * Janela de navegador com o endereço do site e o selo "No ar", e o site do café se montando e atendendo dentro dela.
 *
 * @param props.className classes de posição e visibilidade (o topo usa uma no PC e outra no celular).
 */
export function AnimacaoTrabalho({ className = '' }: { className?: string }) {
  const { animacao } = conteudoHome()
  const { volta, ref } = useVolta()
  return (
    <figure className={`anim ${className}`} aria-label={animacao.titulo}>
      <div className="moldura-navegador">
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
        <div ref={ref} className="anim-palco">
          <SiteDoCafe key={volta} />
        </div>
      </div>
      <figcaption className="mt-3 text-sm text-grafite">{animacao.legenda}</figcaption>
    </figure>
  )
}
