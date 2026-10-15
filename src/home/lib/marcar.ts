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

/** Um pedaço do texto: marcado ou não. */
export interface Pedaco { texto: string; marcado: boolean }

/**
 * Parte `texto` em vários trechos marcados, na ordem em que aparecem (ex.: "Sicoob" e "Serasa Experian" no título
 * da prova, fix final de 14/10/2026, quando o título deixou de ter as duas empresas juntas).
 *
 * @param texto o texto inteiro.
 * @param frases os trechos que recebem a marcação, cada um procurado depois do anterior.
 * @returns os pedaços em ordem, ou `null` quando algum trecho falta (o componente mostra o texto sem marca).
 */
export function partirNasFrases(texto: string, frases: readonly string[]): Pedaco[] | null {
  const pedacos: Pedaco[] = []
  let resto = texto
  for (const frase of frases) {
    const p = partirNaFrase(resto, frase)
    if (!p) return null
    if (p.antes) pedacos.push({ texto: p.antes, marcado: false })
    pedacos.push({ texto: p.marcado, marcado: true })
    resto = p.depois
  }
  if (resto) pedacos.push({ texto: resto, marcado: false })
  return pedacos
}
