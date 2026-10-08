/**
 * Os níveis da página principal, da superfície ao fundo, com a cota que a régua mostra.
 *
 * `curto` é o rótulo da régua do celular (M17). Ordem trocada em 08/10/2026 (M8): Provas subiu para antes de Como funciona. Antes: Como funciona na
 * cota 20 e Provas na cota 30.
 */
export const NIVEIS = [
  { href: '#inicio', cota: 0, rotulo: 'Abertura', curto: 'Abertura' },
  { href: '#o-que-eu-resolvo', cota: 10, rotulo: 'O que eu resolvo', curto: 'Serviços' },
  { href: '#resultados', cota: 20, rotulo: 'Provas', curto: 'Provas' },
  { href: '#como-funciona', cota: 30, rotulo: 'Como funciona', curto: 'Como funciona' },
  { href: '#carreira', cota: 40, rotulo: 'Carreira', curto: 'Carreira' },
] as const

/**
 * Régua do celular (abaixo de `sm`, M17 de 08/10/2026): sem a Abertura e sem cotas, com os rótulos
 * curtos. "Projetos" fica fixo à direita, fora da rolagem.
 */
export const NIVEIS_CELULAR: ReadonlyArray<(typeof NIVEIS)[number]> = NIVEIS.filter((n) => n.href !== '#inicio')

/**
 * Seções que não têm marca própria na régua e contam como o nível de cima. Interfaces é uma aba
 * dentro do bloco de Provas, por isso conta como `#resultados`.
 */
export const MESMO_NIVEL: Readonly<Record<string, string>> = {
  interfaces: '#resultados',
  'como-entrega': '#como-funciona',
  pacotes: '#como-funciona',
  contato: '#carreira',
  trajetoria: '#carreira',
  imprensa: '#carreira',
}
