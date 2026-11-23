import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { Logo } from '../components/Logo'
import { OptionCard } from '../components/OptionCard'
import { ProgressBar } from '../components/ProgressBar'
import { useSimulation } from '../lib/simulation'

const PURPOSES = [
  'Quitar dívidas',
  'Reforma da casa',
  'Capital de giro',
  'Despesas médicas',
  'Educação',
  'Outro',
]

const OCCUPATIONS = [
  'CLT',
  'Autônomo(a)',
  'Servidor(a) público',
  'Aposentado(a)',
  'Empresário(a)',
  'Outro',
]

const NEGATIVADO_OPTIONS = [
  { value: 'sim', label: 'Sim' },
  { value: 'nao', label: 'Não' },
  { value: 'naosei', label: 'Não sei' },
]

export function DadosPage() {
  const navigate = useNavigate()
  const { data, update } = useSimulation()

  const canContinue = Boolean(
    data.purpose && data.occupation && data.negativado,
  )

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="py-5 px-4 md:px-8 z-10 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="max-w-2xl mx-auto w-full flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <Logo variant="light" className="text-3xl" />
          </Link>
          <button
            type="button"
            onClick={() => navigate('/confirmacao')}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft size={16} />
            Voltar
          </button>
        </div>
        <div className="max-w-2xl mx-auto w-full mt-4">
          <ProgressBar value={32} />
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
                Passo 4
              </p>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-3">
                Sobre o seu empréstimo
              </h1>
              <p className="text-muted-foreground max-w-md mx-auto">
                Essas respostas nos ajudam a montar a melhor oferta para o seu
                perfil.
              </p>
            </div>

            <div className="space-y-4 mb-6">
              <div className="bg-card border border-border rounded-3xl p-6 md:p-8 shadow-xl">
                <h3 className="font-semibold text-foreground mb-4">
                  Qual o motivo do empréstimo?
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {PURPOSES.map((purpose) => (
                    <OptionCard
                      key={purpose}
                      selected={data.purpose === purpose}
                      onClick={() => update({ purpose })}
                    >
                      {purpose}
                    </OptionCard>
                  ))}
                </div>
              </div>

              <div className="bg-card border border-border rounded-3xl p-6 md:p-8 shadow-xl">
                <h3 className="font-semibold text-foreground mb-4">
                  Qual a sua ocupação?
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {OCCUPATIONS.map((occupation) => (
                    <OptionCard
                      key={occupation}
                      selected={data.occupation === occupation}
                      onClick={() => update({ occupation })}
                    >
                      {occupation}
                    </OptionCard>
                  ))}
                </div>
              </div>

              <div className="bg-card border border-border rounded-3xl p-6 md:p-8 shadow-xl">
                <h3 className="font-semibold text-foreground mb-4">
                  Seu nome está negativado?
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  {NEGATIVADO_OPTIONS.map((option) => {
                    const selected = data.negativado === option.value
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => update({ negativado: option.value })}
                        className={`py-4 rounded-2xl border-2 font-medium text-center transition-all ${
                          selected
                            ? 'border-primary bg-primary/10 text-foreground shadow-[0_0_0_4px_rgba(180,240,69,0.12)]'
                            : 'border-border bg-background text-foreground hover:border-[#2e5535]/40'
                        }`}
                      >
                        {option.label}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate('/renda')}
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
          </div>
        </motion.div>
      </main>

      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-primary/5 blur-[120px] rounded-full" />
      </div>
    </div>
  )
}
