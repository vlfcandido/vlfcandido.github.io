import { perfil } from '../conteudo'

/** Rodapé simples com o nome e o ano corrente. */
export function Rodape() {
  return (
    <footer className="border-t border-linha">
      <div className="mx-auto max-w-6xl px-4 py-6 font-mono text-xs text-suave sm:px-6">
        © {new Date().getFullYear()} {perfil.nome} · site estático, feito com Vite, React e Tailwind
      </div>
    </footer>
  )
}
