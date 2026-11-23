import { AnimatePresence, motion } from 'framer-motion'
import { Check, Loader2, ShieldCheck } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Logo } from '../components/Logo'

const STEPS = [
  'Criando sua conta digital',
  'Configurando seu acesso',
  'Liberando seu saldo',
]

const STEP_INTERVAL = 1600
const DONE_DELAY = 1200

export function AbrindoPage() {
  const navigate = useNavigate()
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (index >= STEPS.length) {
      const timer = window.setTimeout(() => {
        navigate('/digital', { replace: true })
      }, DONE_DELAY)
      return () => window.clearTimeout(timer)
    }

    const timer = window.setTimeout(
      () => setIndex((value) => value + 1),
      STEP_INTERVAL,
    )
    return () => window.clearTimeout(timer)
  }, [index, navigate])

  const done = index >= STEPS.length
  const progress = Math.round((Math.min(index, STEPS.length) / STEPS.length) * 100)

  return (
    <div className="min-h-dvh bg-[#0b120d] text-white flex flex-col">
      <div className="max-w-md w-full mx-auto px-6 flex-1 flex flex-col justify-center py-12">
        <div className="text-center">
          <div className="mb-8 flex justify-center">
            <Logo variant="dark" className="text-xl" />
          </div>

          <div className="relative w-24 h-24 mx-auto mb-8">
            <div className="absolute inset-0 rounded-full bg-primary/15 blur-2xl" />
            <div className="relative w-24 h-24 rounded-full border border-white/10 bg-white/5 flex items-center justify-center">
              {done ? (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-primary"
                >
                  <Check size={44} strokeWidth={3} />
                </motion.span>
              ) : (
                <Loader2 size={42} className="text-primary animate-spin" />
              )}
            </div>
          </div>

          <h1 className="text-2xl font-bold tracking-tight mb-6">
            {done ? 'Sua conta está pronta' : 'Estamos abrindo sua conta'}
          </h1>

          <div className="h-8 mb-8 flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.p
                key={done ? 'done' : index}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.45 }}
                className="text-white/70 text-base"
              >
                {done ? 'Redirecionando para o seu saldo.' : STEPS[index]}
              </motion.p>
            </AnimatePresence>
          </div>

          <div className="h-1.5 w-full max-w-xs mx-auto rounded-full bg-white/10 overflow-hidden">
            <motion.div
              className="h-full bg-primary rounded-full"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
            />
          </div>
        </div>

        <p className="flex items-center justify-center gap-1.5 text-xs text-white/40 mt-12">
          <ShieldCheck size={14} className="text-primary" />
          Ambiente seguro e criptografado
        </p>
      </div>
    </div>
  )
}
