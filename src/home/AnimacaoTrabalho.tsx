// Animação do topo (21/10/2026, pedido dele: o print grande da vitrine era "desperdício de espaço"). Três cenas em
// sequência numa janela de navegador: o site saindo do rascunho, os agentes de IA dividindo um atendimento e os testes
// passando antes do "no ar". Só CSS para o movimento (home.css, bloco .anim); aqui fica a troca de cena.
// Cada cena remonta com `key` para a animação recomeçar; com reduced-motion o CSS mostra só o quadro final.
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { conteudoHome } from './conteudo'

/** Tempo de cada cena na tela, em ms, na ordem das cenas (o site monta e ganha vida em ~5,6 s). */
const DURACAO_CENAS = [7000, 4800, 4800]

/**
 * Avança as cenas sozinho enquanto a janela está visível, até a pessoa escolher uma cena.
 *
 * @param total número de cenas.
 * @returns a cena atual, o ref da janela e a função de escolher uma cena (que para o avanço automático).
 */
function useCenas(total: number) {
  const [atual, setAtual] = useState(0)
  const [automatico, setAutomatico] = useState(true)
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
    if (!automatico || !visivel || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = window.setTimeout(() => setAtual((i) => (i + 1) % total), DURACAO_CENAS[atual] ?? 4800)
    return () => window.clearTimeout(id)
  }, [automatico, visivel, total, atual])
  const escolher = (i: number) => {
    setAutomatico(false)
    setAtual(i)
  }
  return { atual, ref, escolher }
}

/**
 * Uma peça do site fictício: a vaga tracejada aparece primeiro e a peça chega de fora, encaixa com mola e as guias de
 * alinhamento piscam no encaixe.
 *
 * @param props.area área da grade (CSS grid-template-areas da cena).
 * @param props.ordem ordem de chegada (atrasos em home.css).
 * @param props.de de onde a peça vem, em % do próprio tamanho, e o giro inicial.
 */
function Peca({ area, ordem, de, children }: { area: string; ordem: number; de: [number, number, number]; children: ReactNode }) {
  const [dx, dy, giro] = de
  const estilo = { gridArea: area, ['--i' as string]: ordem, ['--dx' as string]: `${dx}%`, ['--dy' as string]: `${dy}%`, ['--giro' as string]: `${giro}deg` }
  return (
    <div className="a-vaga" style={estilo}>
      <div className={`a-peca a-${area}`}>{children}</div>
    </div>
  )
}

/** Ícones dos cartões do site fictício, em traço. */
const ICONES: Record<string, ReactNode> = {
  cardapio: <path d="M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3V4Zm4 5h6M9 12h6M9 15h4" />,
  pix: <path d="M12 3.5 20.5 12 12 20.5 3.5 12 12 3.5Zm-3.5 8.5h7" />,
  entrega: <path d="M6.5 17.5a2.5 2.5 0 1 0 0 .01M17.5 17.5a2.5 2.5 0 1 0 0 .01M6.5 17.5 10 9h4l3.5 8.5M10 9 8.5 6H6m8 3 1.5-3H18" />,
}

/**
 * Cena 1: a landing de um café fictício se monta peça por peça (cada caixa encaixa na sua vaga, com guias) e depois
 * ganha vida: o pedido chega no WhatsApp do celular e aparece o aviso de pedido novo. Quadro final: o site pronto.
 */
function CenaSite() {
  const { site } = conteudoHome().animacao
  return (
    <div className="anim-site" aria-hidden="true">
      <Peca area="menu" ordem={0} de={[0, -180, 0]}>
        <b className="a-marca"><i className="a-logo" />{site.marca}</b>
        <span className="a-links">{site.menu.map((m) => <span key={m}>{m}</span>)}</span>
        <span className="a-acao">{site.acao}</span>
      </Peca>
      <Peca area="aberto" ordem={1} de={[-140, -40, -5]}>
        <span className="a-selo-site"><i />{site.selo}</span>
      </Peca>
      <Peca area="titulo" ordem={2} de={[-120, 20, -3]}>
        <p className="a-h">{site.titulo}</p>
      </Peca>
      <Peca area="texto" ordem={3} de={[-150, 60, 3]}>
        <p className="a-p">{site.texto}</p>
      </Peca>
      <Peca area="botoes" ordem={4} de={[-60, 200, -6]}>
        <span className="a-btn">{site.botoes[0]}</span>
        <span className="a-btn a-btn2">{site.botoes[1]}</span>
      </Peca>
      <Peca area="prova" ordem={5} de={[-90, 240, 4]}>
        <span className="a-rostos"><i /><i /><i /></span>
        <span className="a-estrelas">★★★★★</span>
        <span className="a-prova">{site.prova}</span>
      </Peca>
      <Peca area="celular" ordem={6} de={[120, -30, 7]}>
        <span className="a-fone">
          <span className="a-fone-topo"><i />{site.marca}</span>
          <span className="a-conversa">
            {site.conversa.map((m, k) => (
              <span key={m.texto} className={`a-bolha a-${m.de}`} style={{ ['--k' as string]: k }}>{m.texto}</span>
            ))}
          </span>
        </span>
      </Peca>
      {site.cartoes.map((c, k) => (
        <Peca key={c.titulo} area={`c${k + 1}`} ordem={7 + k} de={[(k - 1) * 60, 170, (k - 1) * 6]}>
          <svg className="a-icone" viewBox="0 0 24 24">{ICONES[c.icone]}</svg>
          <span className="a-cartao-texto"><b>{c.titulo}</b><span>{c.texto}</span></span>
        </Peca>
      ))}
      <span className="a-aviso"><i />{site.aviso}</span>
    </div>
  )
}

/** Cena 2: a mensagem entra, o orquestrador passa para um especialista, o revisor confere e a resposta sai. */
function CenaAgentes() {
  const { agentes } = conteudoHome().animacao
  return (
    <div className="anim-agentes" aria-hidden="true">
      <p className="a-msg a-entrada">{agentes.entrada}</p>
      <i className="a-fio" style={{ ['--i' as string]: 0 }} />
      <p className="a-no a-ativo" style={{ ['--i' as string]: 1 }}>{agentes.orquestrador}</p>
      <i className="a-fio" style={{ ['--i' as string]: 1 }} />
      <div className="a-especialistas">
        {agentes.especialistas.map((nome, k) => (
          <p key={nome} className={k === 0 ? 'a-no a-ativo' : 'a-no'} style={{ ['--i' as string]: 2 }}>{nome}</p>
        ))}
      </div>
      <i className="a-fio" style={{ ['--i' as string]: 2 }} />
      <p className="a-no a-ativo" style={{ ['--i' as string]: 3 }}>{agentes.revisor} <span className="a-ok">✓</span></p>
      <i className="a-fio" style={{ ['--i' as string]: 3 }} />
      <p className="a-msg a-saida" style={{ ['--i' as string]: 4 }}>{agentes.saida}</p>
    </div>
  )
}

/** Cena 3: as linhas de teste passam uma a uma, o resumo fecha e o selo "No ar" carimba. */
function CenaTestes() {
  const { testes } = conteudoHome().animacao
  return (
    <div className="anim-testes" aria-hidden="true">
      <ul>
        {testes.linhas.map((l, k) => (
          <li key={l} style={{ ['--i' as string]: k }}><span className="a-ok">✓</span> {l}</li>
        ))}
      </ul>
      <p className="a-resumo" style={{ ['--i' as string]: testes.linhas.length }}>{testes.resumo}</p>
      <p className="a-selo">{testes.selo}</p>
    </div>
  )
}

const CENAS = { site: CenaSite, agentes: CenaAgentes, testes: CenaTestes } as const

/**
 * Janela com as três cenas e as abas para escolher uma; a legenda embaixo diz o que a cena mostra.
 *
 * @param props.className classes de posição e visibilidade (o topo usa uma no PC e outra no celular).
 */
export function AnimacaoTrabalho({ className = '' }: { className?: string }) {
  const { animacao } = conteudoHome()
  const { atual, ref, escolher } = useCenas(animacao.cenas.length)
  const cena = animacao.cenas[atual]
  const Cena = CENAS[cena.id as keyof typeof CENAS]
  return (
    <figure className={`anim ${className}`} aria-label={animacao.titulo}>
      <div ref={ref} className="moldura-navegador">
        <div className="barra-janela">
          <i aria-hidden="true" />
          <i aria-hidden="true" />
          <i aria-hidden="true" />
          <div className="anim-abas" role="group" aria-label="Escolher a cena">
            {animacao.cenas.map((c, i) => (
              <button key={c.id} type="button" className="anim-aba toque" aria-pressed={i === atual} onClick={() => escolher(i)}>
                {c.rotulo}
              </button>
            ))}
          </div>
        </div>
        <div className="anim-palco">
          <Cena key={`${cena.id}-${atual}`} />
        </div>
      </div>
      <figcaption className="mt-3 text-sm text-grafite">{cena.legenda}</figcaption>
    </figure>
  )
}
