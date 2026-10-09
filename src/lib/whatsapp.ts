// Link do WhatsApp comercial (WhatsApp Business), num único lugar. Só constantes e uma função pura:
// nada roda ao importar. O número não aparece como texto no site, só dentro do link do wa.me.

/** Número comercial no formato do wa.me: DDI + DDD + número, só dígitos. */
export const NUMERO_WHATSAPP = '5545936180413'

/** Primeira mensagem que já chega escrita na conversa: curta, para a pessoa só completar e enviar. */
export const MENSAGEM_WHATSAPP = 'Oi, Vinicius! Vi seu site e queria conversar sobre um projeto.'

/**
 * Monta o link do wa.me com a mensagem pré-preenchida, codificada para URL.
 *
 * @param mensagem texto que abre escrito na conversa (padrão: `MENSAGEM_WHATSAPP`).
 * @returns endereço `https://wa.me/<número>?text=<mensagem codificada>`.
 */
export function linkWhatsapp(mensagem: string = MENSAGEM_WHATSAPP): string {
  return `https://wa.me/${NUMERO_WHATSAPP}?text=${encodeURIComponent(mensagem)}`
}

/** Link usado pelos botões do site. */
export const WHATSAPP = linkWhatsapp()
