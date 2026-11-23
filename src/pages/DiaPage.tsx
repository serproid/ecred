import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, CalendarCheck } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { Logo } from '../components/Logo'
import { ProgressBar } from '../components/ProgressBar'
import { firstInstallmentDate } from '../lib/loan'
import { useSimulation } from '../lib/simulation'

const DAYS = [5, 10, 15, 20, 25, 30]

export function DiaPage() {
  const navigate = useNavigate()
  const { data, update } = useSimulation()

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="py-5 px-4 md:px-8 z-10 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="max-w-2xl mx-auto w-full flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <Logo variant="light" className="text-3xl" />
          </Link>
          <button
            type="button"
            onClick={() => navigate('/aprovacao')}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft size={16} />
            Voltar
          </button>
        </div>
        <div className="max-w-2xl mx-auto w-full mt-4">
          <ProgressBar value={80} />
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-start p-4 md:p-8 pt-8 md:pt-12 w-full max-w-2xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.25 }}
          className="w-full"
        >
          <div className="w-full">
            <div className="text-center mb-8">
              <p className="text-xs font-bold text-[#2e5535] uppercase tracking-[0.15em] mb-3">
                Quase lá
              </p>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-3">
                Melhor dia para pagar
              </h1>
              <p className="text-muted-foreground max-w-md mx-auto">
                Escolha o dia do mês que combina com o seu orçamento.
              </p>
            </div>

            <div className="bg-card border border-border rounded-3xl p-5 md:p-7 shadow-xl mb-6">
              <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
                {DAYS.map((day) => {
                  const selected = data.paymentDay === day
                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => update({ paymentDay: day })}
                      aria-pressed={selected}
                      className={`rounded-2xl border-2 py-5 flex flex-col items-center justify-center transition-all ${
                        selected
                          ? 'border-primary bg-primary/10 shadow-[0_0_0_4px_rgba(180,240,69,0.12)]'
                          : 'border-border bg-background hover:border-[#2e5535]/40 hover:bg-muted/30'
                      }`}
                    >
                      <span
                        className={`text-[1.7rem] font-black leading-none tabular-nums ${
                          selected ? 'text-[#2e5535]' : 'text-foreground'
                        }`}
                      >
                        {day}
                      </span>
                      <span className="mt-1.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                        dia
                      </span>
                    </button>
                  )
                })}
              </div>

              {data.paymentDay > 0 ? (
                <div className="mt-5 flex items-center gap-3 rounded-2xl border border-[#2e5535]/15 bg-[#2e5535]/[0.06] px-4 py-3.5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#2e5535]/10">
                    <CalendarCheck size={20} className="text-[#2e5535]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground">
                      Vencimento todo dia {data.paymentDay}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      1ª parcela em {firstInstallmentDate(data.paymentDay)}
                    </p>
                  </div>
                </div>
              ) : null}
            </div>

            <button
              type="button"
              onClick={() => navigate('/endereco')}
              disabled={data.paymentDay === 0}
              className={`w-full inline-flex items-center justify-center gap-2 bg-primary text-[#0f1712] font-bold h-16 text-lg md:text-xl rounded-full transition-all ${
                data.paymentDay > 0
                  ? 'hover:bg-primary/90 hover:scale-[1.02] shadow-[0_0_30px_rgba(180,240,69,0.25)]'
                  : 'opacity-40 cursor-not-allowed'
              }`}
            >
              Continuar
              <ArrowRight size={20} />
            </button>
          </div>
        </motion.div>
      </main>

      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-primary/5 blur-[120px] rounded-full" />
      </div>
    </div>
  )
}
