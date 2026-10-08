import { Abertura } from '../components/Abertura'
import { ComoFunciona } from '../components/ComoFunciona'
import { Contato } from '../components/Contato'
import { Imprensa } from '../components/Imprensa'
import { SeparadorMare } from '../components/Mare'
import { Prova } from '../components/Prova'
import { Resolvo } from '../components/Resolvo'
import { Trajetoria } from '../components/Trajetoria'

/** Página principal, curta e comercial: o que resolvo, prova, onde trabalhei, como funciona, imprensa e contato. */
export function PaginaInicio() {
  return (
    <>
      <Abertura />
      <Resolvo />
      <Prova />
      <Trajetoria />
      <SeparadorMare />
      <ComoFunciona />
      <Imprensa />
      <Contato />
    </>
  )
}
