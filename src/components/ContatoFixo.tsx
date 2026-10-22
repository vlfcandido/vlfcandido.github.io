// WhatsApp flutuante do site novo (14/10/2026). Antes: faixa fixa no pé da tela com "Chamar no WhatsApp" (até
// 09/10/2026, LinkedIn), que escondia quando o botão da abertura ou o do contato estavam à vista.
import { useEffect, useRef, useState } from 'react'
import { WHATSAPP } from '../lib/whatsapp'
import { IconeConversa } from './IconeConversa'

/**
 * Links de WhatsApp de conteúdo (o do cabeçalho, o do hero, o de #quem, o #contato-cta): enquanto um deles está de
 * fato visível, o flutuante sai, para nunca haver dois juntos. 14/10/2026 (medição da Task 9): antes observava as
 * seções inteiras (`#quem`, o rodapé) sem limiar, e o flutuante sumia quando a seção encostava 1 px na tela, muito
 * antes do botão dela aparecer; de y=2000 a 2600 a 390 px não havia nenhum WhatsApp ao alcance.
 */
const LINKS_WHATSAPP = 'a[href*="wa.me"]:not([data-flutuante])'

/** Fração do link que precisa estar na tela para contar como visível. */
const LIMIAR = 0.5

/** Folga, em px, em volta do botão para contar que ele está sobre uma linha de texto. */
const FOLGA_TEXTO = 4

/**
 * Diz se alguma linha de texto da página passa por baixo do botão (15/10/2026, revisor, rodada 2: na parada de
 * "Quem vai fazer o seu sistema" o botão cobria "…escala de"). Amostra 9 pontos do botão, pega o elemento logo abaixo
 * de cada um e confere as linhas de texto dele contra o retângulo do botão.
 *
 * @param botao o flutuante.
 * @returns `true` quando cobre texto.
 */
function cobreTexto(botao: HTMLElement): boolean {
  // Retângulo de repouso (sem o transform de quando está recolhido), para a decisão não oscilar na borda do texto.
  const cs = getComputedStyle(botao)
  const w = botao.offsetWidth, h = botao.offsetHeight
  if (!w) return false
  const direita = window.innerWidth - parseFloat(cs.right), fundo = window.innerHeight - parseFloat(cs.bottom)
  const r = { left: direita - w, top: fundo - h, right: direita, bottom: fundo, width: w, height: h }
  const caixa = { l: r.left - FOLGA_TEXTO, t: r.top - FOLGA_TEXTO, r: r.right + FOLGA_TEXTO, b: r.bottom + FOLGA_TEXTO }
  const vistos = new Set<Element>()
  for (const fx of [0.15, 0.5, 0.85]) {
    for (const fy of [0.15, 0.5, 0.85]) {
      const el = document.elementsFromPoint(r.left + r.width * fx, r.top + r.height * fy).find((e) => !botao.contains(e))
      if (!el || vistos.has(el) || el === document.documentElement || el === document.body) continue
      vistos.add(el)
      const andador = document.createTreeWalker(el, NodeFilter.SHOW_TEXT)
      let n = 0
      for (let t = andador.nextNode(); t && n < 400; t = andador.nextNode(), n++) {
        if (!t.textContent?.trim()) continue
        // Texto só para leitor de tela (sr-only, recortado em 1 px) não aparece: não conta como coberto. 22/10/2026: o
        // nome das empresas da Trajetória escondia o botão na parada dos Destaques, sem nada visível embaixo.
        if (t.parentElement?.closest('.sr-only')) continue
        const faixa = document.createRange()
        faixa.selectNodeContents(t)
        for (const q of faixa.getClientRects()) {
          if (q.width && q.left < caixa.r && q.right > caixa.l && q.top < caixa.b && q.bottom > caixa.t) return true
        }
      }
    }
  }
  return false
}

/**
 * Diz se a home está parada numa das paradas da rolagem do celular (o topo, o começo de cada seção com encaixe ou o
 * fim), que é onde a pessoa lê a tela inteira. Só ali o botão sai de cima do texto; no meio do caminho ele fica à
 * mão (regra do site: o contato sempre ao alcance, medida pelo check 8 do medir_site.py).
 *
 * @returns `true` quando a rolagem está a até 4 px de uma parada.
 */
function emParada(): boolean {
  const secoes = [...document.querySelectorAll<HTMLElement>('.home > .secao')].filter(
    (el) => getComputedStyle(el).scrollSnapAlign !== 'none',
  )
  if (!secoes.length) return false
  const fim = document.documentElement.scrollHeight - window.innerHeight
  const paradas = [0, fim, ...secoes.map((el) => Math.round(el.getBoundingClientRect().top + window.scrollY))]
  return paradas.some((p) => Math.abs(p - window.scrollY) <= 4)
}

/** Quanto dura o anel de sucesso depois do toque (igual a --mov-lento). */
const ANEL_MS = 400

/**
 * Círculo de 56 px com o WhatsApp no canto inferior direito, só no celular (no tablet e no PC o cabeçalho
 * acompanha a rolagem com o próprio botão). Some só enquanto outro link de WhatsApp está de fato visível (metade
 * dele ou mais na tela), para nunca haver dois juntos; no resto da página, inclusive sobre o rodapé, fica à mão.
 *
 * @param props.pagina página efetiva (início, projetos ou o slug do case aberto): a cada troca, a lista do que
 *   observar é refeita, porque o DOM é outro. Antes era só a rota, e galeria e case têm a mesma rota.
 */
export function ContatoFixo({ pagina }: { pagina: string }) {
  const [semOutroLink, setSemOutroLink] = useState(false)
  const [sobreTexto, setSobreTexto] = useState(false)
  const [enviado, setEnviado] = useState(false)
  const timer = useRef(0)
  const botao = useRef<HTMLAnchorElement>(null)
  const visivel = semOutroLink && !sobreTexto

  // Numa parada da home, sobre uma linha de texto, o botão sai do caminho (só no celular, onde aparece). 15/10/2026,
  // revisor, rodada 2: na parada de "Como funciona" ele cobria "…escala de" do bloco seguinte.
  useEffect(() => {
    let quadro = 0
    const medir = () => {
      quadro = 0
      const b = botao.current
      if (!b || getComputedStyle(b).display === 'none') return setSobreTexto(false)
      setSobreTexto(emParada() && cobreTexto(b))
    }
    const agendar = () => {
      if (!quadro) quadro = requestAnimationFrame(medir)
    }
    agendar()
    window.addEventListener('scroll', agendar, { passive: true })
    window.addEventListener('resize', agendar)
    return () => {
      cancelAnimationFrame(quadro)
      window.removeEventListener('scroll', agendar)
      window.removeEventListener('resize', agendar)
    }
  }, [pagina])

  useEffect(() => {
    const alvos = [...document.querySelectorAll(LINKS_WHATSAPP)]
    if (!('IntersectionObserver' in window)) {
      setSemOutroLink(true)
      return
    }
    const naTela = new Set<Element>()
    const obs = new IntersectionObserver((entradas) => {
      for (const e of entradas) {
        if (e.isIntersecting && e.intersectionRatio >= LIMIAR) naTela.add(e.target)
        else naTela.delete(e.target)
      }
      setSemOutroLink(naTela.size === 0)
    }, { threshold: [0, LIMIAR] })
    alvos.forEach((el) => obs.observe(el))
    return () => obs.disconnect()
  }, [pagina])

  useEffect(() => () => window.clearTimeout(timer.current), [])

  /** Microanimação de sucesso: o anel sai do botão quando a conversa abre. */
  function aoTocar() {
    setEnviado(true)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setEnviado(false), ANEL_MS)
  }

  return (
    <a
      href={WHATSAPP}
      target="_blank"
      rel="noopener"
      ref={botao}
      onClick={aoTocar}
      data-flutuante=""
      data-visivel={visivel}
      data-enviado={enviado}
      aria-hidden={!visivel}
      tabIndex={visivel ? undefined : -1}
      className="flutuante"
    >
      <IconeConversa tamanho={28} />
      <span className="sr-only">Conversar no WhatsApp (abre em nova aba)</span>
    </a>
  )
}
