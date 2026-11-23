import { PixIcon, ShieldIcon } from './icons'

export function CtaBand() {
  return (
    <section className="cta-section">
      <div className="container">
        <div className="cta-band">
          <h2>Seu crédito está a um Pix de distância</h2>
          <p>Simulação gratuita e resposta na hora.</p>
          <button type="button" className="btn btn--lime">
            Simular agora, leva 1 minuto
          </button>
          <div className="cta-band__meta">
            <span>
              <PixIcon size={13} />
              PIX Banco Central
            </span>
            <span>
              <ShieldIcon size={13} />
              Dados protegidos (LGPD)
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
