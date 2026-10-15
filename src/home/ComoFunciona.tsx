// Bloco 5: como funciona, em 5 passos, e a garantia escrita (30 dias de correção, decisão dele de 14/10/2026).
// No celular, lista compacta que divide a tela com as empresas; no PC, faixa de 5 colunas.
import { linkWhatsapp } from '../lib/whatsapp'
import { FRASES_MARCADAS, conteudoHome } from './conteudo'
import { partirNaFrase } from './lib/marcar'
import { Marcacao } from './Marcacao'

/** Quinto bloco da home: os passos numerados e a garantia. */
export function ComoFunciona() {
  const { como, passos, garantia, garantiaPlataforma } = conteudoHome()
  const g = partirNaFrase(garantia, FRASES_MARCADAS.garantia)
  return (
    <section id="como" className="secao">
      <h2 className="titulo-bloco alvo-secao"><span className="titulo-texto">{como.titulo}</span></h2>
      <ol className="mt-4 grid lg:mt-8 lg:grid-cols-5 lg:gap-x-6">
        {passos.map((p, i) => (
          <li key={p.titulo} className="passo grid grid-cols-[2rem_1fr] items-baseline gap-x-2 border-t border-linha py-2 lg:block lg:py-4">
            <span className="numero-passo text-2xl lg:text-4xl" aria-hidden="true">
              {i + 1}
            </span>
            <div className="lg:mt-4">
              <h3 className="text-base leading-snug font-semibold">{p.titulo}</h3>
              {/* No celular só o título: a 4ª tela divide espaço com as empresas (orçamento da §12). */}
              <p className="hidden text-sm text-grafite sm:block lg:mt-1">{p.texto}</p>
            </div>
          </li>
        ))}
      </ol>
      <p className="mt-4 rounded-[var(--raio-m)] border border-linha bg-folha p-4 text-base leading-relaxed sm:text-lg lg:mt-8 lg:p-6 lg:text-xl">
        {g ? (
          <>
            {g.antes}
            <Marcacao tipo="grifo">{g.marcado}</Marcacao>
            {g.depois}
          </>
        ) : (
          garantia
        )}
        {/* Frase à parte (Task 10): a retenção vale só no 99Freelas, não para quem chega pelo WhatsApp. */}
        <span className="mt-1 block text-sm text-grafite lg:text-base">{garantiaPlataforma}</span>
      </p>
      {/* 15/10/2026 (revisor, rodada 2): na parada de "Como funciona" no celular não havia WhatsApp à vista, e o
          flutuante cobria o texto de baixo. O passo 1 vira ação aqui, com a mensagem já pedindo o protótipo. */}
      <div className="mt-4 lg:mt-6">
      <a className="link-secundario toque" href={linkWhatsapp(como.mensagem)} target="_blank" rel="noopener">
        {como.cta}
        <span className="seta" aria-hidden="true">↗</span>
        <span className="sr-only"> (abre em nova aba)</span>
      </a>
      </div>
    </section>
  )
}
