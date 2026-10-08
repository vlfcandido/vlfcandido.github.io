import { useSyncExternalStore } from 'react'

/** Até onde a página usa a composição de celular (o `lg` do Tailwind começa em 1024 px). */
const CONSULTA_CELULAR = '(max-width: 1023px)'

/** Assina as mudanças da consulta de mídia; devolve a função que cancela a assinatura. */
function assinar(avisar: () => void): () => void {
  const mq = window.matchMedia(CONSULTA_CELULAR)
  mq.addEventListener('change', avisar)
  return () => mq.removeEventListener('change', avisar)
}

/**
 * Diz se a tela está na composição de celular, acompanhando giros e redimensionamentos.
 * Só lê `window` dentro do hook, nunca ao importar o módulo.
 *
 * @returns `true` abaixo de 1024 px de largura.
 */
export function useCelular(): boolean {
  return useSyncExternalStore(
    assinar,
    () => window.matchMedia(CONSULTA_CELULAR).matches,
    () => false,
  )
}
