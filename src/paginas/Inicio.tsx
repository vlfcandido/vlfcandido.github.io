// Home nova (14/10/2026), com orçamento de rolagem (spec §12): no celular, uma tela por papel (prova →
// protótipo → trabalhos → empresas e passos → quem sou); no PC, 4 telas com blocos lado a lado (o CSS de
// home.css arruma por área). Antes: abertura Maré com 12 seções (ver git log deste arquivo).
import { ComoFunciona } from '../home/ComoFunciona'
import { Empresas } from '../home/Empresas'
import { Promessa } from '../home/Promessa'
import { Prototipo } from '../home/Prototipo'
import { QuemSou } from '../home/QuemSou'
import { Trabalhos } from '../home/Trabalhos'
import { useParadaPorTela } from '../home/useParadaPorTela'

/** Página principal: só compõe os 6 blocos, na ordem de leitura do celular. */
export function PaginaInicio() {
  // Celular: depois de um toque, a página assenta no começo de uma tela (fix final, 14/10/2026).
  useParadaPorTela()
  return (
    <div className="home">
      <Promessa />
      <Prototipo />
      <Trabalhos />
      <Empresas />
      <ComoFunciona />
      <QuemSou />
    </div>
  )
}
