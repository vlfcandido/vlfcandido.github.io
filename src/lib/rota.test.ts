import { describe, expect, it } from 'vitest'
import { ANCORAS_ANTIGAS, filtroDoHash, hashAtual, hashDoProjeto, projetoDoHash, rotaDoHash, secaoDoHash } from './rota'

describe('rotaDoHash', () => {
  it('vazio é início', () => expect(rotaDoHash('')).toBe('inicio'))
  it('âncora da principal é início', () => expect(rotaDoHash('#como-funciona')).toBe('inicio'))
  it('raiz com barra é início', () => expect(rotaDoHash('#/')).toBe('inicio'))
  it('projetos', () => expect(rotaDoHash('#/projetos')).toBe('projetos'))
  it('subcaminho de projetos', () => expect(rotaDoHash('#/projetos/nexus-quant')).toBe('projetos'))
  it('não confunde prefixo', () => expect(rotaDoHash('#/projetosx')).toBe('inicio'))
})

describe('hashAtual', () => {
  it('âncora antiga de projetos vai para a página de projetos', () => expect(hashAtual('#projetos')).toBe('#/projetos'))
  it('como-trabalho virou como-funciona', () => expect(hashAtual('#como-trabalho')).toBe('#como-funciona'))
  it('clientes virou resultados', () => expect(hashAtual('#clientes')).toBe('#resultados'))
  it('hash atual não muda', () => expect(hashAtual('#resultados')).toBeNull())
  it('rota atual não muda', () => expect(hashAtual('#/projetos')).toBeNull())
  it('nenhum destino é outra âncora antiga', () =>
    Object.values(ANCORAS_ANTIGAS).forEach((destino) => expect(hashAtual(destino)).toBeNull()))
})

describe('secaoDoHash', () => {
  it('âncora vira id', () => expect(secaoDoHash('#resultados')).toBe('resultados'))
  it('rota não é seção', () => expect(secaoDoHash('#/projetos')).toBeNull())
  it('vazio não é seção', () => expect(secaoDoHash('')).toBeNull())
})

describe('projetoDoHash', () => {
  it('lê o slug do painel', () => expect(projetoDoHash('#/projetos/aprovaos')).toBe('aprovaos'))
  it('lista sem painel', () => expect(projetoDoHash('#/projetos')).toBeNull())
  it('ignora slug inválido', () => expect(projetoDoHash('#/projetos/<x>')).toBeNull())
  it('ida e volta', () => expect(projetoDoHash(hashDoProjeto('nexus-quant'))).toBe('nexus-quant'))
  it('âncora da principal não é painel', () => expect(projetoDoHash('#resultados')).toBeNull())
})

describe('filtroDoHash', () => {
  it('lê o tipo pedido no link e ignora o resto', () => {
    expect(filtroDoHash('#/projetos/tipo/frontend')).toBe('frontend')
    expect(filtroDoHash('#/projetos/aprovaos')).toBeNull()
    expect(filtroDoHash('#/projetos')).toBeNull()
  })
  it('link filtrado continua na página de projetos, sem abrir painel', () => {
    expect(rotaDoHash('#/projetos/tipo/frontend')).toBe('projetos')
    expect(projetoDoHash('#/projetos/tipo/frontend')).toBeNull()
  })
})
