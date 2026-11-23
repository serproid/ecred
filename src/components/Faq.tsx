import * as Accordion from '@radix-ui/react-accordion'
import { ChevronDown } from 'lucide-react'
import type { CSSProperties } from 'react'

const faqs = [
  {
    q: 'Como recebo o dinheiro?',
    a: 'Assim que a aprovação é confirmada e você assina o contrato digitalmente, o dinheiro cai na sua conta pelo PIX na hora. Em média, tudo acontece em menos de 20 minutos. Nosso sistema é 100% automático e está disponível 24 horas por dia, 7 dias por semana, inclusive aos finais de semana e feriados.',
  },
  {
    q: 'Fazer a simulação afeta meu score?',
    a: 'Não. Nossa simulação inicial não consulta órgãos de proteção ao crédito, como SPC e Serasa. Apenas se você decidir prosseguir com a contratação faremos a consulta, que será informada previamente.',
  },
  {
    q: 'Quais são as taxas de juros?',
    a: 'As taxas variam de acordo com a análise do seu perfil de crédito, a partir de 0,81% ao mês. O Custo Efetivo Total (CET) sempre será apresentado de forma transparente antes de qualquer assinatura de contrato.',
  },
  {
    q: 'Preciso pagar alguma taxa antecipada?',
    a: 'Não. Nunca solicitaremos nenhum depósito ou pagamento antecipado para liberar o seu crédito. Não há nenhuma taxa cobrada antes da liberação do valor.',
  },
  {
    q: 'Quem pode solicitar?',
    a: 'Qualquer pessoa maior de 18 anos, com CPF regular, comprovante de renda e conta bancária (PIX) em seu nome.',
  },
]

export function Faq() {
  return (
    <section id="faq" className="py-14 md:py-24 bg-[#f4f7f4]">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            Dúvidas Frequentes
          </h2>
          <p className="text-muted-foreground">
            Tudo que você precisa saber antes de contratar.
          </p>
        </div>

        <Accordion.Root type="single" collapsible className="w-full">
          {faqs.map((item, index) => (
            <Accordion.Item
              key={item.q}
              value={`item-${index}`}
              className="border-b border-border mb-4 bg-card rounded-2xl px-6 transition-colors shadow-sm"
            >
              <Accordion.Header className="flex">
                <Accordion.Trigger className="flex flex-1 items-center justify-between py-4 text-sm font-medium transition-all text-left [&[data-state=open]>svg]:rotate-180 text-foreground hover:text-[#2e5535] data-[state=open]:text-[#2e5535] hover:no-underline font-semibold text-lg py-6">
                  {item.q}
                  <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200" />
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Content
                style={
                  {
                    '--radix-accordion-content-height':
                      'var(--radix-collapsible-content-height)',
                  } as CSSProperties
                }
                className="overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
              >
                <div className="pb-6 pt-0 text-muted-foreground text-base leading-relaxed">
                  {item.a}
                </div>
              </Accordion.Content>
            </Accordion.Item>
          ))}
        </Accordion.Root>
      </div>
    </section>
  )
}
