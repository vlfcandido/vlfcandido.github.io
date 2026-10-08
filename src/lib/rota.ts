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

/**
 * Âncoras de versões anteriores do site (links salvos, perfis e propostas antigas) e para onde
 * cada uma leva hoje. Sem este mapa, um link velho abria a principal parada no topo, sem a seção.
 */
export const ANCORAS_ANTIGAS: Readonly<Record<string, string>> = {
  '#inicio': '#/',
  '#sobre': '#/',
  '#cases': HASH_PROJETOS,
  '#projetos': HASH_PROJETOS,
  '#empresas': HASH_PROJETOS,
  '#stack': HASH_PROJETOS,
  '#ferramentas': HASH_PROJETOS,
  '#clientes': '#resultados',
  '#como-trabalho': '#como-funciona',
}

/**
 * Traduz um hash de versão antiga para o equivalente atual.
 *
 * @param hash valor de `location.hash`.
 * @returns o hash atual correspondente, ou `null` quando o hash já é atual.
 */
export function hashAtual(hash: string): string | null {
  return ANCORAS_ANTIGAS[hash] ?? null
}

/**
 * Extrai o id da seção a que um hash aponta na principal.
 *
 * @param hash valor de `location.hash` (ex.: `#resultados`).
 * @returns o id (`resultados`) ou `null` para rotas (`#/...`) e hash vazio.
 */
export function secaoDoHash(hash: string): string | null {
  return /^#[^/]/.test(hash) ? decodeURIComponent(hash.slice(1)) : null
}

/**
 * Extrai o projeto aberto no painel a partir do hash.
 *
 * @param hash valor de `location.hash` (ex.: `#/projetos/aprovaos`).
 * @returns o slug (`aprovaos`) ou `null` quando nenhum projeto está aberto.
 */
export function projetoDoHash(hash: string): string | null {
  if (!hash.startsWith(`${HASH_PROJETOS}/`)) return null
  const slug = decodeURIComponent(hash.slice(HASH_PROJETOS.length + 1))
  return /^[a-z0-9-]+$/.test(slug) ? slug : null
}

/**
 * Hash compartilhável que abre o painel de um projeto.
 *
 * @param slug slug do projeto em `projetos.ts`.
 * @returns o hash (ex.: `#/projetos/aprovaos`).
 */
export function hashDoProjeto(slug: string): string {
  return `${HASH_PROJETOS}/${slug}`
}
