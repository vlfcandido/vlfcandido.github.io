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
  const [visivel, setVisivel] = useState(false)
  const [enviado, setEnviado] = useState(false)
  const timer = useRef(0)

  useEffect(() => {
    const alvos = [...document.querySelectorAll(LINKS_WHATSAPP)]
    if (!('IntersectionObserver' in window)) {
      setVisivel(true)
      return
    }
    const naTela = new Set<Element>()
    const obs = new IntersectionObserver((entradas) => {
      for (const e of entradas) {
        if (e.isIntersecting && e.intersectionRatio >= LIMIAR) naTela.add(e.target)
        else naTela.delete(e.target)
      }
      setVisivel(naTela.size === 0)
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
