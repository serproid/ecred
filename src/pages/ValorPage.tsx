import * as Slider from '@radix-ui/react-slider'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { Logo } from '../components/Logo'
import { ProgressBar } from '../components/ProgressBar'
import { useSimulation } from '../lib/simulation'

const INSTALLMENTS = [6, 12, 18, 24]
const MONTHLY_RATE = 0.0081

const formatCurrency = (value: number) =>
  value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

const calculateInstallment = (
  amount: number,
  rate: number,
  installments: number,
) =>
  (amount * (rate * Math.pow(1 + rate, installments))) /
  (Math.pow(1 + rate, installments) - 1)

export function ValorPage() {
  const navigate = useNavigate()
  const { data, update } = useSimulation()

  const installmentValue = calculateInstallment(
    data.amount,
    MONTHLY_RATE,
    data.installments,
  )
  const total = installmentValue * data.installments

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="py-5 px-4 md:px-8 z-10 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="max-w-2xl mx-auto w-full flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <Logo variant="light" className="text-3xl" />
          </Link>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft size={16} />
            Voltar
          </button>
        </div>
        <div className="max-w-2xl mx-auto w-full mt-4">
          <ProgressBar value={10} />
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
                Simulação
              </p>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-3">
                De quanto você precisa?
              </h1>
              <p className="text-muted-foreground max-w-md mx-auto">
                Arraste para escolher o valor. É grátis e sem compromisso.
              </p>
            </div>

            <div className="bg-card border border-border rounded-3xl p-6 md:p-8 shadow-xl mb-6">
              <div className="text-center mb-8">
                <div className="text-4xl font-black text-[#0f1712] tracking-tighter mb-6">
                  {formatCurrency(data.amount)}
                </div>

                <Slider.Root
                  className="relative flex w-full touch-none select-none items-center"
                  max={20000}
                  min={3000}
                  step={500}
                  value={[data.amount]}
                  onValueChange={(value) => update({ amount: value[0] })}
                >
                  <Slider.Track className="relative h-3.5 w-full grow overflow-hidden rounded-full bg-primary/20">
                    <Slider.Range className="absolute h-full bg-primary" />
                  </Slider.Track>
                  <Slider.Thumb className="relative block h-8 w-8 rounded-full border-4 border-primary bg-background shadow-lg transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 after:absolute after:-inset-4 after:content-['']" />
                </Slider.Root>

                <div className="flex justify-between text-xs text-muted-foreground mt-3 font-medium">
                  <span>R$ 3.000</span>
                  <span>R$ 20.000</span>
                </div>
              </div>

              <div className="border-t border-border pt-8">
                <h3 className="text-foreground font-semibold mb-4 text-center">
                  Em quantas parcelas?
                </h3>
                <div className="grid grid-cols-4 gap-2 mb-8">
                  {INSTALLMENTS.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => update({ installments: option })}
                      className={`py-3 rounded-xl font-bold text-lg transition-all ${
                        data.installments === option
                          ? 'bg-primary text-[#0f1712] shadow-lg scale-105'
                          : 'bg-muted text-muted-foreground hover:bg-muted/70'
                      }`}
                    >
                      {option}x
                    </button>
                  ))}
                </div>

                <div className="bg-muted rounded-2xl p-5 border border-border">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-muted-foreground">
                      Valor da parcela
                    </span>
                    <span className="text-2xl font-bold text-foreground">
                      {formatCurrency(installmentValue)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground">
                      Juros aprox. 0,81% a.m.
                    </span>
                    <span className="text-muted-foreground">
                      Total: {formatCurrency(total)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate('/cpf')}
              className="w-full inline-flex items-center justify-center gap-2 bg-primary text-[#0f1712] font-bold h-16 text-lg md:text-xl rounded-full transition-all hover:bg-primary/90 hover:scale-[1.02] shadow-[0_0_30px_rgba(180,240,69,0.25)]"
            >
              Continuar com {formatCurrency(data.amount)}
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
