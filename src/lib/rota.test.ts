import { describe, expect, it } from 'vitest'
import { ANCORAS_ANTIGAS, hashAtual, rotaDoHash, secaoDoHash } from './rota'

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
