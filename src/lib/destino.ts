// Leva a pessoa ao título de uma seção da home (14/10/2026, Task 10: "vários links quebrados" no menu).
// Só funções: nada roda ao importar.

/** Classe que marca o título de destino por um instante (traço de caneta passando, ver home.css). */
export const CLASSE_CHEGOU = 'chegou'

/** Quanto tempo a marca de chegada fica no título (a animação do CSS cabe aqui dentro). */
const DURACAO_CHEGADA_MS = 1400

/**
 * O que fica no topo da tela ao chegar: o elemento `.alvo-secao` da seção (o título, ou o retrato com o título
 * em "Quem sou"); sem ele, o primeiro h1 ou h2; sem título, a própria seção.
 *
 * @param secao elemento da seção.
 * @returns o elemento que deve ficar no topo da tela.
 */
export function tituloDaSecao(secao: Element): HTMLElement {
  return (secao.querySelector('.alvo-secao, h1, h2') as HTMLElement | null) ?? (secao as HTMLElement)
}

/**
 * Rola até o título da seção `id`, que fica no topo da tela logo abaixo do cabeçalho (o `scroll-margin-top`
 * do CSS dá o respiro), e marca o título por um instante. A marca é o que mostra que a pessoa chegou quando a
 * seção está no fim da página e não dá para subir o título até o topo.
 *
 * @param id id da seção (sem `#`).
 * @param suave rolagem suave (falso quando o sistema pede menos movimento).
 * @returns `true` quando a seção existe.
 */
export function irParaSecao(id: string, suave: boolean): boolean {
  const secao = document.getElementById(id)
  if (!secao) return false
  tituloDaSecao(secao).scrollIntoView({ behavior: suave ? 'smooth' : 'auto', block: 'start' })
  const titulo = (secao.querySelector('h1, h2') as HTMLElement | null) ?? (secao as HTMLElement)
  titulo.classList.remove(CLASSE_CHEGOU)
  // Força o reinício da animação quando a pessoa clica no mesmo item duas vezes seguidas.
  void titulo.offsetWidth
  titulo.classList.add(CLASSE_CHEGOU)
  window.setTimeout(() => titulo.classList.remove(CLASSE_CHEGOU), DURACAO_CHEGADA_MS)
  return true
}
