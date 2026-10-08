import type { ComponentType } from 'react'
import type { IdPeca } from '../../../casos'
import { ArvoreConversa } from './ArvoreConversa'
import { BalcaoExtrato } from './BalcaoExtrato'
import { BarrasStatus } from './BarrasStatus'
import { CadernoDecisoes } from './CadernoDecisoes'
import { ConversaWhatsapp } from './ConversaWhatsapp'
import { DiffComNota } from './DiffComNota'
import { EnvelopeInjecao } from './EnvelopeInjecao'
import { FichaLaboratorio } from './FichaLaboratorio'
import { FichaLead } from './FichaLead'
import { FolhaEspecime } from './FolhaEspecime'
import { FunilQualificacao } from './FunilQualificacao'
import { ModalAprovacao } from './ModalAprovacao'
import { RaioX } from './RaioX'
import { RecorteImprensa } from './RecorteImprensa'
import { RelogioLead } from './RelogioLead'
import { SalaDeControle } from './SalaDeControle'
import { TerminalCota } from './TerminalCota'
import type { PecaProps } from './tipos'

/**
 * Componente de cada peça principal. O `Record` obriga a ter um componente para cada id de `casos.ts`;
 * o teste de casos garante que nenhum id se repete entre os projetos.
 */
export const PECAS: Record<IdPeca, ComponentType<PecaProps>> = {
  'caderno-decisoes': CadernoDecisoes,
  'sala-de-controle': SalaDeControle,
  'terminal-cota': TerminalCota,
  'balcao-extrato': BalcaoExtrato,
  'envelope-injecao': EnvelopeInjecao,
  'diff-com-nota': DiffComNota,
  'modal-aprovacao': ModalAprovacao,
  'raio-x': RaioX,
  'folha-especime': FolhaEspecime,
  'ficha-laboratorio': FichaLaboratorio,
  'recorte-imprensa': RecorteImprensa,
  'ficha-lead': FichaLead,
  'conversa-whatsapp': ConversaWhatsapp,
  'arvore-conversa': ArvoreConversa,
  'funil-qualificacao': FunilQualificacao,
  'relogio-lead': RelogioLead,
  'barras-status': BarrasStatus,
}
