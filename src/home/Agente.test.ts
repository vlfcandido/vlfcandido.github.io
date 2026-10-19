// Guarda do hero renderizado (19/10/2026, revisor): o teste de conteúdo olhava só os dados da cena. Este olha o
// HTML que o componente realmente produz, para um campo de pergunta ou um bloco de oferta não voltarem sem o
// portão ficar vermelho. Renderização estática no Node; nenhum efeito de navegador roda aqui.
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { Agente } from './Agente'

const html = renderToStaticMarkup(createElement(Agente))

describe('hero do agente renderizado', () => {
  it('não tem formulário nem campo de pergunta', () => {
    expect(html).not.toMatch(/<form|<input|<textarea/i)
    expect(html).not.toMatch(/pergunte|perguntar/i)
  })

  it('não tem o bloco de oferta nem os avisos longos', () => {
    expect(html).not.toMatch(/590|990|149\/mês|199\/mês|dados fictícios/i)
    expect(html).not.toMatch(/orçamento fecha|responde só o que está na base/i)
  })

  it('mantém a honestidade no selo curto de demonstração', () => {
    expect(html).toContain('WhatsApp · demonstração')
  })
})
