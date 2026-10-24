// Guarda do topo (23/10/2026): o LinkedIn volta para a abertura, ao lado do WhatsApp.
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { Promessa } from './Promessa'

describe('Promessa', () => {
  it('leva o WhatsApp e o LinkedIn já na abertura', () => {
    const html = renderToStaticMarkup(createElement(Promessa))
    expect(html).toContain('linkedin.com/in/viniciusf-candido')
    expect(html).toMatch(/wa\.me|whatsapp/i)
  })
})
