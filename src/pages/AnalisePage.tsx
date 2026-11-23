import { animate, motion } from 'framer-motion'
import { Check, Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Logo } from '../components/Logo'
import { ProgressBar } from '../components/ProgressBar'

const STEPS = [
  'Validando identidade',
  'Consultando score de crédito',
  'Analisando capacidade de pagamento',
  'Preparando sua melhor oferta',
]

const DURATION = 4.5

export function AnalisePage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const controls = animate(0, 100, {
      duration: DURATION - 0.3,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      onUpdate: (value) => setProgress(Math.round(value)),
    })

    const timers = [
      window.setTimeout(() => setStep(1), 900),
      window.setTimeout(() => setStep(2), 1800),
      window.setTimeout(() => setStep(3), 2700),
      window.setTimeout(() => setStep(4), 3600),
      window.setTimeout(() => navigate('/push'), DURATION * 1000),
    ]

    return () => {
      controls.stop()
      timers.forEach((timer) => window.clearTimeout(timer))
    }
  }, [navigate])

  const radius = 52
  const circumference = 2 * Math.PI * radius
  const dashOffset = circumference * (1 - progress / 100)

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="py-5 px-4 md:px-8 z-10 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="max-w-2xl mx-auto w-full flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <Logo variant="light" className="text-3xl" />
          </Link>
        </div>
        <div className="max-w-2xl mx-auto w-full mt-4">
          <ProgressBar value={50} />
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-start p-4 md:p-8 pt-8 md:pt-12 w-full max-w-2xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.25 }}
          className="w-full"
        >
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full"
          >
            <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-b from-[#111a14] to-[#0b120d] p-8 md:p-10 shadow-[0_0_50px_rgba(180,240,69,0.12)]">
              <div
                className="pointer-events-none absolute inset-0 opacity-[0.12]"
                style={{
                  backgroundImage:
                    'linear-gradient(rgba(180,240,69,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(180,240,69,0.6) 1px, transparent 1px)',
                  backgroundSize: '28px 28px',
                }}
              />
              <div className="pointer-events-none absolute -top-10 right-0 h-52 w-52 rounded-full bg-primary/20 blur-[80px]" />
              <div className="pointer-events-none absolute bottom-0 left-0 h-40 w-40 rounded-full bg-primary/10 blur-[70px]" />

              <div className="relative z-10 flex flex-col items-center text-center text-white">
                <div className="relative mb-8 h-44 w-44">
                  <motion.div
                    className="absolute inset-0 rounded-full border border-dashed border-primary/30"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                  />
                  <motion.div
                    className="absolute inset-3 rounded-full border border-primary/10"
                    animate={{ rotate: -360 }}
                    transition={{
                      duration: 12,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                  />

                  <svg
                    viewBox="0 0 120 120"
                    className="absolute inset-0 h-full w-full -rotate-90"
                  >
                    <circle
                      cx="60"
                      cy="60"
                      r={radius}
                      fill="none"
                      stroke="rgba(255,255,255,0.08)"
                      strokeWidth="6"
                    />
                    <circle
                      cx="60"
                      cy="60"
                      r={radius}
                      fill="none"
                      stroke="url(#gauge)"
                      strokeWidth="6"
                      strokeLinecap="round"
                      strokeDasharray={circumference}
                      strokeDashoffset={dashOffset}
                    />
                    <defs>
                      <linearGradient
                        id="gauge"
                        x1="0"
                        y1="0"
                        x2="1"
                        y2="1"
                      >
                        <stop offset="0%" stopColor="#d4f57a" />
                        <stop offset="100%" stopColor="#b4f045" />
                      </linearGradient>
                    </defs>
                  </svg>

                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-black tracking-tighter text-primary tabular-nums">
                      {progress}%
                    </span>
                    <span className="mt-1 text-[11px] uppercase tracking-[0.2em] text-white/50">
                      analisando
                    </span>
                  </div>
                </div>

                <h2 className="text-2xl font-bold">Analisando seu perfil</h2>
                <p className="mt-2 text-white/60">
                  Nossa inteligência está montando a sua melhor oferta.
                </p>

                <div className="mt-8 w-full max-w-sm space-y-2.5 text-left">
                  {STEPS.map((label, index) => {
                    const done = step > index
                    const active = step === index
                    return (
                      <motion.div
                        key={label}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.15 + index * 0.12 }}
                        className={`flex items-center gap-3 rounded-2xl border px-4 py-3 transition-colors duration-500 ${
                          done
                            ? 'border-primary/30 bg-primary/10'
                            : active
                              ? 'border-primary/40 bg-white/5'
                              : 'border-white/5'
                        }`}
                      >
                        <div
                          className={`flex h-7 w-7 items-center justify-center rounded-full transition-colors duration-500 ${
                            done
                              ? 'bg-primary text-[#0f1712]'
                              : 'bg-white/10 text-white/50'
                          }`}
                        >
                          {done ? (
                            <Check size={16} />
                          ) : active ? (
                            <Loader2 size={15} className="animate-spin" />
                          ) : (
                            <span className="h-1.5 w-1.5 rounded-full bg-white/40" />
                          )}
                        </div>
                        <span
                          className={`text-sm font-medium transition-colors duration-500 ${
                            done || active ? 'text-white' : 'text-white/45'
                          }`}
                        >
                          {label}
                        </span>
                      </motion.div>
                    )
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </main>

      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-primary/5 blur-[120px] rounded-full" />
      </div>
    </div>
  )
}
