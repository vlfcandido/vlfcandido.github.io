import { links, perfil, type CenaDemo } from '../conteudo'
import { LINKEDIN } from '../visuais'
import { Demonstracao } from './Demonstracao'
import { LinkExterno } from './LinkExterno'
import { CartaNautica } from './CartaNautica'

const NOVENTA_E_NOVE = links.find((l) => l.rotulo === '99Freelas')

interface PropsAbertura {
  ramo: string
  aoEscolherRamo: (id: string) => void
  cena: CenaDemo['id']
  aoTrocarCena: (id: CenaDemo['id']) => void
}

/** Abertura: a frase de posicionamento, o que eu entrego e o botão do LinkedIn. */
export function Abertura({ ramo, aoEscolherRamo, cena, aoTrocarCena }: PropsAbertura) {
  return (
    <section id="inicio" aria-labelledby="inicio-titulo" className="relative isolate overflow-x-clip bg-nevoa scroll-mt-24 pt-7 pb-10 sm:pt-14 lg:pt-16 lg:pb-20">
      <CartaNautica
        versao="baleia"
        prioridade
        sizes="(min-width: 1024px) 70vw, 130vw"
        className="carta-abertura pointer-events-none absolute top-0 right-0 -z-10 hidden h-full w-[72%] lg:block"
      />
      <div className="grid items-center gap-8 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-7">
          <p className="text-[0.95rem] text-grafite sm:text-[1.05rem]">
            <span className="max-sm:hidden">{perfil.nome}, </span>
            <span className="sm:hidden">{perfil.titulo}</span>
            <span className="max-sm:hidden">{perfil.titulo.toLowerCase()}</span>
          </p>
          <h1
            id="inicio-titulo"
            className="mt-3 text-[2.05rem] leading-[1.1] font-[660] tracking-[0em] text-balance sm:text-[3rem] xl:text-[3.6rem]"
          >
            {perfil.chamada}
          </h1>
          <p className="prosa mt-4 max-w-[46ch] text-[1.12rem] text-grafite sm:mt-6 sm:text-[1.3rem]">{perfil.linha}</p>
          <div id="cta-principal" className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
            <LinkExterno
              href={LINKEDIN}
              className="botao-acao rounded-full bg-cobalto px-6 py-3.5 text-[1.05rem] sm:px-7 sm:py-4 sm:text-[1.1rem] font-semibold text-nevoa hover:bg-cobalto-forte"
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
          <Demonstracao ramo={ramo} aoEscolher={aoEscolherRamo} cena={cena} aoTrocarCena={aoTrocarCena} />
        </div>
      </div>
    </section>
  )
}
