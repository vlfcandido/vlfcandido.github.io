// Home nova (14/10/2026), com orçamento de rolagem (spec §12): no celular, uma tela por papel (prova → IA e agentes →
// vitrine → projetos → empresas → passos → quem sou); no PC, blocos lado a lado (o CSS de home.css arruma por área).
// 18/10/2026: a seção de IA e agentes entrou logo depois da prova e a vitrine das nove peças tomou o lugar do bloco
// de protótipo, que mostrava uma peça só; o argumento "veja antes de fechar" vive na abertura dela.
import { ComoFunciona } from '../home/ComoFunciona'
import { Empresas } from '../home/Empresas'
import { Ia } from '../home/Ia'
import { Promessa } from '../home/Promessa'
import { QuemSou } from '../home/QuemSou'
import { Trabalhos } from '../home/Trabalhos'
import { Vitrine } from '../home/Vitrine'

/** Página principal: só compõe os blocos, na ordem de leitura do celular. */
export function PaginaInicio() {
  // 22/10/2026: sem a parada por tela no celular (useParadaPorTela). As seções passaram de uma tela (a de IA tem
  // 2061 px em 844) e o salto depois do toque levava para o começo da seção no meio da leitura.
  return (
    <div className="home">
      <Promessa />
      <Ia />
      <Vitrine />
      <Trabalhos />
      <Empresas />
      <ComoFunciona />
      <QuemSou />
    </div>
  )
}
