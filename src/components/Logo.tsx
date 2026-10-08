import type { Cliente } from '../clientes'
import { caminhoPublico } from '../lib/assets'

/** Logos com fundo próprio: viram cinza em vez de silhueta, para não virar um bloco sólido. */
const COM_FUNDO = new Set(['b2w', 'unimed-poa', 'yara', 'governo-rj'])

/** Logos vindas da lista da Vertigo (150x100 com margem embutida): ampliadas para igualar o peso visual. */
const COM_MARGEM = new Set(['adasa', 'anbima', 'araguaia', 'arcelormittal', 'b2w', 'b3', 'banco-do-brasil', 'bs2', 'cni', 'cnp-seguros', 'governo-rj', 'grupo-petropolis', 'ibge', 'icatu', 'itau', 'monsanto', 'mprj', 'mpsp', 'petrobras', 'pg', 'prefeitura-rio', 'queiroz-galvao', 'rodonaves', 'semad-mg', 'sharecare', 'sofisa', 'sompo', 'sulamerica', 'tim', 'tjrj', 'unimed', 'valia', 'vicunha'])

interface LogoProps {
  cliente: Cliente
  className?: string
}

/** Logo oficial em tinta única; sem arquivo, mostra o nome em texto no mesmo espaço. */
export function Logo({ cliente, className = 'h-9 max-w-[132px]' }: LogoProps) {
  if (!cliente.logo) {
    return <span className="text-[1rem] leading-tight font-semibold text-grafite">{cliente.nome}</span>
  }
  return (
    <img
      src={caminhoPublico(import.meta.env.BASE_URL, cliente.logo)}
      alt={cliente.nome}
      loading="lazy"
      decoding="async"
      className={`logo-mono w-auto object-contain ${COM_FUNDO.has(cliente.slug) ? 'com-fundo' : ''} ${COM_MARGEM.has(cliente.slug) ? 'origin-left scale-[1.6]' : ''} ${className}`}
    />
  )
}
