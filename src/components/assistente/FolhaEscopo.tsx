import { useState } from 'react'
import { ROTULO_TAMANHO, type EscopoPronto } from '../../chatbot/escopo'
import { TEXTOS } from '../../chatbot/textos'
import { oferta } from '../../conteudo'

/** Copia o texto; sem a API de área de transferência (http, navegador antigo), usa um campo escondido. */
async function copiar(texto: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(texto)
    return true
  } catch {
    const campo = document.createElement('textarea')
    campo.value = texto
    campo.setAttribute('readonly', '')
    campo.style.position = 'fixed'
    campo.style.opacity = '0'
    document.body.appendChild(campo)
    campo.select()
    const ok = document.execCommand('copy')
    campo.remove()
    return ok
  }
}

/** Lista de uma seção da folha. */
function Secao({ titulo, itens }: { titulo: string; itens: string[] }) {
  if (!itens.length) return null
  return (
    <section className="mt-3">
      <h4 className="font-titulo text-[0.82rem] font-semibold text-grafite">{titulo}</h4>
      <ul className="mt-1 space-y-1 text-[0.92rem] leading-snug">
        {itens.map((i) => (
          <li key={i} className="folha-item">
            {i}
          </li>
        ))}
      </ul>
    </section>
  )
}

/**
 * O escopo de 1 página como uma ficha de campo: o carimbo de rascunho, o que entra e o que fica fora, tamanho
 * e prazo de referência, e o botão de copiar com a instrução de colar no chat do 99.
 */
export function FolhaEscopo({ escopo }: { escopo: EscopoPronto }) {
  const [copiado, setCopiado] = useState(false)
  const titulo = oferta.find((o) => o.id === escopo.oferta)?.titulo

  async function aoCopiar() {
    if (await copiar(escopo.textoCopiavel)) {
      setCopiado(true)
      window.setTimeout(() => setCopiado(false), 2500)
    }
  }

  return (
    <article className="folha-escopo" aria-label="Rascunho do escopo do projeto">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-[1.15rem] leading-tight font-semibold">Escopo do projeto</h3>
        <span className="carimbo" aria-label="Rascunho, não é proposta">
          Rascunho
        </span>
      </div>
      <p className="mt-2 text-[0.95rem] leading-snug">{escopo.problema}</p>
      <Secao titulo="O que entra" itens={escopo.entra} />
      <Secao titulo="O que fica fora" itens={escopo.fora} />
      <Secao titulo="Perguntas em aberto" itens={escopo.perguntas} />
      <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 border-t border-linha pt-3 text-[0.9rem] leading-snug">
        <dt className="font-semibold text-grafite">Tamanho</dt>
        <dd>{ROTULO_TAMANHO[escopo.tamanho]}</dd>
        <dt className="font-semibold text-grafite">Prazo</dt>
        <dd>{escopo.prazo}</dd>
        {titulo && (
          <>
            <dt className="font-semibold text-grafite">Começo</dt>
            <dd>{titulo}</dd>
          </>
        )}
      </dl>
      <p className="mt-3 text-[0.85rem] text-grafite">O preço fechado e o prazo final vêm do Vinicius, depois que ele ler este rascunho.</p>
      <button type="button" onClick={aoCopiar} className="botao-acao mt-3 w-full rounded-full bg-cobalto py-2.5 font-semibold text-nevoa">
        {copiado ? TEXTOS.copiado : TEXTOS.copiar}
      </button>
      <p className="mt-2 text-center text-[0.85rem] text-grafite" aria-live="polite">
        {copiado ? `${TEXTOS.copiado}. ${TEXTOS.depoisDeCopiar}` : TEXTOS.depoisDeCopiar}
      </p>
    </article>
  )
}
