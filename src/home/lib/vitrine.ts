// Ordem da vitrine da home (18/10/2026). Antes a curadoria começava pela peça mais visual e terminava na Liga
// Várzea, que aparecia no topo da home.
// 26/11/2026 (dono): a vitrine segue a ordem de PECAS, as mais bonitas na frente, igual a /trabalhos/ e a
// #/projetos. O teste confere que as duas listas são a mesma, na mesma ordem.

import { PECAS } from '../conteudo'

/** Slugs na ordem em que entram na vitrine da home. */
export const ORDEM_DA_VITRINE = [
  'pet-shop-whatsapp-ia-exemplo',
  // 26/11/2026: o Céu Interior divide as duas vagas grandes do PC com o Pelo Solto. Antes era o site institucional
  // (Doze Avos), que foi para o fim da lista.
  'plataforma-astrologia-exemplo',
  'atletica-associados-exemplo',
  'consultorio-exemplo',
  'liga-varzea',
  'consignacao-veiculos-exemplo',
  'loja-woocommerce-exemplo',
  'catalogo-whatsapp-exemplo',
  'escritorio-arquitetura-exemplo',
  'site-contabilidade-exemplo',
] as const

/**
 * Monta a lista da vitrine na ordem curada. Função, e não constante, para nada rodar ao importar o módulo.
 *
 * @returns as peças da vitrine, na ordem de exibição.
 */
export function pecasDaVitrine() {
  return ORDEM_DA_VITRINE.map((slug) => {
    const peca = PECAS.find((p) => p.slug === slug)
    if (!peca) throw new Error(`peça ausente em PECAS: ${slug}`)
    return peca
  })
}
