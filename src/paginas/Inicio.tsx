import { useState } from 'react'
import { Abertura } from '../components/Abertura'
import { Carreira } from '../components/Carreira'
import { ComoFunciona } from '../components/ComoFunciona'
import { ComoEntrega } from '../components/ComoEntrega'
import { Contato } from '../components/Contato'
import { Pacotes } from '../components/Pacotes'
import { Prova } from '../components/Prova'
import { Resolvo } from '../components/Resolvo'
import { cenaDaOferta, cenaDoRamo, inicioDemo, oferta, type CenaDemo, type Oferta } from '../conteudo'

/** Oferta sugerida para um ramo do seletor (a primeira, se o ramo não tiver sugestão). */
function ofertaDoRamo(ramo: string): Oferta['id'] {
  return (oferta.find((o) => o.ramos.includes(ramo)) ?? oferta[0]).id
}

/**
 * Página principal, curta e comercial, contando a história em 30 segundos, da superfície para o
 * fundo (a régua de profundidade marca cada nível): abertura, o que eu resolvo, provas, como
 * funciona, carreira e o contato. (Provas subiu para antes de Como funciona em 08/10/2026, M8.) A profundidade fica a um toque (sondar, abas, "Descer"), nunca
 * empilhada.
 *
 * A página guarda três escolhas ligadas: o ramo do "Qual é o seu negócio?", a oferta sondada na
 * carta e a cena da demonstração. Escolher o ramo leva à oferta e à cena dele; sondar uma oferta
 * leva a demonstração para a cena que combina.
 */
export function PaginaInicio() {
  // Abre em Clínica, mas na cena "Venda no CRM" e com a oferta de integração (M5, `inicioDemo`).
  const [ramo, setRamo] = useState(inicioDemo.ramo)
  const [ofertaAtiva, setOfertaAtiva] = useState<Oferta['id']>(inicioDemo.oferta)
  const [cena, setCena] = useState<CenaDemo['id']>(inicioDemo.cena)

  function escolherRamo(id: string) {
    setRamo(id)
    setOfertaAtiva(ofertaDoRamo(id))
    setCena(cenaDoRamo[id] ?? 'atendimento')
  }

  function sondarOferta(id: Oferta['id']) {
    setOfertaAtiva(id)
    setCena(cenaDaOferta[id])
  }

  return (
    <>
      <Abertura ramo={ramo} aoEscolherRamo={escolherRamo} cena={cena} aoTrocarCena={setCena} />
      <Resolvo ramo={ramo} ativa={ofertaAtiva} aoSondar={sondarOferta} />
      <Prova />
      <ComoFunciona />
      <ComoEntrega />
      <Pacotes />
      <Carreira />
      <Contato />
    </>
  )
}
