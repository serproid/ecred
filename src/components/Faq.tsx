import { useState } from 'react'
import { ChevronDownIcon } from './icons'

const questions = [
  {
    q: 'Como recebo o dinheiro?',
    a: 'Após a aprovação, o valor é transferido diretamente para a sua conta via Pix, em até 10 minutos.',
  },
  {
    q: 'Fazer a simulação afeta meu score?',
    a: 'Não. A simulação é gratuita e não consulta o SPC ou Serasa, então não afeta o seu score.',
  },
  {
    q: 'Quais são as taxas de juros?',
    a: 'As taxas são informadas de forma transparente antes da contratação, com parcelas fixas que cabem no seu orçamento.',
  },
  {
    q: 'Preciso pagar alguma taxa antecipada?',
    a: 'Não. A Ecred nunca cobra qualquer valor antecipado para liberar o crédito.',
  },
  {
    q: 'Quem pode solicitar?',
    a: 'Qualquer pessoa maior de 18 anos com CPF regular e conta bancária, mesmo negativada.',
  },
]

export function Faq() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section className="faq">
      <div className="container">
        <div className="section-head">
          <h2 className="section-title section-title--plain">
            Dúvidas Frequentes
          </h2>
          <p className="section-sub">
            Tudo que você precisa saber antes de contratar.
          </p>
        </div>

        <div className="faq__list">
          {questions.map((item, index) => {
            const isOpen = open === index
            return (
              <div
                className={`faq__item${isOpen ? ' faq__item--open' : ''}`}
                key={item.q}
              >
                <button
                  type="button"
                  className="faq__q"
                  onClick={() => setOpen(isOpen ? null : index)}
                  aria-expanded={isOpen}
                >
                  {item.q}
                  <ChevronDownIcon />
                </button>
                <div className="faq__a">
                  <p className="faq__a-inner">{item.a}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
