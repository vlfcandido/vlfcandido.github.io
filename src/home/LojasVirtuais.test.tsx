// Guarda do bloco de lojas virtuais (23/10/2026): o texto sai do conteudoHome, o funil e os números aparecem na
// home e o bloco entra entre os projetos e o como funciona. Renderização estática no Node; nenhum efeito de
// navegador roda aqui.
// 23/10/2026 (decisão do dono, home "muito gigante"): a mesa de diagnóstico inteira saiu da home e ficou só no
// case. O teste agora é que ela NÃO aparece aqui, e que o funil, os números e a linha do alto ticket aparecem.
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { PaginaInicio } from '../paginas/Inicio'
import { conteudoHome } from './conteudo'
import { LojasVirtuais } from './LojasVirtuais'

const lojas = conteudoHome().lojas
const html = renderToStaticMarkup(createElement(LojasVirtuais))
const home = renderToStaticMarkup(createElement(PaginaInicio))

describe('bloco de lojas virtuais', () => {
  it('o texto do bloco sai do conteudoHome', () => {
    expect(lojas.titulo).toBe('Lojas virtuais, o diagnóstico antes do orçamento')
    expect(lojas.texto.length).toBeGreaterThan(40)
    expect(lojas.cta).toBe('Ver o caso completo')
  })

  it('o funil, os números e o alto ticket são os decididos, sem nome de loja nem valor', () => {
    expect(lojas.funil).toEqual(['fornecedor', 'Olist DS Lite', 'Tiny', 'Tray'])
    expect(lojas.numeros).toBe('quase 17 mil no catálogo · pouco mais de 5 mil com estoque · cerca de 2 mil na vitrine')
    expect(lojas.origem).toBe('catálogo do ERP × vitrine, 20/10')
    expect(lojas.altoTicket).toMatch(/alto ticket/)
    // Nada de loja, dono, dinheiro ou IA: o bloco fala do serviço, não do cliente.
    expect(JSON.stringify(lojas)).not.toMatch(/R\$|\bIA\b|intelig[êe]ncia artificial/i)
  })

  it('mostra título, texto, funil, números com origem e o alto ticket', () => {
    expect(html).toMatch(/<section id="lojas" class="[^"]*\bsecao\b/)
    expect(html).toContain(lojas.titulo)
    expect(html).toContain(lojas.texto)
    for (const elo of lojas.funil) expect(html).toContain(`>${elo}<`)
    expect(html).toContain(lojas.numeros)
    // O número não aparece sozinho: a origem vem junto, na mesma altura.
    expect(html).toContain(lojas.origem)
    expect(html).toContain(lojas.altoTicket)
  })

  it('a mesa de diagnóstico não é renderizada na home', () => {
    expect(html).not.toContain('Mesa de diagnóstico')
    expect(html).not.toContain('Varredura')
    expect(html).not.toContain('O que o laudo põe no escopo')
  })

  it('leva ao case completo do projeto', () => {
    expect(html).toContain('href="#/projetos/loja-virtual"')
    expect(html).toContain(lojas.cta)
  })

  it('entra na home entre os projetos e o como funciona', () => {
    const projetos = home.indexOf('id="destaques"')
    const bloco = home.indexOf('id="lojas"')
    const como = home.indexOf('id="como"')
    expect(projetos).toBeGreaterThan(-1)
    expect(bloco).toBeGreaterThan(projetos)
    expect(como).toBeGreaterThan(bloco)
  })
})
