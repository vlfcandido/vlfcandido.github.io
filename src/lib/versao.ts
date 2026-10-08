/**
 * Garante que o visitante vê a versão publicada agora, e não uma guardada no navegador.
 *
 * O GitHub Pages serve o index.html com `Cache-Control: max-age=600`: por até 10 minutos depois
 * de um deploy o navegador reaproveita o index (e o JS) antigos. Nada aqui roda no import; quem
 * chama é o `main.tsx`.
 */

/** Chave do sessionStorage que impede recarregar duas vezes para a mesma versão. */
const CHAVE_RECARGA = 'versao-recarregada'

/**
 * Acha o script principal do build (`assets/index-<hash>.js`) dentro de um HTML.
 *
 * @param html conteúdo do index.html.
 * @returns o caminho do script com hash, ou `null` se não houver (ex.: servidor de desenvolvimento).
 */
export function scriptPrincipal(html: string): string | null {
  const achado = html.match(/<script[^>]*\ssrc="([^"]*assets\/index-[^"]+\.js)"/)
  return achado ? achado[1] : null
}

/**
 * Remove service workers de qualquer versão anterior servida neste domínio.
 * O site atual não registra nenhum; isso só limpa o que tiver ficado para trás.
 */
export async function desregistrarServiceWorkers(): Promise<void> {
  if (!('serviceWorker' in navigator)) return
  const registros = await navigator.serviceWorker.getRegistrations()
  await Promise.all(registros.map((r) => r.unregister()))
  if ('caches' in window) {
    const nomes = await caches.keys()
    await Promise.all(nomes.map((n) => caches.delete(n)))
  }
}

/**
 * Compara o build em execução com o index.html publicado agora e recarrega se houver versão nova.
 *
 * @param base `import.meta.env.BASE_URL` (raiz do site publicado).
 * @returns `true` se pediu recarga.
 */
export async function recarregarSeHouverVersaoNova(base: string): Promise<boolean> {
  const atual = scriptPrincipal(document.documentElement.outerHTML)
  if (!atual) return false
  const resposta = await fetch(`${base}index.html?v=${Date.now()}`, { cache: 'no-store' })
  if (!resposta.ok) return false
  const publicado = scriptPrincipal(await resposta.text())
  if (!publicado || publicado === atual) return false
  try {
    if (sessionStorage.getItem(CHAVE_RECARGA) === publicado) return false
    sessionStorage.setItem(CHAVE_RECARGA, publicado)
  } catch {
    return false // sem sessionStorage não há como evitar laço de recarga; melhor não recarregar.
  }
  window.location.reload()
  return true
}
