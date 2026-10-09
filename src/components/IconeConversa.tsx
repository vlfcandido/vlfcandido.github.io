/**
 * Glifo próprio do contato por WhatsApp: um balão de conversa retangular com um fone dentro.
 * Desenho do site (não é o logotipo oficial); herda a cor do texto e é decorativo para leitor de tela,
 * porque o texto do botão já diz para onde o link leva.
 */
export function IconeConversa({ tamanho = 20, className }: { tamanho?: number; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width={tamanho} height={tamanho} aria-hidden="true" focusable="false" className={className}>
      <path
        d="M5 4.5h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-8.5L6 20.6v-3.1H5a2 2 0 0 1-2-2v-9a2 2 0 0 1 2-2Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M9.2 8.3c.3-.3.8-.3 1 .1l.8 1.4c.2.3.1.7-.1.9l-.5.5c.4.9 1.1 1.6 2 2l.5-.5c.2-.2.6-.3.9-.1l1.4.8c.4.2.4.7.1 1l-.6.6c-.6.6-1.6.7-2.4.3a7.4 7.4 0 0 1-3.6-3.6c-.4-.8-.3-1.8.3-2.4Z"
        fill="currentColor"
      />
    </svg>
  )
}
