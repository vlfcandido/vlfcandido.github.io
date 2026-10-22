// Ordem da vitrine da home (18/10/2026). A curadoria começa pela peça mais visual e termina na que já aparece no
// topo da home (Liga Várzea), para a segunda dobra não repetir a mesma tela da primeira. A ordem de /trabalhos/ e
// a de PECAS não mudam: o teste confere que a vitrine usa as nove, uma vez cada.

import { PECAS } from '../conteudo'

/** Slugs na ordem em que entram na vitrine da home. */
export const ORDEM_DA_VITRINE = [
  'pet-shop-whatsapp-ia-exemplo',
  'catalogo-whatsapp-exemplo',
  'plataforma-astrologia-exemplo',
  'consignacao-veiculos-exemplo',
  'atletica-associados-exemplo',
  'escritorio-arquitetura-exemplo',
  'loja-woocommerce-exemplo',
  'consultorio-exemplo',
  'liga-varzea',
] as const

/**
 * Monta a lista da vitrine na ordem curada. Função, e não constante, para nada rodar ao importar o módulo.
 *
 * @returns as nove peças da vitrine, na ordem de exibição.
 */
export function pecasDaVitrine() {
  return ORDEM_DA_VITRINE.map((slug) => {
    const peca = PECAS.find((p) => p.slug === slug)
    if (!peca) throw new Error(`peça ausente em PECAS: ${slug}`)
    return peca
  })
}
