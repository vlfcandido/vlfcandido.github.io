import { useEffect, useState } from 'react'
import { LINKEDIN } from '../visuais'
import { LinkExterno } from './LinkExterno'

/**
 * Botão fixo no rodapé da tela, só no celular: o LinkedIn a um toque em qualquer ponto da página.
 * Na principal, só aparece depois que o botão da abertura sai da tela, para não haver dois juntos.
 */
export function LinkedinFixo({ rota }: { rota: string }) {
  const [visivel, setVisivel] = useState(true)

  useEffect(() => {
    const alvo = document.getElementById('cta-principal')
    if (!alvo || typeof IntersectionObserver === 'undefined') {
      setVisivel(true)
      return
    }
    const obs = new IntersectionObserver(([e]) => setVisivel(!e.isIntersecting))
    obs.observe(alvo)
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
        href={LINKEDIN}
        className="botao-acao block rounded-full bg-cobalto py-3 text-center text-[1.05rem] font-semibold text-nevoa"
      >
        Falar comigo no LinkedIn
      </LinkExterno>
    </div>
  )
}
