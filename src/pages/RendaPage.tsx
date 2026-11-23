import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Check } from 'lucide-react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Logo } from '../components/Logo'
import { ProgressBar } from '../components/ProgressBar'
import {
  formatCurrencyInput,
  onlyDigits,
  parseCurrency,
} from '../lib/formatters'
import { useSimulation } from '../lib/simulation'

const baseInput =
  'flex w-full border py-1 shadow-sm placeholder:text-muted-foreground/45 focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50 h-14 bg-background border-border text-lg rounded-xl focus-visible:ring-primary focus-visible:border-primary'

export function RendaPage() {
  const navigate = useNavigate()
  const { data, update } = useSimulation()

  const hasSalary = parseCurrency(data.salary) > 0
  const canContinue =
    data.noIncome || (hasSalary && data.incomeDay > 0)

  const toggleNoIncome = () =>
    update({
      noIncome: !data.noIncome,
      salary: data.noIncome ? data.salary : '',
      incomeDay: data.noIncome ? data.incomeDay : 0,
    })

  const handleSalaryChange = (value: string) =>
    update({ salary: formatCurrencyInput(value), noIncome: false })

  const handleSalaryFocus = () => {
    if (data.noIncome) update({ noIncome: false })
  }

  const handleIncomeDayChange = (value: string) => {
    const digits = onlyDigits(value).slice(0, 2)
    if (!digits) {
      update({ incomeDay: 0 })
      return
    }
    update({ incomeDay: Math.min(Number(digits), 31) })
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (canContinue) navigate('/analise')
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="py-5 px-4 md:px-8 z-10 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="max-w-2xl mx-auto w-full flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <Logo variant="light" className="text-3xl" />
          </Link>
          <button
            type="button"
            onClick={() => navigate('/dados')}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft size={16} />
            Voltar
          </button>
        </div>
        <div className="max-w-2xl mx-auto w-full mt-4">
          <ProgressBar value={40} />
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
                Passo 5
              </p>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-3">
                Qual a sua renda?
              </h1>
              <p className="text-muted-foreground max-w-md mx-auto">
                Isso nos ajuda a ajustar as parcelas ao seu orçamento.
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="space-y-4 mb-6">
                <div className="bg-card border border-border rounded-3xl p-6 md:p-8 shadow-xl">
                  <h3 className="font-semibold text-foreground mb-4">
                    Quanto você recebe por mês?
                  </h3>

                  <div className="relative">
                    <span
                      className={`absolute left-4 top-1/2 -translate-y-1/2 text-lg font-semibold transition-opacity ${
                        data.noIncome
                          ? 'text-muted-foreground/40'
                          : 'text-muted-foreground'
                      }`}
                    >
                      R$
                    </span>
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder="0,00"
                      value={data.salary}
                      onFocus={handleSalaryFocus}
                      onChange={(event) =>
                        handleSalaryChange(event.target.value)
                      }
                      className={`${baseInput} pl-12 pr-3 transition-opacity ${
                        data.noIncome ? 'opacity-50' : ''
                      }`}
                    />
                  </div>

                  <button
                    type="button"
                    onClick={toggleNoIncome}
                    className={`mt-4 w-full flex items-center gap-3 rounded-2xl border-2 px-4 py-3 text-left text-sm font-medium transition-all ${
                      data.noIncome
                        ? 'border-primary bg-primary/10 text-foreground'
                        : 'border-border bg-background text-muted-foreground hover:border-[#2e5535]/40'
                    }`}
                  >
                    <span
                      className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all ${
                        data.noIncome
                          ? 'border-primary bg-primary'
                          : 'border-border'
                      }`}
                    >
                      {data.noIncome ? (
                        <Check size={13} className="text-[#0f1712]" />
                      ) : null}
                    </span>
                    Não possuo renda no momento
                  </button>
                </div>

                {!data.noIncome && (
                  <div className="bg-card border border-border rounded-3xl p-6 md:p-8 shadow-xl">
                    <h3 className="font-semibold text-foreground mb-1">
                      Que dia você recebe?
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Digite o dia do salário ou benefício.
                    </p>
                    <div className="relative max-w-[200px]">
                      <input
                        type="text"
                        inputMode="numeric"
                        placeholder="Ex: 5"
                        value={data.incomeDay > 0 ? String(data.incomeDay) : ''}
                        onChange={(event) =>
                          handleIncomeDayChange(event.target.value)
                        }
                        className={`${baseInput} pl-3 pr-20`}
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                        do mês
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={!canContinue}
                className={`w-full inline-flex items-center justify-center gap-2 bg-primary text-[#0f1712] font-bold h-16 text-lg md:text-xl rounded-full transition-all ${
                  canContinue
                    ? 'hover:bg-primary/90 hover:scale-[1.02] shadow-[0_0_30px_rgba(180,240,69,0.25)]'
                    : 'opacity-40 cursor-not-allowed'
                }`}
              >
                Continuar
                <ArrowRight size={20} />
              </button>
            </form>
          </div>
        </motion.div>
      </main>

      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-primary/5 blur-[120px] rounded-full" />
      </div>
    </div>
  )
}
