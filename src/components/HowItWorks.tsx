import { CheckIcon } from './icons'

const steps = [
  {
    title: 'Faça sua simulação',
    text: 'Escolha o valor que você precisa e clique em solicitar.',
  },
  {
    title: 'Análise rápida',
    text: 'Confirmamos seus dados e analisamos o seu perfil na hora.',
  },
  {
    title: 'Liberação em até 10 minutos',
    text: 'Aprovado, o valor cai direto na sua conta via Pix.',
  },
]

export function HowItWorks() {
  return (
    <section className="how">
      <div className="container">
        <div className="section-head">
          <h2 className="section-title">Como funciona?</h2>
        </div>

        <ol className="steps">
          {steps.map((step, index) => {
            const isActive = index === steps.length - 1
            return (
              <li
                className={`steps__item${isActive ? ' steps__item--active' : ''}`}
                key={step.title}
              >
                <span className="steps__num">{index + 1}</span>
                <h3 className="steps__title">{step.title}</h3>
                <p className="steps__desc">{step.text}</p>
              </li>
            )
          })}
        </ol>

        <p className="steps__pill">
          <CheckIcon size={14} />
          Tudo 100% online: do simulador ao Pix na sua conta.
        </p>
      </div>
    </section>
  )
}
