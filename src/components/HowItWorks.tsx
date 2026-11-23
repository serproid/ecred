import { motion } from 'framer-motion'
import { Check } from 'lucide-react'

const steps = [
  {
    titulo: 'Faça sua simulação',
    desc: 'Escolha o valor que você precisa e clique em solicitar.',
  },
  {
    titulo: 'Análise rápida',
    desc: 'Confirmamos seus dados e analisamos o seu perfil na hora.',
  },
  {
    titulo: 'Liberação em até 10 minutos',
    desc: 'Aprovado, o valor cai direto na sua conta via Pix.',
  },
]

export function HowItWorks() {
  return (
    <section id="como-funciona" className="bg-[#f4f7f4] py-14 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-8 md:mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0f1712] tracking-tight flex items-center justify-center gap-3 md:gap-4">
            <span
              aria-hidden="true"
              className="h-[3px] w-8 md:w-10 rounded-full bg-[#2e5535]/60"
            />
            Como funciona?
            <span
              aria-hidden="true"
              className="h-[3px] w-8 md:w-10 rounded-full bg-[#2e5535]/60"
            />
          </h2>
        </div>

        <div className="max-w-md mx-auto">
          <ol>
            {steps.map((step, index) => {
              const isLast = index === steps.length - 1
              return (
                <motion.li
                  key={step.titulo}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                  className="flex gap-4"
                >
                  <div className="flex flex-col items-center">
                    <span
                      className={`shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-sm font-black ${
                        isLast
                          ? 'bg-primary text-[#0f1712] ring-4 ring-primary/25'
                          : 'bg-[#0f1712] text-white'
                      }`}
                    >
                      {index + 1}
                    </span>
                    <span
                      aria-hidden="true"
                      className="w-0 flex-1 my-1.5 border-l-2 border-dashed border-[#2e5535]/30"
                    />
                  </div>
                  <div className="pb-7">
                    <h3 className="text-base md:text-lg font-bold text-[#0f1712] leading-snug pt-1.5">
                      {step.titulo}
                    </h3>
                    <p className="text-sm md:text-[15px] text-[#0f1712]/60 leading-snug mt-1">
                      {step.desc}
                    </p>
                  </div>
                </motion.li>
              )
            })}
          </ol>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.24 }}
            className="rounded-2xl md:rounded-full bg-white border border-[#0f1712]/5 shadow-[0_1px_10px_rgba(15,23,18,0.04)] px-4 py-3 md:px-6 flex items-center gap-3"
          >
            <span className="shrink-0 w-6 h-6 rounded-full bg-[#2e5535] flex items-center justify-center">
              <Check size={13} className="text-white" strokeWidth={3.5} />
            </span>
            <p className="font-semibold text-[#0f1712] text-sm">
              Tudo 100% online: do simulador ao Pix na sua conta.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
