import { empresasDiretas, gruposClientes, logosAbertura, textoMaisEmpresas, type Cliente } from '../clientes'
import { links, perfil, type CenaDemo } from '../conteudo'
import { WHATSAPP } from '../lib/whatsapp'
import { LINKEDIN } from '../visuais'
import { Demonstracao } from './Demonstracao'
import { IconeConversa } from './IconeConversa'
import { LinkExterno } from './LinkExterno'
import { Logo } from './Logo'
import { CartaNautica } from './CartaNautica'

const NOVENTA_E_NOVE = links.find((l) => l.rotulo === '99Freelas')

const CLIENTES: Cliente[] = gruposClientes.flatMap((g) => g.clientes)
const POR_SLUG = new Map<string, Cliente>([...CLIENTES, ...empresasDiretas].map((c) => [c.slug, c]))
/** As 6 logos da abertura (M4, 08/10/2026): as primeiras de `selecaoLogos`. */
const LOGOS_ABERTURA = logosAbertura.map((s) => POR_SLUG.get(s)).filter((c): c is Cliente => Boolean(c))

interface PropsAbertura {
  ramo: string
  aoEscolherRamo: (id: string) => void
  cena: CenaDemo['id']
  aoTrocarCena: (id: CenaDemo['id']) => void
}

/**
 * Abertura: a frase de posicionamento, o que eu entrego, o botão do WhatsApp (LinkedIn e 99Freelas como links) e, logo abaixo dos botões,
 * seis logos de projetos que liderei (prova de escala na 1ª tela do celular) com a âncora para as provas.
 */
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
          {/* Hierarquia desde 09/10/2026: WhatsApp é o botão (cliente de pequeno negócio conversa por lá);
              LinkedIn e 99Freelas viram links ao lado. Antes, o botão era "Falar comigo no LinkedIn". */}
          <div id="cta-principal" className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
            <LinkExterno
              href={WHATSAPP}
              className="botao-acao inline-flex items-center gap-2.5 rounded-full bg-cobalto py-3.5 pr-6 pl-5 text-[1.05rem] font-semibold text-nevoa hover:bg-cobalto-forte sm:py-4 sm:pr-7 sm:pl-6 sm:text-[1.1rem]"
            >
              <IconeConversa tamanho={22} />
              Chamar no WhatsApp
            </LinkExterno>
            <span className="flex flex-wrap items-center gap-x-5 gap-y-2">
              <LinkExterno href={LINKEDIN} className="sublinha font-medium">
                LinkedIn
              </LinkExterno>
              {NOVENTA_E_NOVE && (
                <LinkExterno href={NOVENTA_E_NOVE.url} className="sublinha font-medium">
                  Contratar pelo 99Freelas
                </LinkExterno>
              )}
            </span>
          </div>
          <div className="mt-7 sm:mt-9">
            <p className="text-[0.92rem] text-grafite">Projetos que liderei para</p>
            <ul aria-label="Projetos que liderei para" className="mt-2 grid max-w-[24rem] grid-cols-3 gap-x-6 gap-y-2">
              {LOGOS_ABERTURA.map((c) => (
                <li key={c.slug} className="flex h-12 items-center">
                  <Logo cliente={c} className="max-h-10 max-w-[86%]" />
                </li>
              ))}
            </ul>
            <a href="#resultados" className="sublinha mt-2 inline-block text-[0.95rem] font-medium text-grafite hover:text-tinta">
              {textoMaisEmpresas(CLIENTES.length)}
            </a>
          </div>
        </div>
        <div className="lg:col-span-5">
          <Demonstracao ramo={ramo} aoEscolher={aoEscolherRamo} cena={cena} aoTrocarCena={aoTrocarCena} />
        </div>
      </div>
    </section>
  )
}
