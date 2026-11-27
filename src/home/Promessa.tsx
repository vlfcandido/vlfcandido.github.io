// Bloco 1: a prova na frente. No celular, uma tela só com o que o cliente procura, a credencial, o WhatsApp e a
// prova do 99Freelas (a animação sai em 23/10/2026, decisão do dono); no PC, a animação do trabalho à direita.
// 26/11/2026 (home por demanda): o título abre pelo que o cliente procura (site, loja, sistema, CRM, IA), a carreira
// vira a linha de credencial logo abaixo e a faixa de números vira a prova do 99Freelas. A contagem animada dos
// números saiu com eles: "5,0" e "Talent" não contam de zero (antes: useContagemAoAssentar, 600 ms).
import { caminhoPublico } from '../lib/assets'
import { WHATSAPP } from '../lib/whatsapp'
import { LINKEDIN } from '../visuais'
import { empresasDiretas, type EmpresaDireta } from '../clientes'
import { logoClara } from '../components/Logo'
import { EVENTO_ABRIR_EMPRESA, FRASES_MARCADAS, MARCAS_TOPO, conteudoHome } from './conteudo'
import { partirNasFrases } from './lib/marcar'
import { AnimacaoTrabalho } from './AnimacaoTrabalho'
import { Marcacao } from './Marcacao'

// 21/10/2026: a Vitrine (print da Liga Várzea com o círculo de caneta, só no PC) saiu para a AnimacaoTrabalho.

/**
 * Faixa com as logos das três marcas do título (21/10/2026, pedido dele). Cada logo leva à trajetória; o nome vai
 * no texto alternativo, porque a faixa é o único lugar em que a logo aparece sem o nome ao lado.
 */
function FaixaMarcas() {
  const base = import.meta.env.BASE_URL
  const { empresas } = conteudoHome()
  const marcas = MARCAS_TOPO.map((slug) => empresasDiretas.find((e) => e.slug === slug)).filter(
    (e): e is EmpresaDireta & { logo: string } => Boolean(e?.logo),
  )
  return (
    <ul className="faixa-marcas" aria-label={empresas.faixa}>
      {marcas.map((e) => (
        <li key={e.slug}>
          {/* 22/10/2026: além de rolar até a Trajetória, abre a empresa clicada lá. */}
          <a className="toque" href="#empresas" onClick={() => window.dispatchEvent(new CustomEvent(EVENTO_ABRIR_EMPRESA, { detail: e.slug }))}>
            <img className="logo-empresa" data-slug={e.slug} data-clara={logoClara(e.slug)} src={caminhoPublico(base, e.logo)} alt={e.nome} height={28} decoding="async" />
          </a>
        </li>
      ))}
    </ul>
  )
}

/** Primeiro bloco da home: o que o cliente procura, a credencial, as marcas, o WhatsApp e a prova do 99Freelas. */
export function Promessa() {
  const { promessa } = conteudoHome()
  const credencial = partirNasFrases(promessa.credencial, FRASES_MARCADAS.promessa)
  return (
    <section id="inicio" className="secao promessa">
      <div className="promessa-texto">
        <h1 className="text-[2.5rem] leading-[1.08] font-semibold sm:text-6xl lg:text-[3.5rem] xl:text-6xl">{promessa.titulo}</h1>
        <p className="mt-3 max-w-xl text-lg text-grafite sm:text-xl">
          {credencial
            ? credencial.map((p, i) => (p.marcado ? <Marcacao key={i} tipo="grifo">{p.texto}</Marcacao> : p.texto))
            : promessa.credencial}
        </p>
        <FaixaMarcas />
        {/* 23/10/2026 (decisão do dono, home "muito gigante"): a animação saiu do celular, onde sozinha ocupava 531 px
            e empurrava a abertura para 1.056. Ela continua no PC, na coluna da direita. No celular ficam o título, a
            credencial, a faixa de marcas, o WhatsApp e a prova. */}
        {/* 23/10/2026 (decisão do dono): o LinkedIn volta para a abertura, ao lado do WhatsApp. */}
        <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2">
          <a className="cta toque" href={WHATSAPP} target="_blank" rel="noopener">
            {promessa.cta}
            <span className="seta" aria-hidden="true">→</span>
          </a>
          <a className="link-secundario toque" href={LINKEDIN} target="_blank" rel="noopener">
            LinkedIn
            <span className="seta" aria-hidden="true">↗</span>
          </a>
        </div>
        <ul className="prova-faixa mt-5 grid max-w-xl grid-cols-3 gap-4 sm:mt-8 sm:gap-8">
          {promessa.prova.map((i) => {
            const miolo = (
              <>
                <span className="prova-valor font-[family-name:var(--fonte-titulo)] text-[1.75rem] leading-none tabular-nums sm:text-5xl">{i.valor}</span>
                <span className="text-sm leading-snug text-grafite">{i.rotulo}</span>
              </>
            )
            return (
              <li key={i.rotulo} className="border-t border-linha">
                {i.href ? (
                  <a className="prova-item prova-link toque" href={i.href} target="_blank" rel="noopener">
                    {miolo}
                    <span className="sr-only"> (abre o perfil em nova aba)</span>
                  </a>
                ) : (
                  <span className="prova-item">{miolo}</span>
                )}
              </li>
            )
          })}
        </ul>
      </div>
      <AnimacaoTrabalho className="hidden lg:block" />
    </section>
  )
}
