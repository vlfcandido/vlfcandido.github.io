// Depoimentos do 99Freelas (26/11/2026). Ficam ao lado do "Quem vai fazer o seu sistema": no PC esse bloco ocupava
// só a coluna da direita e as duas da esquerda ficavam vazias. Frase copiada do perfil público, o tipo do projeto e
// o mês; nenhum nome de pessoa nem de empresa. A nota e o link para o perfil deixam o visitante conferir.
import { DEPOIMENTOS, PROVA_99, conteudoHome } from './conteudo'

/** Bloco de depoimentos da home: a nota do perfil, as frases dos clientes e o link para conferir no 99Freelas. */
export function Depoimentos() {
  const { depoimentos } = conteudoHome()
  return (
    <section id="depoimentos" aria-labelledby="depoimentos-titulo" className="secao depoimentos">
      <h2 id="depoimentos-titulo" className="titulo-bloco alvo-secao lg:!text-[1.75rem]">
        <span className="titulo-texto">{depoimentos.titulo}</span>
      </h2>
      <p className="depoimentos-nota">
        <span className="depoimentos-estrela" aria-hidden="true">★</span>
        <strong>{depoimentos.nota}</strong>
        <a className="depoimentos-link" href={PROVA_99.perfil} target="_blank" rel="noopener">
          {depoimentos.link}
          <span className="seta" aria-hidden="true">↗</span>
          <span className="sr-only"> (abre em nova aba)</span>
        </a>
      </p>
      <ul className="depoimentos-grade">
        {DEPOIMENTOS.map((d) => (
          <li key={d.projeto}>
            <figure className="depoimento">
              <blockquote>
                <p>{d.frase}</p>
              </blockquote>
              <figcaption>
                <span className="depoimento-projeto">{d.projeto}</span>
                <span className="depoimento-origem">99Freelas, {d.quando}</span>
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
      <p className="depoimentos-origem">{depoimentos.origem}</p>
    </section>
  )
}
