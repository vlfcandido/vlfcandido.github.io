// Termos que nunca podem ir ao ar: empregador formal, nomes internos, provas que o estudo de 07/10 derrubou,
// assuntos privados e contato direto. Sicoob saiu da lista em 07/10/2026 (decisão dele, com a matéria pública).
// O LinkedIn continua no site por decisão dele (07/10/2026), por isso não entra aqui.
// A comparação das palavras é feita sem acento e em minúsculas.
const PALAVRAS = ['mirante', 'sisbr', 'pensao', 'beatriz', 'angola', 'odds', 'todos rodando', 'llm-local'] as const

const PADROES: ReadonlyArray<readonly [string, RegExp]> = [
  ['e-mail', /[\w.+-]+@[\w-]+\.[\w.]+/],
  ['telefone', /(?:\+?55\s?)?\(?\b\d{2}\)?[\s-]?9?\d{4}[\s-]\d{4}\b/],
]

/** Minúsculas e sem acento, para comparar termos de forma estável. */
function normalizar(texto: string): string {
  return texto.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
}

/**
 * Procura no texto termos e padrões que nunca podem ser publicados
 * (empregador formal, nomes internos, assuntos privados, e-mail, telefone).
 *
 * @param texto conteúdo a verificar (pode ser o JSON de todo o site).
 * @returns rótulos encontrados, sem repetição; lista vazia quando o texto está limpo.
 */
export function encontrarTermosProibidos(texto: string): string[] {
  const normalizado = normalizar(texto)
  const achados: string[] = PALAVRAS.filter((p) => normalizado.includes(p))
  for (const [rotulo, padrao] of PADROES) {
    if (padrao.test(texto)) achados.push(rotulo)
  }
  return achados
}
