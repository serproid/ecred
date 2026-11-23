import { BoltIcon, DocIcon, GaugeIcon, LockIcon, WalletIcon } from './icons'

const features = [
  {
    icon: <WalletIcon />,
    title: 'Cabe no bolso',
    text: 'Parcelas pensadas para caber no seu orçamento, sem sufoco.',
  },
  {
    icon: <GaugeIcon />,
    title: 'Aprova negativado',
    text: 'Analisamos seu perfil completo, não só o score.',
  },
  {
    icon: <DocIcon />,
    title: 'Sem burocracia',
    text: 'Tudo online, sem fiador e sem papelada.',
  },
  {
    icon: <LockIcon />,
    title: '100% seguro',
    text: 'Seus dados protegidos do início ao fim.',
  },
]

export function WhyEcred() {
  return (
    <section className="why">
      <div className="container">
        <div className="narrow">
          <div className="section-head">
            <h2 className="section-title">Por que a Ecred?</h2>
            <p className="section-sub">
              Crédito pessoal pensado para quem o banco disse não. Rápido e sem
              complicação.
            </p>
          </div>

          <div className="highlight-card">
            <span className="highlight-card__icon">
              <BoltIcon size={18} />
            </span>
            <div>
              <h3>Dinheiro na hora, via Pix</h3>
              <p>
                Depois da aprovação, o valor cai direto na sua conta em até 20
                minutos.
              </p>
            </div>
          </div>

          <div className="why__grid">
            {features.map((feature) => (
              <article className="feature" key={feature.title}>
                <span className="feature__icon">{feature.icon}</span>
                <h3>{feature.title}</h3>
                <p>{feature.text}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
