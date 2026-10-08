import { describe, expect, it } from 'vitest'
import { rotaDoHash } from './rota'

describe('rotaDoHash', () => {
  it('vazio é início', () => expect(rotaDoHash('')).toBe('inicio'))
  it('âncora da principal é início', () => expect(rotaDoHash('#como-funciona')).toBe('inicio'))
  it('raiz com barra é início', () => expect(rotaDoHash('#/')).toBe('inicio'))
  it('projetos', () => expect(rotaDoHash('#/projetos')).toBe('projetos'))
  it('subcaminho de projetos', () => expect(rotaDoHash('#/projetos/nexus-quant')).toBe('projetos'))
  it('não confunde prefixo', () => expect(rotaDoHash('#/projetosx')).toBe('inicio'))
})
