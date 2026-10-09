import { useEffect, useState } from 'react'
import { WHATSAPP } from '../lib/whatsapp'
import { IconeConversa } from './IconeConversa'
import { LinkExterno } from './LinkExterno'

/** Botões de contato que, quando estão na tela, dispensam o fixo (para nunca haver dois juntos). */
const ALVOS = ['cta-principal', 'contato-cta']

/**
 * Botão fixo no rodapé da tela, só no celular: o WhatsApp a um toque em qualquer ponto da página.
 * Some enquanto o botão da abertura ou o do contato está à vista, para não haver dois juntos.
 * Antes (até 09/10/2026) era o LinkedIn, no mesmo lugar e com o mesmo comportamento.
 */
export function ContatoFixo({ rota }: { rota: string }) {
  const [visivel, setVisivel] = useState(true)

  useEffect(() => {
    const alvos = ALVOS.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => Boolean(el))
    if (alvos.length === 0 || typeof IntersectionObserver === 'undefined') {
      setVisivel(true)
      return
    }
    const naTela = new Set<Element>()
    const obs = new IntersectionObserver((entradas) => {
      for (const e of entradas) {
        if (e.isIntersecting) naTela.add(e.target)
        else naTela.delete(e.target)
      }
      setVisivel(naTela.size === 0)
    })
    alvos.forEach((el) => obs.observe(el))
    return () => obs.disconnect()
  }, [rota])

  return (
    <div
      aria-hidden={!visivel}
      inert={!visivel}
      className={`fixed inset-x-0 bottom-0 z-20 border-t border-linha bg-nevoa/95 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur transition-transform duration-300 motion-reduce:transition-none sm:hidden ${
        visivel ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <LinkExterno
        href={WHATSAPP}
        className="botao-acao flex items-center justify-center gap-2.5 rounded-full bg-cobalto py-3 text-[1.05rem] font-semibold text-nevoa"
      >
        <IconeConversa />
        Chamar no WhatsApp
      </LinkExterno>
    </div>
  )
}
