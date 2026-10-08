/**
 * Os níveis da página principal, da superfície ao fundo, com a cota que a régua mostra.
 *
 * Ordem trocada em 08/10/2026 (M8): Provas subiu para antes de Como funciona. Antes: Como funciona na
 * cota 20 e Provas na cota 30.
 */
export const NIVEIS = [
  { href: '#inicio', cota: 0, rotulo: 'Abertura' },
  { href: '#o-que-eu-resolvo', cota: 10, rotulo: 'O que eu resolvo' },
  { href: '#resultados', cota: 20, rotulo: 'Provas' },
  { href: '#como-funciona', cota: 30, rotulo: 'Como funciona' },
  { href: '#carreira', cota: 40, rotulo: 'Carreira' },
] as const

/**
 * Seções que não têm marca própria na régua e contam como o nível de cima. Interfaces é uma aba
 * dentro do bloco de Provas, por isso conta como `#resultados`.
 */
export const MESMO_NIVEL: Readonly<Record<string, string>> = {
  interfaces: '#resultados',
  contato: '#carreira',
  trajetoria: '#carreira',
  imprensa: '#carreira',
}
