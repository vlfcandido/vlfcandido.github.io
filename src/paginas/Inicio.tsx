import { useState } from 'react'
import { Abertura } from '../components/Abertura'
import { ComoFunciona } from '../components/ComoFunciona'
import { Contato } from '../components/Contato'
import { Imprensa } from '../components/Imprensa'
import { SeparadorMare } from '../components/Mare'
import { Prova } from '../components/Prova'
import { Resolvo } from '../components/Resolvo'
import { Trajetoria } from '../components/Trajetoria'
import { ramosDemo } from '../conteudo'

/**
 * Página principal, curta e comercial: o que resolvo, como funciona, prova, onde trabalhei ao lado
 * da imprensa, e contato. O ramo escolhido na abertura ("Qual é o seu negócio?") fica aqui para
 * "O que eu resolvo" destacar a oferta que combina com ele.
 */
export function PaginaInicio() {
  const [ramo, setRamo] = useState(ramosDemo[0].id)
  return (
    <>
      <Abertura ramo={ramo} aoEscolherRamo={setRamo} />
      <Resolvo ramo={ramo} />
      <ComoFunciona />
      <SeparadorMare />
      <Prova />
      <div className="grid gap-16 border-t border-linha py-20 sm:py-28 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:gap-14">
        <Trajetoria />
        <Imprensa />
      </div>
      <Contato />
    </>
  )
}
