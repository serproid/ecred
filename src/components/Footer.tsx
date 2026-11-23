import { Logo } from './Logo'

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <Logo />
        <nav className="site-footer__links">
          <a href="#simular">Simular</a>
          <a href="#privacidade">Política de Privacidade</a>
          <a href="#termos">Termos de Uso</a>
        </nav>
        <div className="site-footer__legal">
          <p>
            CNPJ 78.567.904/0001-49 · Taxa a partir de 0,81% a.m. · CET informado
            antes da contratação.
          </p>
          <p>
            A Ecred nunca cobra valores antecipados pela liberação de crédito.
          </p>
        </div>
        <p className="site-footer__copy">
          © 2026 Ecred Serviços Financeiros S.A.
        </p>
      </div>
    </footer>
  )
}
