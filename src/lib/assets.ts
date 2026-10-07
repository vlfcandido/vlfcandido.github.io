/**
 * Junta a base pública do site com um caminho relativo de `public/`, sem barra dupla.
 *
 * @param base valor de `import.meta.env.BASE_URL` (ex.: `/`, `/portfolio-site/`).
 * @param relativo caminho dentro de `public/` (ex.: `prints/x.png`).
 * @returns URL pronta para usar em `src` ou `href`.
 */
export function caminhoPublico(base: string, relativo: string): string {
  return `${base.replace(/\/+$/, '')}/${relativo.replace(/^\/+/, '')}`
}
