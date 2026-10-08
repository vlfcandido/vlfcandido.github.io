import { LINKEDIN } from '../visuais'
import { LinkExterno } from './LinkExterno'

/** Botão fixo no rodapé da tela, só no celular: o LinkedIn a um toque em qualquer ponto da página. */
export function LinkedinFixo() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-20 border-t border-linha bg-nevoa/95 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur sm:hidden">
      <LinkExterno
        href={LINKEDIN}
        className="block rounded-full bg-cobalto py-3 text-center text-[1.05rem] font-semibold text-nevoa"
      >
        Falar comigo no LinkedIn
      </LinkExterno>
    </div>
  )
}
