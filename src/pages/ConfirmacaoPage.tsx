import { motion } from 'framer-motion'
import {
  ArrowLeft,
  ArrowRight,
  CircleAlert,
  Lock,
} from 'lucide-react'
import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Logo } from '../components/Logo'
import { OptionCard } from '../components/OptionCard'
import { ProgressBar } from '../components/ProgressBar'
import {
  formatCpf,
  formatDate,
  formatPhone,
  onlyDigits,
} from '../lib/formatters'
import { useSimulation } from '../lib/simulation'

const normalInput =
  'h-14 bg-background border-border text-lg rounded-xl focus-visible:ring-primary focus-visible:border-primary'
const errorInput =
  'h-14 bg-background text-lg rounded-xl border-red-500 focus-visible:ring-red-500 focus-visible:border-red-500'
const lockedInput =
  'h-14 bg-muted border-border text-lg rounded-xl text-muted-foreground cursor-not-allowed focus-visible:ring-0 focus-visible:border-border'

const baseInput =
  'flex w-full border px-3 py-1 shadow-sm transition-colors placeholder:text-muted-foreground/45 focus-visible:outline-none focus-visible:ring-1'

function FieldError({ message }: { message: string }) {
  if (!message) return null
  return (
    <p className="text-red-500 text-sm mt-1.5 flex items-center gap-1">
      <CircleAlert size={14} className="shrink-0" /> {message}
    </p>
  )
}

export function ConfirmacaoPage() {
  const navigate = useNavigate()
  const { data, update } = useSimulation()
  const [showErrors, setShowErrors] = useState(false)

  const errors = {
    name:
      data.name.trim().split(/\s+/).filter(Boolean).length < 2
        ? 'Confirme seu nome completo.'
        : '',
    birthDate:
      onlyDigits(data.birthDate).length !== 8
        ? 'Informe uma data de nascimento válida.'
        : '',
    cpf:
      onlyDigits(data.cpf).length !== 11
        ? 'Informe um CPF válido com 11 dígitos.'
        : '',
    motherName:
      data.motherName.trim().split(/\s+/).filter(Boolean).length < 2
        ? 'Informe o nome completo da sua mãe.'
        : '',
    gender: data.gender ? '' : 'Selecione seu gênero.',
    phone:
      onlyDigits(data.phone).length < 11 ? 'Confirme um celular válido.' : '',
  }

  const hasError = Object.values(errors).some(Boolean)
  const errorFor = (key: keyof typeof errors) =>
    showErrors ? errors[key] : ''
  const inputClass = (key: keyof typeof errors) =>
    `${baseInput} ${errorFor(key) ? errorInput : normalInput}`

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    setShowErrors(true)
    if (!hasError) navigate('/dados')
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
            onClick={() => navigate('/cpf')}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft size={16} />
            Voltar
          </button>
        </div>
        <div className="max-w-2xl mx-auto w-full mt-4">
          <ProgressBar value={25} />
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
                Passo 3
              </p>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-3">
                Confirme seus dados
              </h1>
              <p className="text-muted-foreground max-w-md mx-auto">
                Confira se está tudo certo antes de continuar.
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="bg-card border border-border rounded-3xl p-6 md:p-8 shadow-xl mb-6 space-y-5">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Nome completo
                  </label>
                  <input
                    value={data.name}
                    onChange={(event) => update({ name: event.target.value })}
                    className={inputClass('name')}
                  />
                  <FieldError message={errorFor('name')} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Nascimento
                    </label>
                    <input
                      value={data.birthDate}
                      onChange={(event) =>
                        update({ birthDate: formatDate(event.target.value) })
                      }
                      maxLength={10}
                      className={inputClass('birthDate')}
                    />
                    <FieldError message={errorFor('birthDate')} />
                  </div>

                  <div>
                    <label className="flex items-center gap-1.5 text-sm font-medium text-foreground mb-2">
                      CPF
                      {data.cpfLocked ? (
                        <Lock size={12} className="text-muted-foreground" />
                      ) : null}
                    </label>
                    <input
                      value={data.cpf}
                      onChange={(event) => {
                        if (data.cpfLocked) return
                        update({ cpf: formatCpf(event.target.value) })
                      }}
                      readOnly={data.cpfLocked}
                      maxLength={14}
                      className={
                        data.cpfLocked
                          ? `${baseInput} ${lockedInput}`
                          : inputClass('cpf')
                      }
                    />
                    {!data.cpfLocked ? (
                      <FieldError message={errorFor('cpf')} />
                    ) : (
                      <button
                        type="button"
                        onClick={() => navigate('/cpf')}
                        className="mt-1.5 text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground transition-colors"
                      >
                        Alterar CPF
                      </button>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Nome da mãe
                  </label>
                  <input
                    value={data.motherName}
                    onChange={(event) =>
                      update({ motherName: event.target.value })
                    }
                    placeholder="Nome completo da sua mãe"
                    className={inputClass('motherName')}
                  />
                  <FieldError message={errorFor('motherName')} />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Gênero
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <OptionCard
                      selected={data.gender === 'feminino'}
                      onClick={() => update({ gender: 'feminino' })}
                    >
                      Feminino
                    </OptionCard>
                    <OptionCard
                      selected={data.gender === 'masculino'}
                      onClick={() => update({ gender: 'masculino' })}
                    >
                      Masculino
                    </OptionCard>
                  </div>
                  <FieldError message={errorFor('gender')} />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Celular (WhatsApp)
                  </label>
                  <input
                    type="tel"
                    value={data.phone}
                    onChange={(event) =>
                      update({ phone: formatPhone(event.target.value) })
                    }
                    placeholder="(11) 91234-5678"
                    maxLength={15}
                    className={inputClass('phone')}
                  />
                  <FieldError message={errorFor('phone')} />
                </div>
              </div>

              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 bg-primary text-[#0f1712] font-bold h-16 text-lg md:text-xl rounded-full transition-all hover:bg-primary/90 hover:scale-[1.02] shadow-[0_0_30px_rgba(180,240,69,0.25)]"
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
