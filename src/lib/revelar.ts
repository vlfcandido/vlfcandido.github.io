/**
 * Entrada suave das seções ao rolar. Só `opacity` e `transform` (compositor, sem layout), então não
 * mexe em LCP nem em CLS: o que já está na tela ao abrir nunca é escondido, e o espaço de cada peça
 * é reservado desde o início. Com `prefers-reduced-motion`, ou sem `IntersectionObserver`, nada acontece.
 */

/** Cartões que entram em sequência (logos, pacotes, cases e projetos). */
export const CARTOES = '.pacote, .cartao-caso, .cartao-projeto, li:has(> .logo-botao)'

/** Intervalo entre um cartão e o seguinte. */
export const ESCALONAMENTO_MS = 60

/** A partir do sexto cartão o atraso para de crescer, para a fila nunca parecer lenta. */
export const MAX_ESCALONADOS = 5

/** Classe da peça escondida, à espera de entrar. */
export const CLASSE_ESPERA = 'vai-entrar'

/** Classe que liga a transição enquanto a peça entra (removida logo depois). */
export const CLASSE_ENTRANDO = 'entrando'

/**
 * Atraso de entrada de um cartão dentro do seu grupo.
 *
 * @param indice posição do cartão no grupo (0 é o primeiro).
 * @returns atraso em milissegundos, limitado a `MAX_ESCALONADOS` passos.
 */
export function atrasoDoIndice(indice: number): number {
  return Math.min(Math.max(indice, 0), MAX_ESCALONADOS) * ESCALONAMENTO_MS
}

/**
 * Diz se a revelação ao rolar pode rodar neste navegador.
 *
 * @param janela janela a consultar (injetável para teste).
 * @returns `false` com `prefers-reduced-motion: reduce` ou sem `IntersectionObserver`.
 */
export function revelacaoPermitida(janela: Pick<Window, 'matchMedia'> & { IntersectionObserver?: unknown }): boolean {
  if (typeof janela.IntersectionObserver !== 'function') return false
  return !janela.matchMedia('(prefers-reduced-motion: reduce)').matches
}

interface Unidade {
  alvo: Element
  itens: HTMLElement[]
}

/** Monta as unidades: cada bloco de seção sem cartões e cada grupo de cartões (ou cartão, se o grupo for alto). */
function unidadesDe(raiz: ParentNode, altura: number): Unidade[] {
  const unidades: Unidade[] = []
  for (const el of raiz.querySelectorAll<HTMLElement>('.secao > *')) {
    if (el.matches(CARTOES) || el.querySelector(CARTOES) || el.closest('.expansivel')) continue
    unidades.push({ alvo: el, itens: [el] })
  }
  const grupos = new Map<Element, HTMLElement[]>()
  for (const c of raiz.querySelectorAll<HTMLElement>(CARTOES)) {
    // Dentro de uma área recolhida ("Ver todas as empresas") o cartão nunca cruza a tela: ficaria preso escondido.
    if (c.closest('.expansivel')) continue
    const pai = c.parentElement
    if (pai) grupos.set(pai, [...(grupos.get(pai) ?? []), c])
  }
  for (const [pai, cartoes] of grupos) {
    if (pai.getBoundingClientRect().height <= altura * 1.2) unidades.push({ alvo: pai, itens: cartoes })
    else for (const c of cartoes) unidades.push({ alvo: c, itens: [c] })
  }
  return unidades
}

/**
 * Esconde o que está abaixo da dobra e o revela quando chega perto, com escalonamento leve nos cartões.
 *
 * @param raiz elemento que contém as seções.
 * @param janela janela do navegador (injetável para teste).
 * @returns função que desfaz tudo (para o `useEffect`).
 */
export function iniciarRevelacao(raiz: ParentNode, janela: Window = window): () => void {
  if (!revelacaoPermitida(janela)) return () => undefined
  const altura = janela.innerHeight
  const porAlvo = new Map<Element, Unidade>()
  const tocados = new Set<HTMLElement>()
  const timers: number[] = []

  const limpar = (el: HTMLElement) => {
    el.classList.remove(CLASSE_ESPERA, CLASSE_ENTRANDO)
    el.style.removeProperty('--atraso-entrada')
    tocados.delete(el)
  }

  const obs = new IntersectionObserver(
    (entradas) => {
      for (const e of entradas) {
        const passou = e.boundingClientRect.bottom < 0
        if (!e.isIntersecting && !passou) continue
        const u = porAlvo.get(e.target)
        if (!u) continue
        obs.unobserve(e.target)
        porAlvo.delete(e.target)
        u.itens.forEach((el, i) => {
          const atraso = passou ? 0 : atrasoDoIndice(i)
          el.style.setProperty('--atraso-entrada', `${atraso}ms`)
          el.classList.remove(CLASSE_ESPERA)
          timers.push(janela.setTimeout(() => limpar(el), 400 + atraso + 150))
        })
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.05 },
  )

  for (const u of unidadesDe(raiz, altura)) {
    if (u.alvo.getBoundingClientRect().top < altura * 0.92) continue
    for (const el of u.itens) {
      el.classList.add(CLASSE_ESPERA, CLASSE_ENTRANDO)
      tocados.add(el)
    }
    porAlvo.set(u.alvo, u)
    obs.observe(u.alvo)
  }

  return () => {
    obs.disconnect()
    timers.forEach((t) => janela.clearTimeout(t))
    for (const el of [...tocados]) limpar(el)
  }
}
