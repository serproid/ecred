import { motion } from 'framer-motion'
import { FileText, Gauge, Lock, Wallet, Zap } from 'lucide-react'
import { getBrandName } from '../lib/brand'

const features = [
  {
    icon: Wallet,
    title: 'Cabe no bolso',
    desc: 'Parcelas planejadas pra caber no seu orçamento, sem sufoco.',
  },
  {
    icon: Gauge,
    title: 'Aprova negativado',
    desc: 'Analisamos seu perfil completo, não só o score.',
  },
  {
    icon: FileText,
    title: 'Sem burocracia',
    desc: 'Tudo online, sem fiador e sem papelada.',
  },
  {
    icon: Lock,
    title: '100% seguro',
    desc: 'Seus dados protegidos do início ao fim.',
  },
]

export function WhyEcred() {
  return (
    <section className="bg-[#f4f7f4] py-14 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-10 md:mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0f1712] tracking-tight flex items-center justify-center gap-3 md:gap-4">
            <span
              aria-hidden="true"
              className="h-[3px] w-8 md:w-10 rounded-full bg-[#2e5535]/60"
            />
            Por que a {getBrandName()}?
            <span
              aria-hidden="true"
              className="h-[3px] w-8 md:w-10 rounded-full bg-[#2e5535]/60"
            />
          </h2>
          <p className="text-[#0f1712]/60 text-lg mt-4">
            Crédito pessoal pensado pra quem o banco{' '}
            <span className="relative inline-block font-bold text-[#0f1712]/45 whitespace-nowrap">
              disse não
              <motion.span
                aria-hidden="true"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4, ease: 'easeOut' }}
                className="absolute left-[-2px] right-[-2px] top-1/2 h-[3px] -translate-y-1/2 rounded-full bg-red-500/45 origin-left"
              />
            </span>
            : rápido e sem complicação.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl bg-[#0f1712] px-5 py-4 md:px-6 md:py-5 mb-5 flex items-center gap-4"
          >
            <div
              aria-hidden="true"
              className="absolute right-[-45px] top-[-70px] w-52 h-52 md:w-60 md:h-60 rounded-full bg-white/[0.05] pointer-events-none"
            />
            <span className="relative shrink-0 w-10 h-10 md:w-11 md:h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
              <Zap size={18} className="text-primary fill-primary" />
            </span>
            <div className="relative">
              <h3 className="text-white font-semibold text-base md:text-lg">
                Dinheiro na hora, via Pix
              </h3>
              <p className="text-white/70 text-sm leading-snug">
                Depois da aprovação, o valor cai direto na sua conta em até 20
                minutos.
              </p>
            </div>
          </motion.div>

          <div className="grid grid-cols-2 gap-3 md:gap-5">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.06 }}
                  className="rounded-3xl border border-[#0f1712]/10 bg-white p-4 md:p-6 shadow-[0_1px_10px_rgba(15,23,18,0.04)]"
                >
                  <span className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-[#2e5535]/10 flex items-center justify-center mb-3 md:mb-4">
                    <Icon size={19} className="text-[#2e5535]" />
                  </span>
                  <h3 className="text-[#0f1712] font-bold text-base md:text-lg mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-[#0f1712]/60 text-sm leading-relaxed">
                    {feature.desc}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
