import { Abertura } from '../components/Abertura'
import { ComoFunciona } from '../components/ComoFunciona'
import { Contato } from '../components/Contato'
import { Imprensa } from '../components/Imprensa'
import { Prova } from '../components/Prova'
import { Resolvo } from '../components/Resolvo'

/** Página principal, curta e comercial: o que resolvo, prova, como funciona, imprensa e contato. */
export function PaginaInicio() {
  return (
    <>
      <Abertura />
      <Resolvo />
      <Prova />
      <ComoFunciona />
      <Imprensa />
      <Contato />
    </>
  )
}
