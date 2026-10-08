import type { Cliente } from '../clientes'
import { caminhoPublico } from '../lib/assets'

/** Logos com fundo próprio: viram cinza em vez de silhueta, para não virar um bloco sólido. */
const COM_FUNDO = new Set(['b2w', 'unimed-poa', 'yara', 'governo-rj'])

/** Logos vindas da lista da Vertigo (150x100 com margem embutida): ampliadas para igualar o peso visual. */
const COM_MARGEM = new Set(['adasa', 'anbima', 'araguaia', 'arcelormittal', 'b2w', 'b3', 'banco-do-brasil', 'bs2', 'cni', 'cnp-seguros', 'governo-rj', 'grupo-petropolis', 'ibge', 'icatu', 'itau', 'monsanto', 'mprj', 'mpsp', 'petrobras', 'pg', 'prefeitura-rio', 'queiroz-galvao', 'rodonaves', 'semad-mg', 'sharecare', 'sofisa', 'sompo', 'sulamerica', 'tim', 'tjrj', 'unimed', 'valia', 'vicunha'])

/**
 * Logos claras no original (brancas ou cinza-claro; medido em 07/10/2026 pela luminância média dos
 * pixels opacos: acima de 0,3 ou mais da metade quase branca). Na cor original sobre placa branca
 * ficavam ilegíveis; no destaque ganham placa escura e, em link no tema claro, ficam na silhueta.
 */
const CLARAS = new Set(['ab-inbev', 'adasa', 'anbima', 'araguaia', 'arcelormittal', 'b2w', 'b3', 'banco-do-brasil', 'bluefit', 'bs2', 'bulbe', 'cni', 'cnp-seguros', 'comgas', 'gpa', 'governo-rj', 'grupo-petropolis', 'ibge', 'icatu', 'itau', 'minu', 'monsanto', 'mprj', 'mpsp', 'neon', 'olx', 'petrobras', 'pg', 'pobre-juan', 'prefeitura-franca', 'prefeitura-rio', 'queiroz-galvao', 'rodonaves', 'scania', 'semad-mg', 'sharecare', 'sofisa', 'sompo', 'sulamerica', 'tigre', 'tim', 'tjpr', 'tjrj', 'tjrr', 'unimed', 'valia', 'vicunha'])

/**
 * Diz se a logo é clara no original e precisa de fundo escuro para aparecer em cor.
 *
 * @param slug slug do cliente em `clientes.ts`.
 * @returns `true` para as logos brancas ou cinza-claro.
 */
export function logoClara(slug: string): boolean {
  return CLARAS.has(slug)
}

interface LogoProps {
  cliente: Cliente
  className?: string
}

/** Logo oficial em tinta única; sem arquivo, mostra o nome em texto no mesmo espaço. */
export function Logo({ cliente, className = 'h-9 max-w-[132px]' }: LogoProps) {
  if (!cliente.logo) {
    return <span className="nome-logo text-[1rem] leading-tight font-semibold text-grafite">{cliente.nome}</span>
  }
  return (
    <img
      src={caminhoPublico(import.meta.env.BASE_URL, cliente.logo)}
      alt={cliente.nome}
      loading="lazy"
      decoding="async"
      className={`logo-mono w-auto object-contain ${COM_FUNDO.has(cliente.slug) ? 'com-fundo' : ''} ${CLARAS.has(cliente.slug) ? 'clara' : ''} ${COM_MARGEM.has(cliente.slug) ? 'origin-left scale-[1.6]' : ''} ${className}`}
    />
  )
}
