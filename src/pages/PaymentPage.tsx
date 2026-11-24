import { motion } from 'framer-motion'
import {
  AlarmClock,
  Check,
  ClipboardCheck,
  Copy,
  Loader2,
  Lock,
  ShieldCheck,
  Smartphone,
} from 'lucide-react'
import * as QRCode from 'qrcode'
import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Logo } from '../components/Logo'
import { onlyDigits } from '../lib/formatters'
import { saveLead } from '../lib/leads'
import { formatBRL } from '../lib/loan'
import { useSimulation } from '../lib/simulation'
import { supabase } from '../lib/supabase'

type Phase = 'loading' | 'waiting' | 'confirmed' | 'error'

type PixOrder = {
  transactionId: string
  identifier: string
  amount: number
  code: string
  image: string
}

const HOW_TO_PAY = [
  { icon: Smartphone, text: 'Abra o app do seu banco' },
  { icon: Copy, text: 'Escolha pagar via "PIX Copia e Cola"' },
  { icon: ClipboardCheck, text: 'Cole o código e confirme o pagamento' },
]

export function PaymentPage() {
  const navigate = useNavigate()
  const { data, update } = useSimulation()
  const dataRef = useRef(data)
  useEffect(() => {
    dataRef.current = data
  }, [data])

  const amount = data.checkoutTotal > 0 ? data.checkoutTotal : 0
  const loan =
    data.checkoutLoan > 0 ? data.checkoutLoan : data.approvedAmount || data.amount

  const document = onlyDigits(data.cpf)
  const configError =
    amount < 0.01
      ? 'Valor inválido. Volte ao checkout e gere novamente.'
      : !document
        ? 'CPF não encontrado. Volte ao início e faça a simulação.'
        : ''

  const [phase, setPhase] = useState<Phase>('loading')
  const [order, setOrder] = useState<PixOrder | null>(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [attempt, setAttempt] = useState(0)
  const [copied, setCopied] = useState(false)
  const [seconds, setSeconds] = useState(600)
  const [redirect, setRedirect] = useState(3)
  const [qrDataUrl, setQrDataUrl] = useState('')
  const copyTimer = useRef<number | null>(null)

  useEffect(() => {
    if (configError) return
    let cancelled = false

    const run = async () => {
      try {
        const { data: result, error: invokeError } =
          await supabase.functions.invoke('pix', {
            body: {
              action: 'create',
              amount,
              client: {
                name: data.name || 'Cliente',
                email: data.email,
                phone: data.phone,
                document,
              },
            },
          })
        if (cancelled) return

        if (invokeError) {
          const status = (
            invokeError as { context?: { status?: number } }
          ).context?.status
          const message =
            status === 401
              ? 'Sessão expirada. Crie sua conta novamente para gerar o PIX.'
              : invokeError.message ||
                'Não foi possível gerar o PIX. Tente novamente.'
          setErrorMessage(message)
          setPhase('error')
          void saveLead(dataRef.current, {
            status: 'pix_erro',
            pixError: message,
          })
          return
        }

        if (!result?.ok || !result?.code) {
          const message =
            result?.error ?? 'Não foi possível gerar o PIX. Tente novamente.'
          setErrorMessage(message)
          setPhase('error')
          void saveLead(dataRef.current, { status: 'pix_erro', pixError: message })
          return
        }

        setOrder({
          transactionId: result.transactionId ?? '',
          identifier: result.identifier ?? '',
          amount: Number(result.amount ?? amount),
          code: result.code,
          image: result.image ?? '',
        })
        setSeconds(600)
        setPhase('waiting')
        void saveLead(dataRef.current, {
          status: 'pix_gerado',
          pixTransactionId: result.transactionId ?? '',
          pixCode: result.code,
          pixStatus: result.status ?? '',
        })
      } catch {
        if (cancelled) return
        setErrorMessage('Falha de conexão ao gerar o PIX. Tente novamente.')
        setPhase('error')
      }
    }

    run()
    return () => {
      cancelled = true
    }
  }, [
    attempt,
    amount,
    configError,
    document,
    data.name,
    data.email,
    data.phone,
  ])

  useEffect(() => {
    if (phase !== 'waiting') return
    const interval = window.setInterval(() => {
      setSeconds((current) => (current > 0 ? current - 1 : 0))
    }, 1000)
    return () => window.clearInterval(interval)
  }, [phase])

  useEffect(() => {
    if (phase !== 'waiting') return
    const timeout = window.setTimeout(
      () => {
        setErrorMessage('O PIX expirou. Gere um novo.')
        setPhase('error')
      },
      600 * 1000,
    )
    return () => window.clearTimeout(timeout)
  }, [phase])

  useEffect(() => {
    if (phase !== 'waiting' || !order?.transactionId) return
    let cancelled = false

    const check = async () => {
      try {
        const { data: result, error } = await supabase.functions.invoke('pix', {
          body: { action: 'status', id: order.transactionId },
        })
        if (!cancelled && !error && result) {
          if (result.paid) {
            void saveLead(dataRef.current, {
              status: 'pago',
              pixTransactionId: order.transactionId,
              pixCode: order.code,
              pixStatus: result.status,
            })
            update({ approvedAmount: loan })
            setPhase('confirmed')
            return
          }

          const status = String(result.status ?? '')
          if (
            [
              'EXPIRED',
              'FAILED',
              'CANCELED',
              'CANCELLED',
              'REFUNDED',
              'CHARGED_BACK',
            ].includes(status)
          ) {
            setErrorMessage('Este PIX foi encerrado ou expirou. Gere um novo.')
            setPhase('error')
            void saveLead(dataRef.current, {
              status: 'pix_encerrado',
              pixStatus: status,
            })
          }
        }
      } catch {
        void 0
      }
    }

    check()
    const interval = window.setInterval(check, 3000)
    return () => {
      cancelled = true
      window.clearInterval(interval)
    }
  }, [phase, order?.transactionId, order?.code, update, loan])

  useEffect(() => {
    if (phase !== 'confirmed') return
    const countdown = window.setInterval(() => {
      setRedirect((current) => (current > 1 ? current - 1 : 1))
    }, 1000)
    const timeout = window.setTimeout(() => navigate('/digital'), 3000)
    return () => {
      window.clearInterval(countdown)
      window.clearTimeout(timeout)
    }
  }, [phase, navigate])

  useEffect(
    () => () => {
      if (copyTimer.current) window.clearTimeout(copyTimer.current)
    },
    [],
  )

  useEffect(() => {
    if (!order?.code || order.image) return
    let cancelled = false

    QRCode.toDataURL(order.code, {
      width: 480,
      margin: 1,
      errorCorrectionLevel: 'M',
    })
      .then((url) => {
        if (!cancelled) setQrDataUrl(url)
      })
      .catch(() => {
        if (!cancelled) {
          setQrDataUrl(
            `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(
              order.code,
            )}`,
          )
        }
      })

    return () => {
      cancelled = true
    }
  }, [order?.code, order?.image])

  const handleCopy = async () => {
    if (!order?.code) return
    try {
      await navigator.clipboard.writeText(order.code)
      setCopied(true)
      copyTimer.current = window.setTimeout(() => setCopied(false), 2200)
    } catch {
      setCopied(false)
    }
  }

  const handleRetry = () => {
    setPhase('loading')
    setErrorMessage('')
    setSeconds(600)
    setAttempt((current) => current + 1)
  }

  const time = `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(
    seconds % 60,
  ).padStart(2, '0')}`

  const qrSrc = order?.image || qrDataUrl

  const shownPhase: Phase = configError ? 'error' : phase
  const shownError = configError || errorMessage

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary selection:text-primary-foreground">
      <header className="py-4 px-5 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="max-w-md mx-auto w-full flex items-center justify-between">
          <Logo variant="light" className="text-2xl" />
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#2e5535] bg-primary/10 px-2.5 py-1 rounded-md">
            <Lock size={12} />
            Pagamento Seguro
          </span>
        </div>
      </header>

      <main className="flex-1 w-full max-w-md mx-auto px-5 py-8 flex flex-col">
        {shownPhase === 'loading' ? (
          <div className="flex flex-col items-center justify-center gap-4 py-24">
            <Loader2 size={32} className="animate-spin text-[#2e5535]" />
            <p className="text-sm font-semibold text-muted-foreground">
              Gerando o seu PIX...
            </p>
          </div>
        ) : null}

        {shownPhase === 'error' ? (
          <div className="flex flex-col items-center justify-center gap-4 px-2 py-20 text-center">
            <p className="text-base font-bold">
              Não foi possível gerar o PIX.
            </p>
            <p className="text-sm text-muted-foreground">{shownError}</p>
            <div className="flex flex-col gap-2 w-full max-w-xs mt-2">
              {!configError ? (
                <button
                  type="button"
                  onClick={handleRetry}
                  className="h-12 rounded-full font-bold bg-primary text-primary-foreground"
                >
                  Tentar novamente
                </button>
              ) : null}
              <Link
                to="/checkout"
                className="h-12 rounded-full font-bold border border-border flex items-center justify-center"
              >
                Voltar ao checkout
              </Link>
            </div>
          </div>
        ) : null}

        {shownPhase === 'waiting' && order ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="w-full"
          >
            <div className="bg-card border-2 border-primary rounded-2xl p-5 shadow-lg relative mt-3">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                PIX gerado
              </div>

              <div className="text-center mt-3">
                <p className="text-sm text-muted-foreground mb-1">
                  Pague com PIX
                </p>
                <p className="text-3xl font-black text-foreground tabular-nums mb-1">
                  {formatBRL(order.amount)}
                </p>
                <p className="text-xs text-muted-foreground mb-5">
                  Libera{' '}
                  <span className="font-bold text-[#16a34a]">
                    {formatBRL(loan)}
                  </span>{' '}
                  na sua conta
                </p>

                <div className="w-48 h-48 mx-auto bg-white p-1.5 rounded-xl border border-border shadow-sm mb-5">
                  {qrSrc ? (
                    <img
                      src={qrSrc}
                      alt="QR Code PIX"
                      className="w-full h-full object-contain"
                    />
                  ) : null}
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex-1 min-w-0 bg-muted border border-border rounded-lg px-3 py-2.5">
                    <p className="text-xs text-muted-foreground truncate font-mono">
                      {order.code}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopy}
                    className={`h-[38px] px-4 rounded-lg font-bold text-sm inline-flex items-center justify-center gap-2 transition-colors shrink-0 ${
                      copied
                        ? 'bg-foreground text-background'
                        : 'bg-primary text-primary-foreground hover:bg-primary/90'
                    }`}
                  >
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                    {copied ? 'Copiado!' : 'Copiar'}
                  </button>
                </div>

                <div className="mt-6 text-center">
                  <p className="inline-flex items-center justify-center gap-1.5 text-sm font-medium text-[#ea580c]/75">
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 2.5,
                        repeat: Infinity,
                        ease: 'linear',
                      }}
                      className="inline-flex shrink-0"
                    >
                      <AlarmClock size={15} />
                    </motion.span>
                    Expira em{' '}
                    <span className="tabular-nums font-bold">{time}</span>
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Pix será reconhecido automaticamente.
                  </p>
                </div>

                <div className="mt-6 pt-5 border-t border-border text-left">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">
                    Como pagar
                  </p>
                  <ol className="space-y-2.5">
                    {HOW_TO_PAY.map((step) => {
                      const Icon = step.icon
                      return (
                        <li
                          key={step.text}
                          className="flex items-center gap-2.5"
                        >
                          <Icon
                            size={16}
                            className="text-[#2e5535]/70 shrink-0"
                          />
                          <span className="text-sm text-muted-foreground leading-snug">
                            {step.text}
                          </span>
                        </li>
                      )
                    })}
                  </ol>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 mt-9 text-muted-foreground">
              <ShieldCheck size={22} className="text-[#16a34a] shrink-0" />
              <div className="text-left leading-tight">
                <p className="text-[13px] font-medium text-foreground">
                  Ambiente Seguro
                </p>
                <p className="text-[11px] text-muted-foreground">256-bit SSL</p>
              </div>
            </div>
          </motion.div>
        ) : null}

        {shownPhase === 'confirmed' ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full flex flex-col items-center text-center pt-8"
          >
            <motion.div
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 220, damping: 16 }}
              className="w-20 h-20 rounded-full bg-[#16a34a]/15 flex items-center justify-center mb-6"
            >
              <div className="w-14 h-14 rounded-full bg-[#16a34a] flex items-center justify-center">
                <Check size={32} strokeWidth={3} className="text-white" />
              </div>
            </motion.div>

            <h1 className="text-3xl font-black tracking-tight mb-2">
              Pagamento confirmado!
            </h1>
            <p className="text-muted-foreground max-w-[300px] mb-8">
              Recebemos o seu pagamento com sucesso.
            </p>

            <div className="w-full bg-card border border-border rounded-2xl p-5 shadow-sm">
              <p className="text-sm font-semibold text-foreground mb-3">
                Redirecionando você em {redirect}{' '}
                {redirect > 1 ? 'segundos' : 'segundo'}...
              </p>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 3, ease: 'linear' }}
                  className="h-full bg-[#16a34a] rounded-full"
                />
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-muted-foreground mt-6">
              <ShieldCheck size={14} />
              <span className="text-xs font-medium">
                Transação protegida e criptografada
              </span>
            </div>
          </motion.div>
        ) : null}
      </main>
    </div>
  )
}
