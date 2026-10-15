// Paleta da identidade "o detalhe que ninguém viu" (14/10/2026): papel, tinta e um marca-texto.
// Substitui o Maré (carta náutica, 07/10/2026). Só constantes: nada roda ao importar.

/** Cores de um tema, com os mesmos nomes de variável que o site já usava. */
export type Tema = Record<
  'papel' | 'papel-alto' | 'fundo' | 'fundo-suave' | 'linha' | 'mar' | 'mar-forte' | 'on-mar' | 'sol' | 'on-sol'
  | 'coral' | 'coral-texto' | 'raso' | 'areia' | 'mata',
  string
>

/** Paleta clara e escura. `sol` é o marca-texto, usado só na marcação e nos CTAs. */
export const PALETA: { claro: Tema; escuro: Tema } = {
  claro: {
    papel: '#f7f4ee', 'papel-alto': '#fffdf9', fundo: '#17150f', 'fundo-suave': '#4a463e', linha: '#ddd5c6',
    mar: '#1f3a6b', 'mar-forte': '#142a52', 'on-mar': '#ffffff', sol: '#f6b90a', 'on-sol': '#17150f',
    coral: '#d9542a', 'coral-texto': '#a8401c', raso: '#efe9dc', areia: '#e8dfcc', mata: '#2e6a4e',
  },
  escuro: {
    papel: '#161512', 'papel-alto': '#1f1d19', fundo: '#f3efe6', 'fundo-suave': '#c8c1b3', linha: '#36322c',
    mar: '#a9c6ff', 'mar-forte': '#cfe0ff', 'on-mar': '#0f1522', sol: '#ffc83d', 'on-sol': '#161512',
    coral: '#ff7d52', 'coral-texto': '#ff9c78', raso: '#22201c', areia: '#2b2823', mata: '#74c39a',
  },
}
