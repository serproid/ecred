import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Eye, EyeOff, Mail } from 'lucide-react'
import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FieldError } from '../components/FieldError'
import { Logo } from '../components/Logo'
import { ProgressBar } from '../components/ProgressBar'
import { useSimulation } from '../lib/simulation'
import { supabase } from '../lib/supabase'

const baseInput =
  'flex w-full border py-1 shadow-sm transition-colors placeholder:text-muted-foreground/45 focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50 h-14 bg-background text-lg rounded-xl'
const normalInput =
  'border-border focus-visible:ring-primary focus-visible:border-primary'
const errorInput =
  'border-red-500 focus-visible:ring-red-500 focus-visible:border-red-500'

const isEmailValid = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

export function ContaPage() {
  const navigate = useNavigate()
  const { data, update } = useSimulation()
  const [showPassword, setShowPassword] = useState(false)
  const [touched, setTouched] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [authError, setAuthError] = useState('')

  const errors = {
    email: isEmailValid(data.email) ? '' : 'Informe um e-mail válido.',
    password:
      data.password.length < 6
        ? 'A senha deve ter pelo menos 6 caracteres.'
        : '',
  }
  const hasError = Object.values(errors).some(Boolean)
  const errorFor = (key: keyof typeof errors) =>
    touched ? errors[key] : ''

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setTouched(true)
    if (hasError || submitting) return

    setSubmitting(true)
    setAuthError('')

    try {
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      })

      if (error) {
        if (/already registered|already exists/i.test(error.message)) {
          const { error: signInError } = await supabase.auth.signInWithPassword(
            {
              email: data.email,
              password: data.password,
            },
          )
          if (signInError) {
            setAuthError('E-mail já cadastrado. Confira a senha e tente novamente.')
            setSubmitting(false)
            return
          }
        } else {
          setAuthError(error.message)
          setSubmitting(false)
          return
        }
      }

      navigate('/abrir')
    } catch {
      setAuthError('Não foi possível criar a conta. Tente novamente.')
      setSubmitting(false)
    }
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
            onClick={() => navigate('/endereco')}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft size={16} />
            Voltar
          </button>
        </div>
        <div className="max-w-2xl mx-auto w-full mt-4">
          <ProgressBar value={96} />
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
                Último passo
              </p>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-3">
                Crie sua conta digital
              </h1>
              <p className="text-muted-foreground max-w-md mx-auto">
                É por ela que você acessa o saldo e realiza o saque via PIX.
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="bg-card border border-border rounded-3xl p-6 md:p-8 shadow-xl mb-6 space-y-5">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    E-mail
                  </label>
                  <div className="relative">
                    <Mail
                      size={18}
                      className="text-muted-foreground absolute left-4 top-1/2 -translate-y-1/2"
                    />
                    <input
                      type="email"
                      placeholder="voce@email.com"
                      value={data.email}
                      onChange={(event) =>
                        update({ email: event.target.value })
                      }
                      className={`${baseInput} pl-11 pr-3 ${
                        errorFor('email') ? errorInput : normalInput
                      }`}
                    />
                  </div>
                  <FieldError message={errorFor('email')} />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Senha
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Crie uma senha"
                      value={data.password}
                      onChange={(event) =>
                        update({ password: event.target.value })
                      }
                      className={`${baseInput} pl-3 pr-11 ${
                        errorFor('password') ? errorInput : normalInput
                      }`}
                    />
                    <button
                      type="button"
                      aria-label={
                        showPassword ? 'Ocultar senha' : 'Mostrar senha'
                      }
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="text-muted-foreground absolute right-4 top-1/2 -translate-y-1/2"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  <FieldError message={errorFor('password')} />
                </div>
              </div>

              {authError ? (
                <p className="text-red-500 text-sm mb-3 text-center">
                  {authError}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={submitting}
                className={`w-full inline-flex items-center justify-center gap-2 bg-primary text-[#0f1712] font-bold h-16 text-lg md:text-xl rounded-full transition-all ${
                  submitting
                    ? 'opacity-40 cursor-not-allowed'
                    : 'hover:bg-primary/90 hover:scale-[1.02] shadow-[0_0_30px_rgba(180,240,69,0.25)]'
                }`}
              >
                {submitting ? 'Criando conta...' : 'Criar conta e acessar'}
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
