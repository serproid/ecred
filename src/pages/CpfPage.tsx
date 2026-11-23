import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, CircleAlert, Loader2, Lock } from 'lucide-react'
import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Logo } from '../components/Logo'
import { ProgressBar } from '../components/ProgressBar'
import { formatCpf, isValidCpf, onlyDigits } from '../lib/formatters'
import { useSimulation } from '../lib/simulation'

export function CpfPage() {
  const navigate = useNavigate()
  const { data, update } = useSimulation()
  const [touched, setTouched] = useState(false)
  const [loading, setLoading] = useState(false)

  const digits = onlyDigits(data.cpf)
  const error = isValidCpf(data.cpf)
    ? ''
    : digits.length !== 11
      ? 'Digite um CPF válido com 11 dígitos.'
      : 'CPF inválido. Confira os números digitados.'

  const visibleError = touched ? error : ''

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    setTouched(true)
    if (loading || error) return

    setLoading(true)
    window.setTimeout(() => {
      update({ phone: '' })
      setLoading(false)
      navigate('/confirmacao')
    }, 600)
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
            onClick={() => navigate('/valor')}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft size={16} />
            Voltar
          </button>
        </div>
        <div className="max-w-2xl mx-auto w-full mt-4">
          <ProgressBar value={18} />
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
                Passo 2
              </p>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-3">
                Informe seu CPF
              </h1>
              <p className="text-muted-foreground max-w-md mx-auto">
                Precisamos do seu CPF para prosseguir com a análise.
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="bg-card border border-border rounded-3xl p-6 md:p-10 shadow-xl mb-6">
                <label className="block text-sm font-medium text-foreground mb-2">
                  CPF
                </label>
                <input
                  type="tel"
                  inputMode="numeric"
                  placeholder="000.000.000-00"
                  value={data.cpf}
                  onChange={(event) =>
                    update({ cpf: formatCpf(event.target.value) })
                  }
                  maxLength={14}
                  className={`flex w-full border px-3 py-1 shadow-sm transition-colors placeholder:text-muted-foreground/45 focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50 h-14 bg-background text-lg tracking-wide rounded-xl ${
                    visibleError
                      ? 'border-red-500 focus-visible:ring-red-500 focus-visible:border-red-500'
                      : 'border-border focus-visible:ring-primary focus-visible:border-primary'
                  }`}
                />
                {visibleError ? (
                  <p className="text-red-500 text-sm mt-1.5 flex items-center gap-1">
                    <CircleAlert size={14} className="shrink-0" />
                    {' '}
                    {visibleError}
                  </p>
                ) : null}

                <div className="flex items-center gap-3 bg-muted p-4 rounded-xl border border-border mt-6">
                  <Lock className="text-[#2e5535] shrink-0" size={20} />
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Consulta protegida e sem custo. Seus dados são usados apenas
                    para a análise de crédito, conforme a LGPD.
                  </p>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full inline-flex items-center justify-center gap-2 bg-primary text-[#0f1712] font-bold h-16 text-lg md:text-xl rounded-full transition-all ${
                  loading
                    ? 'opacity-40 cursor-not-allowed'
                    : 'hover:bg-primary/90 hover:scale-[1.02] shadow-[0_0_30px_rgba(180,240,69,0.25)]'
                }`}
              >
                {loading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" /> Consultando...
                  </>
                ) : (
                  <>
                    Continuar
                    <ArrowRight size={20} />
                  </>
                )}
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
