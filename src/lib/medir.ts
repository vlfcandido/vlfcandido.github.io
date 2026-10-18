// Medição de etapas do hero no Microsoft Clarity (18/10/2026). Só o nome da etapa sai daqui: nenhum texto
// digitado, escolha ou dado do visitante entra no evento. Função pura com enviador injetável para o teste.

/** Formato aceito do nome da etapa: `hero_` e letras minúsculas, números e sublinhado. */
const FORMATO = /^hero_[a-z0-9_]+$/

/**
 * Envia um evento de etapa para o Clarity, quando ele existe na página.
 *
 * O Clarity pode estar bloqueado, ausente ou ainda carregando. A medição nunca pode quebrar a interface, por isso
 * qualquer falha é engolida. O teste injeta o enviador; a página usa `window.clarity('event', ...)`.
 *
 * @param evento nome da etapa, no formato `hero_<etapa>`.
 * @param enviar função que entrega o evento (padrão: a API do Clarity, se disponível).
 */
export function medir(evento: string, enviar?: (nome: string) => void): void {
  if (!FORMATO.test(evento)) return
  try {
    const alvo = enviar ?? ((nome: string) => {
      const clarity = (globalThis as { clarity?: (acao: string, valor: string) => void }).clarity
      clarity?.('event', nome)
    })
    alvo(evento)
  } catch {
    // Medição é acessório: se o script de terceiro falhar, a página segue.
  }
}
