import { MolduraCelular } from '../MolduraCelular'
import type { PecaProps } from './tipos'

/** Mensagem da conversa: de quem é, o texto e, opcionalmente, as opções do menu. */
interface Mensagem {
  de: 'pessoa' | 'robo'
  texto: string
  opcoes?: string[]
  hora: string
}

// Conversa ilustrativa (rotulada na página): o tipo de atendimento do case, com texto de exemplo.
const CONVERSA: Mensagem[] = [
  { de: 'pessoa', texto: 'Oi, tenho uma dúvida sobre vacina', hora: '21:14' },
  {
    de: 'robo',
    texto: 'Olá! Aqui é o atendimento da Saúde. Sobre vacinação, escolha uma opção:',
    opcoes: ['Onde tomar', 'Documentos', 'Falar com atendente'],
    hora: '21:14',
  },
  { de: 'pessoa', texto: 'Documentos', hora: '21:15' },
  { de: 'robo', texto: 'Leve um documento com foto e, se tiver, a carteira de vacinação. Isso resolveu?', opcoes: ['Sim', 'Não, quero um atendente'], hora: '21:15' },
  { de: 'pessoa', texto: 'Sim, obrigado', hora: '21:15' },
]

const LEITURA = [
  { titulo: 'Menu em vez de texto livre', texto: 'A pessoa toca na opção; o robô não precisa adivinhar o que ela quis dizer.' },
  { titulo: 'Resposta direta', texto: 'As dúvidas repetidas têm resposta pronta, a qualquer hora.' },
  { titulo: 'Atendente sempre à vista', texto: 'Quem não resolve no menu passa para uma pessoa da equipe.' },
]

/**
 * Peça da Prefeitura de Franca: a conversa no WhatsApp dentro de um celular e, ao lado, a leitura de
 * cada decisão de desenho que deixa o atendimento sem fila.
 */
export function ConversaWhatsapp(_: PecaProps) {
  return (
    <div className="grid items-center gap-10 md:grid-cols-[minmax(0,340px)_1fr] md:gap-14">
      <MolduraCelular
        rotulo="Conversa ilustrativa de atendimento da Saúde no WhatsApp"
        topo={
          <div className="flex items-center gap-3 border-b border-linha px-4 pb-3">
            <span aria-hidden="true" className="grid size-9 place-items-center rounded-full bg-raso text-[0.8rem] font-semibold text-cobalto">
              S
            </span>
            <span className="min-w-0">
              <span className="block truncate text-[0.95rem] font-semibold">Atendimento da Saúde</span>
              <span className="block text-[0.78rem] text-grafite">responde na hora</span>
            </span>
          </div>
        }
      >
        <ol className="zap flex flex-col gap-2 px-3 pt-3 pb-5">
          {CONVERSA.map((m, i) => (
            <li key={i} className={`flex flex-col ${m.de === 'pessoa' ? 'items-end' : 'items-start'}`}>
              <p
                className={`max-w-[86%] rounded-2xl px-3 py-2 text-[0.92rem] leading-snug ${
                  m.de === 'pessoa' ? 'zap-pessoa rounded-br-sm' : 'zap-robo rounded-bl-sm'
                }`}
              >
                <span className="sr-only">{m.de === 'pessoa' ? 'Pessoa: ' : 'Robô: '}</span>
                {m.texto}
                <span className="ml-2 align-bottom text-[0.7rem] opacity-70">{m.hora}</span>
              </p>
              {m.opcoes && (
                <ul className="mt-1.5 flex max-w-[86%] flex-wrap gap-1.5" aria-label="Opções do menu">
                  {m.opcoes.map((o) => (
                    <li key={o} className="rounded-full border border-cobalto px-2.5 py-1 text-[0.8rem] font-semibold text-cobalto">
                      {o}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ol>
      </MolduraCelular>

      <ul className="space-y-6">
        {LEITURA.map((l) => (
          <li key={l.titulo} className="grid grid-cols-[1.6rem_1fr] gap-x-3">
            <span aria-hidden="true" className="mt-[0.75em] h-[2px] w-5 bg-pitanga" />
            <div>
              <p className="font-display text-[1.2rem] font-semibold">{l.titulo}</p>
              <p className="mt-1 text-[1rem] leading-relaxed text-grafite">{l.texto}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
