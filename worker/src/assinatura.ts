// Assinatura das falas do assistente. O Worker não guarda conversa (invariante 8), então o histórico volta do
// navegador a cada turno; sem assinatura, qualquer um poderia forjar uma "fala do assistente" com instruções.
// HMAC-SHA-256 pela Web Crypto (existe no Worker e no Node 22). Também gera o hash diário do IP.

const codificador = new TextEncoder()

/** Converte bytes em hexadecimal. */
function hex(bytes: ArrayBuffer): string {
  return [...new Uint8Array(bytes)].map((b) => b.toString(16).padStart(2, '0')).join('')
}

/** Importa a chave HMAC. */
async function chaveHmac(segredo: string): Promise<CryptoKey> {
  return crypto.subtle.importKey('raw', codificador.encode(segredo), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
}

/**
 * Assina uma fala do assistente, presa à conversa.
 *
 * @param segredo chave de assinatura do Worker.
 * @param conversa id da conversa.
 * @param texto texto exato da fala.
 * @returns assinatura em hexadecimal.
 */
export async function assinar(segredo: string, conversa: string, texto: string): Promise<string> {
  const chave = await chaveHmac(segredo)
  return hex(await crypto.subtle.sign('HMAC', chave, codificador.encode(`${conversa}\n${texto}`)))
}

/**
 * Confere a assinatura de uma fala, em tempo constante.
 *
 * @param segredo chave de assinatura do Worker.
 * @param conversa id da conversa.
 * @param texto texto da fala.
 * @param assinatura assinatura recebida.
 * @returns `true` quando a fala saiu deste Worker, nesta conversa, sem alteração.
 */
export async function conferir(segredo: string, conversa: string, texto: string, assinatura: string | undefined): Promise<boolean> {
  if (!assinatura) return false
  const esperada = await assinar(segredo, conversa, texto)
  if (esperada.length !== assinatura.length) return false
  let diferenca = 0
  for (let i = 0; i < esperada.length; i++) diferenca |= esperada.charCodeAt(i) ^ assinatura.charCodeAt(i)
  return diferenca === 0
}

/**
 * Hash do IP com sal diário: conta mensagens por IP sem guardar o IP, e o hash muda a cada dia.
 *
 * @param segredo chave do Worker (vira parte do sal).
 * @param ip IP do visitante.
 * @param dia `AAAA-MM-DD`.
 * @returns 16 caracteres hexadecimais.
 */
export async function hashIp(segredo: string, ip: string, dia: string): Promise<string> {
  const chave = await chaveHmac(`${segredo}:ip:${dia}`)
  return hex(await crypto.subtle.sign('HMAC', chave, codificador.encode(ip))).slice(0, 16)
}
