// Termos que nunca podem ir ao ar: empregador formal, nomes internos, provas que o estudo de 07/10 derrubou,
// assuntos privados e contato direto. Sicoob saiu da lista em 07/10/2026 (decisão dele, com a matéria pública).
// O LinkedIn continua no site por decisão dele (07/10/2026), por isso não entra aqui.
// 15/10/2026: os termos agora ficam só como SHA-256 (16 primeiros hex) da forma sem acento e minúscula.
// Antes a lista estava em texto puro e, por ser um repositório público (e por um bundle que publicava os testes),
// qualquer pessoa lia os assuntos privados que ela existe para esconder. Este módulo só é usado pelos testes (Node).
import { createHash } from 'node:crypto'

/** Hashes dos termos privados (uma ou duas palavras, sem acento, minúsculas). */
export const HASHES_PROIBIDOS: ReadonlySet<string> = new Set([
  '0c3d56f0012fa5f6',
  '69b864fc5ab50f32',
  '985d872e894b4182',
  '7cadbe72fe5e07be',
  '5feeb60f78d8d222',
  '1fd5faa9b5cf91c2',
  'b8fb5771b3a0aa46',
  'ffb1463ccd39eff6',
])

const PADROES: ReadonlyArray<readonly [string, RegExp]> = [
  ['e-mail', /[\w.+-]+@[\w-]+\.[\w.]+/],
  ['telefone', /(?:\+?55\s?)?\(?\b\d{2}\)?[\s-]?9?\d{4}[\s-]\d{4}\b/],
]

/** Minúsculas e sem acento, para comparar termos de forma estável. */
export function normalizar(texto: string): string {
  return texto.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
}

/** Hash curto (16 hex do SHA-256) de um termo já normalizado. */
export function hashTermo(termo: string): string {
  return createHash('sha256').update(termo).digest('hex').slice(0, 16)
}

/**
 * Procura no texto termos e padrões que nunca podem ser publicados
 * (empregador formal, nomes internos, assuntos privados, e-mail, telefone).
 * Compara o hash de cada palavra e de cada par de palavras vizinhas com a lista privada.
 *
 * @param texto conteúdo a verificar (pode ser o JSON de todo o site).
 * @param hashes lista de hashes a usar (padrão: a lista privada do site; os testes passam a sua).
 * @returns rótulos encontrados, sem repetição ("termo privado <hash>", "e-mail", "telefone"); vazio quando limpo.
 */
export function encontrarTermosProibidos(texto: string, hashes: ReadonlySet<string> = HASHES_PROIBIDOS): string[] {
  const palavras = normalizar(texto).split(/[^a-z0-9-]+/).filter(Boolean)
  const achados = new Set<string>()
  palavras.forEach((p, i) => {
    for (const candidato of [p, i + 1 < palavras.length ? `${p} ${palavras[i + 1]}` : null]) {
      if (candidato && hashes.has(hashTermo(candidato))) achados.add(`termo privado ${hashTermo(candidato)}`)
    }
  })
  const lista = [...achados]
  for (const [rotulo, padrao] of PADROES) {
    if (padrao.test(texto)) lista.push(rotulo)
  }
  return lista
}
