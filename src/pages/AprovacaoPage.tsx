import confetti from 'canvas-confetti'
import { motion } from 'framer-motion'
import { ArrowRight, Check, PartyPopper } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Logo } from '../components/Logo'
import { ProgressBar } from '../components/ProgressBar'
import { calculateInstallment, formatBRL } from '../lib/loan'
import { useSimulation } from '../lib/simulation'

const BENEFITS = [
  'Dinheiro na sua conta digital em minutos',
  'Parcelas fixas do início ao fim',
  'Sem tarifas ou taxas antecipadas',
]

const CONFETTI_COLORS = ['#b4f045', '#d4f57a', '#2e5535', '#ffffff']

function generateApprovedAmount() {
  const min = 8000
  const max = 35000
  const step = 500
  const options = Math.floor((max - min) / step) + 1
  return min + Math.floor(Math.random() * options) * step
}

function playChime() {
  try {
    const AudioCtor =
      window.AudioContext ??
      (
        window as unknown as {
          webkitAudioContext?: typeof AudioContext
        }
      ).webkitAudioContext
    if (!AudioCtor) return

    const ctx = new AudioCtor()
    const now = ctx.currentTime

    ;[523.25, 659.25, 783.99, 1046.5].forEach((frequency, index) => {
      const oscillator = ctx.createOscillator()
      const gain = ctx.createGain()
      oscillator.type = 'triangle'
      oscillator.frequency.value = frequency
      const start = now + index * 0.11
      gain.gain.setValueAtTime(0, start)
      gain.gain.linearRampToValueAtTime(0.16, start + 0.03)
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.5)
      oscillator.connect(gain)
      gain.connect(ctx.destination)
      oscillator.start(start)
      oscillator.stop(start + 0.55)
    })

    window.setTimeout(() => {
      ctx.close().catch(() => undefined)
    }, 1400)
  } catch {
    void 0
  }
}

export function AprovacaoPage() {
  const navigate = useNavigate()
  const { data, update } = useSimulation()

  const [amount] = useState(() =>
    data.approvedAmount > 0 ? data.approvedAmount : generateApprovedAmount(),
  )

  useEffect(() => {
    if (!data.approvedAmount) update({ approvedAmount: amount })
  }, [amount, data.approvedAmount, update])

  useEffect(() => {
    let cancelled = false
    let frame = 0

    confetti({
      particleCount: 130,
      spread: 78,
      startVelocity: 45,
      ticks: 240,
      origin: { y: 0.4 },
      colors: CONFETTI_COLORS,
    })

    const timer = window.setTimeout(() => {
      confetti({
        particleCount: 60,
        angle: 60,
        spread: 60,
        origin: { x: 0, y: 0.6 },
        colors: CONFETTI_COLORS,
      })
      confetti({
        particleCount: 60,
        angle: 120,
        spread: 60,
        origin: { x: 1, y: 0.6 },
        colors: CONFETTI_COLORS,
      })
    }, 200)

    const end = Date.now() + 2400
    const tick = () => {
      if (cancelled) return
      confetti({
        particleCount: 3,
        startVelocity: 0,
        ticks: 260,
        gravity: 0.55,
        scalar: 0.9,
        origin: { x: Math.random(), y: -0.05 },
        colors: CONFETTI_COLORS,
      })
      if (Date.now() < end) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)

    playChime()

    return () => {
      cancelled = true
      cancelAnimationFrame(frame)
      window.clearTimeout(timer)
      confetti.reset()
    }
  }, [])

  const installment = calculateInstallment(amount, data.installments)
  const firstName = data.name.split(' ')[0] || ''

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="py-5 px-4 md:px-8 z-10 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="max-w-2xl mx-auto w-full flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <Logo variant="light" className="text-3xl" />
          </Link>
        </div>
        <div className="max-w-2xl mx-auto w-full mt-4">
          <ProgressBar value={70} />
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full"
          >
            <div className="bg-gradient-to-b from-[#1a231d] to-[#0f1712] border border-primary/30 rounded-3xl p-6 md:p-10 shadow-[0_0_50px_rgba(180,240,69,0.15)] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[80px]" />
              <div className="absolute bottom-0 left-0 w-52 h-52 bg-primary/10 blur-[80px]" />

              <div className="relative z-10 text-white">
                <div className="relative mx-auto mb-6 w-20 h-20">
                  <motion.span
                    className="absolute inset-0 rounded-full border-2 border-primary/50"
                    animate={{ scale: [1, 1.7], opacity: [0.6, 0] }}
                    transition={{
                      duration: 1.8,
                      repeat: Infinity,
                      ease: 'easeOut',
                    }}
                  />
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      type: 'spring',
                      stiffness: 200,
                      damping: 15,
                      delay: 0.15,
                    }}
                    className="relative w-20 h-20 bg-primary rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(180,240,69,0.4)]"
                  >
                    <Check
                      size={40}
                      className="text-[#0f1712]"
                      strokeWidth={3}
                    />
                  </motion.div>
                </div>

                <div className="text-center mb-8">
                  <div className="inline-flex items-center gap-2 text-primary text-sm font-semibold mb-3">
                    <PartyPopper size={16} /> Parabéns
                    {firstName ? `, ${firstName}` : ''}!
                  </div>
                  <h1 className="text-3xl md:text-4xl font-black mb-3">
                    Crédito aprovado
                  </h1>
                  <p className="text-white/70">
                    Seu dinheiro está reservado e pronto para ser liberado na sua
                    conta digital.
                  </p>
                </div>

                <div className="bg-[#0f1712]/80 backdrop-blur-md rounded-2xl p-6 border border-white/10 mb-6">
                  <div className="text-center mb-6">
                    <p className="text-white/60 mb-1">Valor liberado</p>
                    <p className="text-4xl md:text-5xl font-black text-primary tracking-tighter">
                      {formatBRL(amount)}
                    </p>
                  </div>

                  <div className="space-y-4 pt-6 border-t border-white/10">
                    <div className="flex justify-between items-center">
                      <span className="text-white/60">Parcelamento</span>
                      <span className="font-bold">
                        {data.installments}x de {formatBRL(installment)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/60">Prazo</span>
                      <span className="font-medium">
                        {data.installments} meses
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/60">Liberação</span>
                      <span className="font-medium">Imediata via PIX</span>
                    </div>
                    <div className="flex justify-between items-center gap-3">
                      <span className="text-white/60 shrink-0">
                        Primeira parcela
                      </span>
                      <span className="font-medium text-right">
                        {data.paymentDay
                          ? `${data.paymentDay} de janeiro de 2027`
                          : 'Janeiro de 2027'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mb-8">
                  {BENEFITS.map((benefit) => (
                    <div className="flex items-start gap-3" key={benefit}>
                      <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center shrink-0 mt-0.5">
                        <Check size={13} className="text-[#0f1712]" />
                      </div>
                      <span className="text-sm text-white/85">{benefit}</span>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => navigate('/dia')}
                  className="w-full inline-flex items-center justify-center gap-2 bg-primary text-[#0f1712] font-bold h-16 text-lg md:text-xl rounded-full transition-all hover:bg-primary/90 hover:scale-[1.02] shadow-[0_0_30px_rgba(180,240,69,0.25)]"
                >
                  Continuar
                  <ArrowRight size={20} />
                </button>
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
