/** Páginas do site. A rota vive no hash para funcionar no GitHub Pages sem configuração de servidor. */
export type Rota = 'inicio' | 'projetos'

/** Hash que abre a página de projetos. */
export const HASH_PROJETOS = '#/projetos'

/**
 * Descobre a página a partir do hash da URL.
 *
 * @param hash valor de `location.hash` (ex.: `#/projetos`, `#como-funciona`, vazio).
 * @returns `projetos` para `#/projetos` e qualquer subcaminho; `inicio` para o resto, inclusive âncoras.
 */
export function rotaDoHash(hash: string): Rota {
  return hash === HASH_PROJETOS || hash.startsWith(`${HASH_PROJETOS}/`) ? 'projetos' : 'inicio'
}
