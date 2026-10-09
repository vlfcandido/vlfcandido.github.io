import { describe, expect, it } from 'vitest'
import { encontrarTermosProibidos } from './termos-proibidos'
import { MENSAGEM_WHATSAPP, NUMERO_WHATSAPP, WHATSAPP, linkWhatsapp } from './whatsapp'

describe('link do WhatsApp', () => {
  it('aponta para o número comercial no wa.me', () => {
    expect(NUMERO_WHATSAPP).toBe('5545936180413')
    expect(WHATSAPP.startsWith('https://wa.me/5545936180413?text=')).toBe(true)
  })
  it('leva a mensagem codificada', () =>
    expect(WHATSAPP).toBe(
      'https://wa.me/5545936180413?text=Oi%2C%20Vinicius!%20Vi%20seu%20site%20e%20queria%20conversar%20sobre%20um%20projeto.',
    ))
  it('a mensagem volta intacta ao decodificar', () =>
    expect(new URL(WHATSAPP).searchParams.get('text')).toBe(MENSAGEM_WHATSAPP))
  it('codifica acento e quebra de linha', () =>
    expect(linkWhatsapp('Olá,\nproposta')).toBe('https://wa.me/5545936180413?text=Ol%C3%A1%2C%0Aproposta'))
  it('não expõe o número como telefone legível', () => expect(encontrarTermosProibidos(WHATSAPP)).toEqual([]))
})
