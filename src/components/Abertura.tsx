import { links, perfil } from '../conteudo'
import { LINKEDIN } from '../visuais'
import { Demonstracao } from './Demonstracao'
import { LinkExterno } from './LinkExterno'
import { CartaNautica } from './CartaNautica'

const NOVENTA_E_NOVE = links.find((l) => l.rotulo === '99Freelas')

/** Abertura: a frase de posicionamento, o que eu entrego e o botão do LinkedIn. */
export function Abertura() {
  return (
    <section id="inicio" aria-labelledby="inicio-titulo" className="relative isolate overflow-x-clip bg-nevoa scroll-mt-24 pt-12 pb-20 sm:pt-20 lg:pb-28">
      <CartaNautica
        versao="baleia"
        prioridade
        sizes="(min-width: 1024px) 70vw, 130vw"
        className="carta-abertura pointer-events-none absolute right-0 bottom-0 -z-10 h-[50%] w-[150%] lg:top-0 lg:h-full lg:w-[72%]"
      />
      <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-7">
          <p className="text-[1.05rem] text-grafite">
            {perfil.nome}, {perfil.titulo.toLowerCase()}
          </p>
          <h1
            id="inicio-titulo"
            className="mt-4 text-[2.3rem] leading-[1.1] font-[660] tracking-[0em] text-balance sm:text-[3.2rem] xl:text-[3.9rem]"
          >
            {perfil.chamada}
          </h1>
          <p className="prosa mt-6 max-w-[46ch] text-[1.25rem] text-grafite sm:text-[1.35rem]">{perfil.linha}</p>
          <div id="cta-principal" className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
            <LinkExterno
              href={LINKEDIN}
              className="botao-acao rounded-full bg-cobalto px-7 py-4 text-[1.1rem] font-semibold text-nevoa hover:bg-cobalto-forte"
            >
              Falar comigo no LinkedIn
            </LinkExterno>
            {NOVENTA_E_NOVE && (
              <LinkExterno
                href={NOVENTA_E_NOVE.url}
                className="sublinha font-medium"
              >
                Contratar pelo 99Freelas
              </LinkExterno>
            )}
          </div>
        </div>
        <div className="lg:col-span-5">
          <Demonstracao />
        </div>
      </div>
    </section>
  )
}
