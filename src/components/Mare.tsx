// Motivo e ilustrações da identidade Maré, desenhados inline para seguir o tema (currentColor e
// variáveis CSS). Os mesmos desenhos estão no design system, em assets/Ilustracoes e assets/Motivo.
// Regra da identidade: motivo em no máximo três lugares por página (abertura, um separador e o
// rodapé) e no máximo uma ilustração por dobra de tela. Tudo é decorativo e fica fora do leitor de tela.

/** Nomes das ilustrações de traço único da Maré. */
export type NomeIlustracao = 'tartaruga' | 'baleia' | 'gaivota' | 'folha' | 'rosa-dos-ventos' | 'onda'

const TRACOS: Record<NomeIlustracao, string[]> = {
  tartaruga: [
    'M21 33a11 14 0 1 0 22 0a11 14 0 1 0 -22 0',
    'M28 19.5C28 13 36 13 36 19.5',
    'M22 27C15 22 10 22 6 25C11 28 16 31 21.4 32',
    'M42 27C49 22 54 22 58 25C53 28 48 31 42.6 32',
    'M23.6 42C19 44 17 47 17 50C21 49 24 47 26 45',
    'M40.4 42C45 44 47 47 47 50C43 49 40 47 38 45',
    'M32 47V51',
    'M32 25L37 29V37L32 41L27 37V29Z',
    'M27 29L22.4 27M37 29L41.6 27M27 37L22.6 40M37 37L41.4 40M32 25V19M32 41V47',
  ],
  baleia: [
    'M31 33C25 33 15 29 10 21C17 23 25 24 32 28C39 24 47 23 54 21C49 29 39 33 33 33',
    'M31 33C31 37 31 41 30 46M33 33C33 37 33 41 34 46',
    'M8 46C13 43 18 49 23 46C26 44 28 46 30 46M34 46C36 46 38 44 41 46C46 49 51 43 56 46',
    'M14 53C19 50 24 56 29 53C34 50 39 56 44 53C47 51 49 52 50 53',
  ],
  gaivota: [
    'M6 34C12 27 20 26 27 33L32 37L37 33C44 26 52 27 58 34',
    'M30.5 35.5L32 39L33.5 35.5',
    'M38 17C40 14.5 42.5 14.5 45 17.5C47.5 14.5 50 14.5 52 17',
  ],
  folha: [
    'M32 46C18 40 14 24 32 8C50 24 46 40 32 46Z',
    'M32 57V14',
    'M32 38L23 31M32 38L41 31M32 30L25 24M32 30L39 24M32 22L28 18M32 22L36 18',
  ],
  'rosa-dos-ventos': [
    'M13 32a19 19 0 1 0 38 0a19 19 0 1 0 -38 0',
    'M32 4L36 28L56 32L36 36L32 58L28 36L8 32L28 28Z',
    'M28 28L32 32L36 28M36 36L32 32L28 36',
    'M41 23L45 19M23 23L19 19M41 41L45 45M23 41L19 45',
  ],
  onda: [
    'M6 44C14 44 18 36 22 28C26 20 34 14 42 16C50 18 52 28 46 32C42 35 37 32 38 28C39 25 43 25 44 27',
    'M6 44C20 44 34 46 58 44',
    'M10 52C18 50 26 54 34 52C42 50 50 54 58 52',
  ],
}

/**
 * Ilustração de traço único (grade de 64, traço de 2px) na cor do texto ao redor.
 *
 * @param nome qual desenho mostrar.
 * @param className tamanho e cor (ex.: `size-16 text-mar`).
 */
export function Ilustracao({ nome, className = 'size-16' }: { nome: NomeIlustracao; className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      aria-hidden="true"
      focusable="false"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {TRACOS[nome].map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  )
}

/**
 * Isóbatas: as linhas de contorno de profundidade das cartas náuticas, com uma marca fechada em
 * coral e as profundidades em itálico. É o motivo gráfico da Maré, sempre atrás e de lado.
 *
 * @param className posição e tamanho do desenho.
 */
export function Isobatas({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 480 240" aria-hidden="true" focusable="false" className={className} fill="none" preserveAspectRatio="xMidYMid slice">
      <g stroke="var(--linha)" strokeWidth={1.5} strokeLinecap="round">
        <path d="M0 212C70 204 104 168 160 166C214 164 236 214 296 210C356 206 404 162 480 158" />
        <path d="M0 166C56 150 90 112 148 114C212 116 240 160 304 156C366 152 402 102 480 98" />
        <path d="M0 132C52 114 86 76 146 78C214 80 244 124 308 120C372 116 404 64 480 60" />
        <path d="M0 92C40 80 70 30 136 34C200 38 252 70 318 70C380 70 410 20 480 14" />
      </g>
      <path d="M190 116C196 107 214 106 221 113C227 120 211 125 200 123C192 121 187 120 190 116Z" stroke="var(--coral)" strokeWidth={1.75} />
      <g fill="var(--fundo-suave)" fontFamily="var(--font-display)" fontStyle="italic" fontSize="11">
        <text x="70" y="186">12</text>
        <text x="254" y="146">18</text>
        <text x="380" y="92">25</text>
      </g>
    </svg>
  )
}

/** Separador de seção: uma isóbata só, com a largura do conteúdo. */
export function SeparadorMare() {
  return (
    <div aria-hidden="true" className="py-2">
      <svg viewBox="0 0 1200 24" preserveAspectRatio="none" className="h-6 w-full" fill="none">
        <path
          d="M0 14C120 6 220 20 340 14C460 8 540 4 600 12C680 22 780 18 880 10C980 2 1080 16 1200 10"
          stroke="var(--linha)"
          strokeWidth={1.5}
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  )
}
