import { motion } from 'framer-motion'
import { Check, Zap } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Header } from './Header'
import { LiveFeed } from './LiveFeed'
import { TransferCard } from './TransferCard'

const highlights = ['Aprova negativado', 'Sem fiador', 'Pix em 10 min']

export function Hero() {
  return (
    <section className="relative pb-16 md:pb-32 overflow-hidden bg-[#0b1410]">
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_15%_0%,rgba(180,240,69,0.18),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_50%_at_100%_100%,rgba(180,240,69,0.10),transparent_60%)]" />
        <div className="absolute inset-0 opacity-[0.05] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:44px_44px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_35%,#000_50%,transparent_100%)]" />
        <div className="absolute top-[-12%] left-[-6%] w-[45%] h-[45%] bg-primary/25 blur-[140px] rounded-full" />
        <div className="absolute bottom-[-14%] right-[-6%] w-[38%] h-[38%] bg-emerald-500/15 blur-[130px] rounded-full" />
      </div>

      <div className="relative z-10">
        <Header />
      </div>

      <div className="container mx-auto px-4 relative z-10 pt-10 md:pt-14">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
          <div className="flex-1 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/25 text-primary text-sm font-medium mb-6">
                <Zap size={16} className="text-primary fill-primary" />
                <span>Crédito pessoal pré-aprovado</span>
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6 leading-[1.1]">
                Até R$ 20.000 <br className="hidden md:block" />
                <span className="text-primary relative inline-block">
                  direto no seu PIX
                  <svg
                    className="absolute w-full h-3 -bottom-1 left-0 text-primary opacity-70"
                    viewBox="0 0 200 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M2 10C50 3 150 2 198 8"
                      stroke="currentColor"
                      strokeWidth="4"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </h1>

              <p className="text-lg md:text-xl text-white/70 mb-10 max-w-xl mx-auto lg:mx-0">
                Simule grátis sem sair de casa e receba via Pix,{' '}
                <span className="text-primary font-semibold">
                  mesmo negativado
                </span>
                . Crédito rápido, com parcelas que cabem no seu bolso.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                <Link
                  to="/valor"
                  className="btn-alive inline-flex items-center justify-center whitespace-nowrap w-full sm:w-auto bg-primary text-[#0f1712] font-bold h-14 px-8 text-lg rounded-full shadow-[0_0_30px_rgba(180,240,69,0.3)] hover:shadow-[0_0_40px_rgba(180,240,69,0.5)] hover:scale-105 transition-all"
                >
                  Simular meu crédito
                </Link>
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-center lg:justify-start gap-x-5 gap-y-2 text-sm text-white/70">
                {highlights.map((label) => (
                  <div className="flex items-center gap-1.5" key={label}>
                    <Check
                      size={15}
                      className="text-primary shrink-0"
                      strokeWidth={3}
                    />
                    <span className="whitespace-nowrap">{label}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          <div className="flex-1 w-full max-w-md mx-auto lg:max-w-none relative">
            <TransferCard />
          </div>
        </div>
      </div>

      <div className="mt-16 md:mt-20 relative z-10">
        <LiveFeed />
      </div>
    </section>
  )
}
