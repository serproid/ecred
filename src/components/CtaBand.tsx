import { motion } from 'framer-motion'
import { QrCode, ShieldCheck } from 'lucide-react'
import { Link } from 'react-router-dom'

export function CtaBand() {
  return (
    <section className="py-12 md:py-20 bg-[#f4f7f4] px-4">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-[#0f1712] rounded-[2rem] px-6 py-8 md:px-10 md:py-10 text-center shadow-[0_20px_50px_-15px_rgba(180,240,69,0.18)] relative overflow-hidden max-w-2xl mx-auto"
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[75%] h-[75%] bg-primary/20 blur-[100px] rounded-full pointer-events-none" />

          <div className="relative z-10">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-1.5 tracking-tight">
              Seu crédito está a um <span className="text-primary">Pix</span> de
              distância
            </h2>
            <p className="text-white/60 text-sm mb-5 max-w-xl mx-auto">
              Simulação gratuita e resposta na hora.
            </p>
            <Link
              to="/valor"
              className="inline-flex items-center justify-center whitespace-nowrap bg-primary hover:bg-primary/90 text-[#0f1712] font-bold h-12 px-7 text-base rounded-full shadow-[0_0_30px_rgba(180,240,69,0.35)] hover:shadow-[0_0_45px_rgba(180,240,69,0.55)] hover:scale-105 transition-all"
            >
              Simular agora, leva 1 minuto
            </Link>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-4 md:gap-x-6 gap-y-1.5 text-[11px] md:text-xs text-white/55">
              <span className="flex items-center gap-1.5">
                <QrCode size={13} className="text-primary shrink-0" />
                PIX Banco Central
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck size={13} className="text-primary shrink-0" />
                Dados protegidos (LGPD)
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
