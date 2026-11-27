// Home nova (14/10/2026), com orçamento de rolagem (spec §12): no celular, uma tela por papel (prova → IA e agentes →
// vitrine → projetos → lojas virtuais → empresas → passos → quem sou); no PC, blocos lado a lado (o CSS de
// home.css arruma por área).
// 18/10/2026: a seção de IA e agentes entrou logo depois da prova e a vitrine das nove peças tomou o lugar do bloco
// de protótipo, que mostrava uma peça só; o argumento "veja antes de fechar" vive na abertura dela.
// 23/10/2026: o bloco de lojas virtuais entra depois dos projetos, com a mesa de diagnóstico do case loja-virtual.
// 23/11/2026 (dono): home enxuta em cinco blocos — prova, criativos, vitrine, empresas e quem sou. IA e agentes,
// lojas virtuais, como funciona e a lista de projetos saem da home; as páginas delas continuam nas rotas próprias.
// 26/11/2026 (home por demanda): o mural "O que você precisa" entra logo abaixo da abertura e os depoimentos do
// 99Freelas ocupam, no PC, as duas colunas que ficavam vazias ao lado do "Quem vai fazer o seu sistema".
import { Criativos } from '../home/Criativos'
import { Depoimentos } from '../home/Depoimentos'
import { Empresas } from '../home/Empresas'
import { Mural } from '../home/Mural'
import { Promessa } from '../home/Promessa'
import { QuemSou } from '../home/QuemSou'
import { Vitrine } from '../home/Vitrine'

/** Página principal: só compõe os blocos, na ordem de leitura do celular. */
export function PaginaInicio() {
  // 22/10/2026: sem a parada por tela no celular (useParadaPorTela). As seções passaram de uma tela (a de IA tem
  // 2061 px em 844) e o salto depois do toque levava para o começo da seção no meio da leitura.
  return (
    <div className="home">
      <Promessa />
      <Mural />
      <Criativos />
      <Vitrine />
      <Empresas />
      <Depoimentos />
      <QuemSou />
    </div>
  )
}
