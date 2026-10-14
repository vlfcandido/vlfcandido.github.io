// Home nova (14/10/2026): prova → protótipo antes de fechar → onde já trabalhei → todos os projetos →
// como funciona → quem sou e chamada. Antes: abertura Maré com 12 seções (ver git log deste arquivo).
import { ComoFunciona } from '../home/ComoFunciona'
import { Empresas } from '../home/Empresas'
import { Galeria } from '../home/Galeria'
import { Promessa } from '../home/Promessa'
import { Prototipo } from '../home/Prototipo'
import { QuemSou } from '../home/QuemSou'

/** Página principal: só compõe os 6 blocos, na ordem da spec. */
export function PaginaInicio() {
  return (
    <>
      <Promessa />
      <Prototipo />
      <Empresas />
      <Galeria />
      <ComoFunciona />
      <QuemSou />
    </>
  )
}
