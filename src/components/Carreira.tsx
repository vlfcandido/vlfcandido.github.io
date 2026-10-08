import { useState } from 'react'
import { useCelular } from '../lib/tela'
import { Abas, idAba, idPainel } from './Abas'
import { Imprensa } from './Imprensa'
import { Trajetoria } from './Trajetoria'

const ABAS = [
  { id: 'trajetoria', rotulo: 'Onde trabalhei' },
  { id: 'imprensa', rotulo: 'Na imprensa' },
]

/**
 * Carreira, o nível mais fundo da principal. No computador, onde trabalhei na coluna larga e a
 * imprensa na estreita, lado a lado; no celular, as duas em abas, para não empilhar.
 */
export function Carreira() {
  const celular = useCelular()
  const [aba, setAba] = useState('trajetoria')
  if (!celular)
    return (
      <section id="carreira" aria-label="Carreira" className="secao grid scroll-mt-24 gap-14 border-t border-linha lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <Trajetoria />
        <Imprensa />
      </section>
    )
  return (
    <section id="carreira" aria-labelledby="carreira-titulo" className="secao scroll-mt-24 border-t border-linha">
      <h2 id="carreira-titulo" className="titulo-secao">
        Carreira
      </h2>
      <Abas
        base="carreira"
        rotulo="Carreira"
        ativa={aba}
        aoTrocar={setAba}
        abas={ABAS}
        className="mt-4 flex rounded-full border border-linha bg-folha p-1"
        classeAba={(marcada) => `chip flex-1 rounded-full px-3 py-2 text-[0.95rem] font-medium ${marcada ? 'bg-cobalto text-nevoa' : 'text-tinta'}`}
      />
      <div role="tabpanel" id={idPainel('carreira', 'trajetoria')} aria-labelledby={idAba('carreira', 'trajetoria')} hidden={aba !== 'trajetoria'} className="mt-5">
        <Trajetoria embutida />
      </div>
      <div role="tabpanel" id={idPainel('carreira', 'imprensa')} aria-labelledby={idAba('carreira', 'imprensa')} hidden={aba !== 'imprensa'} className="mt-5">
        <Imprensa embutida />
      </div>
    </section>
  )
}
