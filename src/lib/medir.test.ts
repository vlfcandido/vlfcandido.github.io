import { describe, expect, it, vi } from 'vitest'
import { medir } from './medir'

describe('medição de etapa no Clarity', () => {
  it('entrega o nome da etapa para o enviador', () => {
    const enviar = vi.fn()
    medir('hero_plantao_d1', enviar)
    expect(enviar).toHaveBeenCalledWith('hero_plantao_d1')
  })

  it('recusa nome fora do formato hero_<etapa>', () => {
    const enviar = vi.fn()
    medir('plantao_sem_prefixo', enviar)
    medir('hero_Plantao_D1', enviar)
    medir('hero_plantao d1', enviar)
    expect(enviar).not.toHaveBeenCalled()
  })

  it('falha do Clarity não quebra a página', () => {
    expect(() => medir('hero_plantao_visto', () => { throw new Error('bloqueado') })).not.toThrow()
  })

  it('sem Clarity na página, não chama nada e não quebra', () => {
    expect(() => medir('hero_plantao_visto')).not.toThrow()
  })
})
