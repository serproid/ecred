import { Link } from 'react-router-dom'
import { getBrandName } from '../lib/brand'
import { Logo } from './Logo'

export function Footer() {
  return (
    <footer className="bg-[#0f1712] text-white/60 py-12 border-t border-[#1a231d]">
      <div className="container mx-auto px-4 flex flex-col items-center text-center">
        <Link to="/" className="inline-flex items-center mb-8">
          <Logo variant="dark" className="text-3xl" />
        </Link>

        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8 mb-8 text-sm font-medium">
          <Link
            to="/valor"
            className="text-white hover:text-primary transition-colors"
          >
            Simular
          </Link>
          <a
            href="/privacidade"
            className="text-white hover:text-primary transition-colors"
          >
            Política de Privacidade
          </a>
          <a
            href="/termos"
            className="text-white hover:text-primary transition-colors"
          >
            Termos de Uso
          </a>
        </div>

        <div className="w-full max-w-3xl h-px bg-white/10 mb-8" />

        <div className="space-y-3 text-xs max-w-4xl">
          <p>
            CNPJ 78.013.904/0001-49 · Taxas a partir de 0,81% a.m. · CET
            informado antes da contratação
          </p>
          <p>
            A {getBrandName()} nunca cobra valores antecipados para liberar
            crédito.
          </p>
          <p className="pt-2 opacity-50">
            © 2026 {getBrandName()} Serviços Financeiros S.A.
          </p>
        </div>
      </div>
    </footer>
  )
}
