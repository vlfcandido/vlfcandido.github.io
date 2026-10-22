import { describe, expect, it, vi } from 'vitest'
import { medir } from './medir'

describe('medição de etapa no Clarity', () => {
  it('entrega o nome da etapa para o enviador', () => {
    const enviar = vi.fn()
    medir('hero_agente_ramo', enviar)
    expect(enviar).toHaveBeenCalledWith('hero_agente_ramo')
  })

  it('recusa nome fora do formato hero_<etapa>', () => {
    const enviar = vi.fn()
    medir('agente_sem_prefixo', enviar)
    medir('hero_Agente_Ramo', enviar)
    medir('hero_agente ramo', enviar)
    expect(enviar).not.toHaveBeenCalled()
  })

  it('falha do Clarity não quebra a página', () => {
    expect(() => medir('hero_agente_visto', () => { throw new Error('bloqueado') })).not.toThrow()
  })

  it('sem Clarity na página, não chama nada e não quebra', () => {
    expect(() => medir('hero_agente_visto')).not.toThrow()
  })
})
