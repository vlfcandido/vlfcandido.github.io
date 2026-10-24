// Guarda do bloco de lojas virtuais (23/10/2026): o texto sai do conteudoHome, a peça do case loja-virtual é
// renderizada de verdade e o bloco entra na home entre os projetos e o como funciona. Renderização estática no
// Node; nenhum efeito de navegador roda aqui.
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

  it('a linha de serviços é a decidida, sem nome de loja nem valor', () => {
    expect(lojas.servicos).toBe(
      'Integração de ERP e marketplace, automação de catálogo e estoque, animação de vitrine e medição limpa para o Google Ads.',
    )
    // Nada de loja, dono, dinheiro ou IA: o bloco fala do serviço, não do cliente.
    expect(JSON.stringify(lojas)).not.toMatch(/R\$|\bIA\b|intelig[êe]ncia artificial/i)
  })

  it('mostra título, texto, serviços e a mesa de diagnóstico', () => {
    expect(html).toMatch(/<section id="lojas" class="[^"]*\bsecao\b/)
    expect(html).toContain(lojas.titulo)
    expect(html).toContain(lojas.texto)
    expect(html).toContain(lojas.servicos)
    // A peça revisada entra montada: os três passos do método e o laudo.
    expect(html).toContain('Mesa de diagnóstico')
    expect(html).toContain('Varredura')
    expect(html).toContain('O que o laudo põe no escopo')
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
