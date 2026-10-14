// Parte um texto no trecho que leva a marcação à mão. Puro, para o teste conferir que todo trecho existe.

/** Texto partido em volta do trecho marcado. */
export interface TextoMarcado { antes: string; marcado: string; depois: string }

/**
 * Parte `texto` na primeira ocorrência de `frase`.
 *
 * @param texto o texto inteiro (título, garantia...).
 * @param frase o trecho que recebe a marcação.
 * @returns as três partes, ou `null` quando o trecho não está no texto (o componente mostra o texto sem marca).
 */
export function partirNaFrase(texto: string, frase: string): TextoMarcado | null {
  const i = frase ? texto.indexOf(frase) : -1
  if (i < 0) return null
  return { antes: texto.slice(0, i), marcado: frase, depois: texto.slice(i + frase.length) }
}
