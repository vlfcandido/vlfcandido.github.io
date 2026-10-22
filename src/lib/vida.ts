/**
 * Vida do site com o mouse (22/10/2026, pedido dele: o "cérebro" da janela do topo no resto do site). Um ouvinte só,
 * no documento, que escreve variáveis CSS e deixa o desenho para o CSS:
 * - botões magnéticos (`.cta`, `.link-secundario`, `[data-magnetico]`): `--mx`/`--my`, o quanto andam até o cursor;
 * - peças vivas (`.cartao`, `[data-vivo]`): `--tx`/`--ty` de -1 a 1 e `--lx`/`--ly` em %, para a luz e o paralaxe.
 * A janela do topo (`.anim`) tem o próprio controle (AnimacaoTrabalho.tsx) e fica de fora. Só com mouse e sem
 * reduced-motion; nada roda ao importar.
 */

/** Distância, em px, a partir da qual o botão deixa de ser puxado. */
export const RAIO_MAGNETICO = 90

/** Quanto da distância até o cursor o botão anda. */
const FORCA_MAGNETICA = 0.3

/** Botões que puxam até o cursor. */
const MAGNETICOS = '.cta, .link-secundario, [data-magnetico]'

/** Peças que reagem com luz e paralaxe. */
const VIVOS = '.cartao, [data-vivo]'

/**
 * Quanto um botão anda na direção do cursor.
 *
 * @param dx distância horizontal do cursor ao centro do botão, em px.
 * @param dy distância vertical, em px.
 * @returns o deslocamento em px (zero a partir de `RAIO_MAGNETICO`).
 */
export function puxaoMagnetico(dx: number, dy: number): { x: number; y: number } {
  if (Math.hypot(dx, dy) >= RAIO_MAGNETICO) return { x: 0, y: 0 }
  return { x: Math.round(dx * FORCA_MAGNETICA * 10) / 10, y: Math.round(dy * FORCA_MAGNETICA * 10) / 10 }
}

/**
 * Posição do cursor dentro de uma caixa, de -1 (borda esquerda/topo) a 1 (direita/base).
 *
 * @param x coordenada do cursor na janela.
 * @param y coordenada do cursor na janela.
 * @param caixa retângulo do elemento (`getBoundingClientRect`).
 * @returns a posição normalizada nos dois eixos.
 */
export function posicaoNormalizada(x: number, y: number, caixa: { left: number; top: number; width: number; height: number }) {
  return { x: ((x - caixa.left) / caixa.width) * 2 - 1, y: ((y - caixa.top) / caixa.height) * 2 - 1 }
}

/**
 * Diz se a vida pode rodar: precisa de mouse (ponteiro fino) e de movimento liberado.
 *
 * @param janela janela a consultar (injetável para teste).
 * @returns `true` quando pode rodar.
 */
export function vidaPermitida(janela: Window = window): boolean {
  return !janela.matchMedia('(prefers-reduced-motion: reduce)').matches && janela.matchMedia('(pointer: fine)').matches
}

/**
 * Liga a vida no documento.
 *
 * @param doc documento a observar.
 * @param janela janela (injetável para teste).
 * @returns função que desliga tudo e limpa as variáveis escritas.
 */
export function iniciarVida(doc: Document = document, janela: Window = window): () => void {
  if (!vidaPermitida(janela)) return () => {}
  let quadro = 0
  let vivoAtual: HTMLElement | null = null
  const puxados = new Set<HTMLElement>()

  const soltarVivo = () => {
    if (!vivoAtual) return
    for (const v of ['--tx', '--ty', '--lx', '--ly']) vivoAtual.style.removeProperty(v)
    delete vivoAtual.dataset.vivendo
    vivoAtual = null
  }
  const soltarPuxados = (exceto?: HTMLElement) => {
    for (const b of puxados) {
      if (b === exceto) continue
      b.style.removeProperty('--mx')
      b.style.removeProperty('--my')
      puxados.delete(b)
    }
  }

  const aoMover = (e: PointerEvent) => {
    if (e.pointerType !== 'mouse') return
    const { clientX, clientY } = e
    const alvo = e.target instanceof Element ? e.target : null
    janela.cancelAnimationFrame(quadro)
    quadro = janela.requestAnimationFrame(() => {
      const fora = !alvo || alvo.closest('.anim')
      // Peça viva sob o cursor.
      const vivo = fora ? null : alvo.closest<HTMLElement>(VIVOS)
      if (vivo !== vivoAtual) soltarVivo()
      if (vivo) {
        const p = posicaoNormalizada(clientX, clientY, vivo.getBoundingClientRect())
        vivo.style.setProperty('--tx', p.x.toFixed(3))
        vivo.style.setProperty('--ty', p.y.toFixed(3))
        vivo.style.setProperty('--lx', `${((p.x + 1) * 50).toFixed(1)}%`)
        vivo.style.setProperty('--ly', `${((p.y + 1) * 50).toFixed(1)}%`)
        vivo.dataset.vivendo = ''
        vivoAtual = vivo
      }
      // Botão magnético mais perto (só os que estão na tela e fora da janela do topo).
      let perto: HTMLElement | null = null
      for (const b of doc.querySelectorAll<HTMLElement>(MAGNETICOS)) {
        if (b.closest('.anim')) continue
        const c = b.getBoundingClientRect()
        if (c.bottom < 0 || c.top > janela.innerHeight) continue
        const puxao = puxaoMagnetico(clientX - (c.left + c.width / 2), clientY - (c.top + c.height / 2))
        if (puxao.x === 0 && puxao.y === 0) continue
        b.style.setProperty('--mx', `${puxao.x}px`)
        b.style.setProperty('--my', `${puxao.y}px`)
        puxados.add(b)
        perto = b
        break
      }
      soltarPuxados(perto ?? undefined)
    })
  }
  const aoSair = () => {
    soltarVivo()
    soltarPuxados()
  }

  doc.addEventListener('pointermove', aoMover, { passive: true })
  doc.documentElement.addEventListener('pointerleave', aoSair)
  return () => {
    janela.cancelAnimationFrame(quadro)
    doc.removeEventListener('pointermove', aoMover)
    doc.documentElement.removeEventListener('pointerleave', aoSair)
    aoSair()
  }
}
