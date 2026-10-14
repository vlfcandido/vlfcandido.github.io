import { describe, expect, it } from 'vitest'
import { listarProjetos, tiposProjeto, type TipoProjeto } from '../../projetos'
import { contarPorTipo, filtrarGaleria } from './galeria'

const todos = listarProjetos()

describe('filtro da galeria', () => {
  it('sem tipo, mostra todos', () => expect(filtrarGaleria(todos, null).itens).toHaveLength(todos.length))
  it('tipo inexistente volta para todos (nunca grade vazia)', () => {
    const r = filtrarGaleria(todos, 'nao-existe')
    expect(r.tipo).toBeNull()
    expect(r.itens).toHaveLength(todos.length)
  })
  it('tipo sem projeto volta para todos', () => {
    const vazio = todos.filter(() => false)
    expect(filtrarGaleria(vazio, 'chatbot').itens).toHaveLength(0)
    const semChatbot = todos.filter((p) => !p.tipos.includes('chatbot'))
    const r = filtrarGaleria(semChatbot, 'chatbot')
    expect(r.tipo).toBeNull()
    expect(r.itens).toHaveLength(semChatbot.length)
  })
  it('chave herdada do protótipo não vira tipo', () => {
    const r = filtrarGaleria(todos, 'toString')
    expect(r.tipo).toBeNull()
    expect(r.itens).toHaveLength(todos.length)
  })
  it('filtra pelo tipo', () => {
    const contagem = contarPorTipo(todos)
    const tipo = (Object.keys(tiposProjeto) as TipoProjeto[]).find((t) => contagem[t] > 0)!
    const r = filtrarGaleria(todos, tipo)
    expect(r.tipo).toBe(tipo)
    expect(r.itens.length).toBeGreaterThan(0)
    expect(r.itens.every((p) => p.tipos.includes(tipo))).toBe(true)
  })
  it('conta por tipo', () => {
    const c = contarPorTipo(todos)
    for (const t of Object.keys(tiposProjeto) as TipoProjeto[]) expect(c[t]).toBe(todos.filter((p) => p.tipos.includes(t)).length)
  })
})
