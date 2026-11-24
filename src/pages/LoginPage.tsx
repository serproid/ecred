import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Eye, EyeOff, Mail } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { FieldError } from '../components/FieldError'
import { Logo } from '../components/Logo'
import { supabase } from '../lib/supabase'

const baseInput =
  'flex w-full border py-1 shadow-sm transition-colors placeholder:text-muted-foreground/45 focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50 h-14 bg-background text-lg rounded-xl'
const normalInput =
  'border-border focus-visible:ring-primary focus-visible:border-primary'
const errorInput =
  'border-red-500 focus-visible:ring-red-500 focus-visible:border-red-500'

const isEmailValid = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const reason = (
    location.state as { reason?: string } | null
  )?.reason

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [touched, setTouched] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (data.session) navigate('/digital', { replace: true })
      })
      .catch(() => undefined)
  }, [navigate])

  const emailError = isEmailValid(email) ? '' : 'Informe um e-mail válido.'
  const passwordError =
    password.length === 0 ? 'Informe sua senha.' : ''
  const hasError = Boolean(emailError || passwordError)
  const errorFor = (value: string) => (touched ? value : '')

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setTouched(true)
    setError('')

    if (hasError || submitting) return

    setSubmitting(true)

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) {
        setError('E-mail ou senha inválidos.')
        setSubmitting(false)
        return
      }

      navigate('/digital')
    } catch {
      setError('Não foi possível entrar. Tente novamente.')
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="py-5 px-4 md:px-8 z-10 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="max-w-md mx-auto w-full flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <Logo variant="light" className="text-3xl" />
          </Link>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft size={16} />
            Voltar
          </Link>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-start p-4 md:p-8 pt-10 md:pt-16 w-full max-w-md mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.25 }}
          className="w-full"
        >
          <div className="text-center mb-8">
            <p className="text-xs font-bold text-[#2e5535] uppercase tracking-[0.15em] mb-3">
              Conta digital
            </p>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-3">
              Entrar na sua conta
            </h1>
            <p className="text-muted-foreground">
              {reason === 'existing'
                ? 'Este CPF já possui uma conta. Entre para acessar sua conta digital.'
                : 'Acesse sua conta digital com e-mail e senha.'}
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
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className={`${baseInput} pl-11 pr-3 ${
                      errorFor(emailError) ? errorInput : normalInput
                    }`}
                  />
                </div>
                <FieldError message={errorFor(emailError)} />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Senha
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Sua senha"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className={`${baseInput} pl-3 pr-11 ${
                      errorFor(passwordError) ? errorInput : normalInput
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
                <FieldError message={errorFor(passwordError)} />
              </div>
            </div>

            {error ? (
              <p className="text-red-500 text-sm mb-3 text-center">{error}</p>
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
              {submitting ? 'Entrando...' : 'Entrar'}
              <ArrowRight size={20} />
            </button>

            <p className="text-center text-sm text-muted-foreground mt-5">
              Ainda não tem conta?{' '}
              <Link
                to="/valor"
                className="text-[#2e5535] font-semibold underline"
              >
                Começar agora
              </Link>
            </p>
          </form>
        </motion.div>
      </main>

      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-primary/5 blur-[120px] rounded-full" />
      </div>
    </div>
  )
}
