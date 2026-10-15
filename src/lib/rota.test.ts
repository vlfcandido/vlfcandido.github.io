import { describe, expect, it } from 'vitest'
import { ANCORAS_ANTIGAS, filtroDoHash, hashAtual, hashDoProjeto, movimentoDaTroca, projetoDoHash, rotaDoHash, secaoDoHash, separarConsultaDoHash } from './rota'

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
  it('como-trabalho virou como', () => expect(hashAtual('#como-trabalho')).toBe('#como'))
  it('clientes virou empresas', () => expect(hashAtual('#clientes')).toBe('#empresas'))
  it('hash atual não muda', () => expect(hashAtual('#destaques')).toBeNull())
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

describe('movimentoDaTroca', () => {
  it('âncora e filtro na mesma página não movem', () => {
    expect(movimentoDaTroca('#/', '#pacotes')).toBeNull()
    expect(movimentoDaTroca('#/projetos', '#/projetos/tipo/frontend')).toBeNull()
  })
  it('entrar e sair de um case', () => {
    expect(movimentoDaTroca('#/projetos', '#/projetos/aprovaos')).toBe('avancar')
    expect(movimentoDaTroca('#/projetos/aprovaos', '#/projetos')).toBe('voltar')
    expect(movimentoDaTroca('#/projetos/aprovaos', '#/projetos/outro')).toBe('avancar')
  })
  it('início e projetos', () => {
    expect(movimentoDaTroca('#/', '#/projetos')).toBe('pagina')
    expect(movimentoDaTroca('#/projetos', '#/')).toBe('pagina')
    expect(movimentoDaTroca('#/projetos/aprovaos', '#/')).toBe('pagina')
  })
})

describe('site novo (14/10/2026)', () => {
  it('rotas antigas continuam abrindo depois do site novo', () => {
    expect(rotaDoHash('#/projetos/aprovaos')).toBe('projetos')
    expect(projetoDoHash('#/projetos/aprovaos')).toBe('aprovaos')
    for (const antiga of Object.keys(ANCORAS_ANTIGAS)) expect(hashAtual(antiga)).not.toBeNull()
  })
})

describe('âncoras antigas apontam para a home nova (14/10/2026)', () => {
  const IDS_DA_HOME = ['inicio', 'prototipo', 'empresas', 'destaques', 'como', 'quem']
  it('todo destino de seção é um id que existe na home', () => {
    for (const destino of Object.values(ANCORAS_ANTIGAS)) {
      const id = secaoDoHash(destino)
      if (id) expect(IDS_DA_HOME, destino).toContain(id)
    }
  })
  it('link direto #empresas fica na home, na seção', () => {
    expect(hashAtual('#empresas')).toBeNull()
    expect(rotaDoHash('#empresas')).toBe('inicio')
    expect(secaoDoHash('#empresas')).toBe('empresas')
  })
})

describe('separarConsultaDoHash', () => {
  it('tira a consulta colada no hash', () => {
    expect(separarConsultaDoHash('#/projetos/aprovaos?_i=1')).toEqual({ hash: '#/projetos/aprovaos', consulta: '_i=1' })
    expect(separarConsultaDoHash('#/projetos?utm_source=x&a=b')).toEqual({ hash: '#/projetos', consulta: 'utm_source=x&a=b' })
  })
  it('hash sem consulta fica como está', () => expect(separarConsultaDoHash('#/projetos')).toBeNull())
})
