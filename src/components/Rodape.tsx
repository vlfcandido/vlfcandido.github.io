// Rodapé do site novo (14/10/2026). Antes: isóbatas, gaivota e a faixa da carta náutica da Maré (ver git log).
import { links, perfil } from '../conteudo'
import { Marcacao } from '../home/Marcacao'
import { SITE } from '../lib/site'
import { GITHUB, LINKEDIN } from '../visuais'

/** Linha da medição de visitas (spec §3): no rodapé, sem position fixed. */
export const AVISO_MEDICAO = 'Visitas medidas de forma anônima, sem gravar o que é digitado.'

/** Ícone de link externo, alinhado à altura do texto. */
function Saida() {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" focusable="false">
      <path d="M6 3.5h6.5V10M12.5 3.5 4 12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/**
 * Rodapé: o endereço do site, o LinkedIn, o 99Freelas e o GitHub, a assinatura "feito por Vinicius Candido" (com o marca-texto
 * da identidade no nome), o aviso de marcas e dados de exemplo e a linha da medição anônima.
 */
export function Rodape() {
  const base = import.meta.env.BASE_URL
  // 15/10/2026: o 99Freelas veio da linha de perfis de #/projetos para cá (antes só LinkedIn e GitHub).
  const noventaENove = links.find((l) => l.rotulo === '99Freelas')
  return (
    <footer className="rodape">
      <div className="mx-auto max-w-7xl px-4 pt-12 pb-[max(48px,calc(env(safe-area-inset-bottom)+32px))] sm:px-8">
        {/* Assinatura com o endereço embaixo (como a marca do cabeçalho) e, ao lado, os perfis. */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col items-start">
            <p className="rodape-assinatura">
              feito por <Marcacao tipo="grifo">{perfil.nome}</Marcacao>
            </p>
            <a href={base} className="rodape-site text-sm">
              {SITE}
            </a>
          </div>
          <ul className="rodape-links" aria-label="Perfis">
            <li>
              <a href={LINKEDIN} target="_blank" rel="noopener">
                LinkedIn
                <Saida />
                <span className="sr-only"> (abre em nova aba)</span>
              </a>
            </li>
            {noventaENove && (
              <li>
                <a href={noventaENove.url} target="_blank" rel="noopener">
                  99Freelas
                  <Saida />
                  <span className="sr-only"> (abre em nova aba)</span>
                </a>
              </li>
            )}
            <li>
              <a href={GITHUB} target="_blank" rel="noopener">
                GitHub
                <Saida />
                <span className="sr-only"> (abre em nova aba)</span>
              </a>
            </li>
          </ul>
        </div>
        <div className="mt-8 space-y-1 border-t border-linha pt-6 text-sm text-grafite">
          <p>
            {perfil.nome}, {new Date().getFullYear()}. Marcas e logos são das próprias empresas. Os exemplos usam
            dados fictícios. Ilustrações geradas com IA e editadas por Vinicius Candido.
          </p>
          <p>{AVISO_MEDICAO}</p>
        </div>
      </div>
    </footer>
  )
}
