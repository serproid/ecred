import { motion } from 'framer-motion'
import {
  ArrowRight,
  BadgeCheck,
  Briefcase,
  Check,
  Circle,
  CircleCheck,
  HeartPulse,
  Lock,
  RotateCcw,
  ShieldCheck,
  Star,
  Zap,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Logo } from '../components/Logo'
import { calculateInstallment, formatBRL } from '../lib/loan'
import { useSimulation } from '../lib/simulation'

const BENEFITS = [
  {
    icon: HeartPulse,
    title: 'Proteção em caso de morte ou invalidez',
    desc: 'Sua família nunca herda a dívida — o saldo é quitado pelo seguro.',
  },
  {
    icon: Zap,
    title: 'Liberação imediata do valor',
    desc: 'Assim que o seguro é pago, o PIX cai na sua conta na hora.',
  },
  {
    icon: Briefcase,
    title: 'Proteção contra desemprego',
    desc: 'Perdeu o emprego? Suas parcelas ficam protegidas por até 6 meses.',
  },
  {
    icon: RotateCcw,
    title: '100% reembolsável após a quitação',
    desc: 'Quitou o empréstimo? O valor do seguro volta integralmente para você.',
  },
]

const REVIEWS = [
  {
    initials: 'AP',
    name: 'Ana Paula M.',
    city: 'São Paulo, SP',
    text: 'Fiquei insegura no início, mas paguei o seguro e o dinheiro caiu no meu PIX em poucos minutos. Recomendo demais!',
  },
  {
    initials: 'CE',
    name: 'Carlos Eduardo R.',
    city: 'Fortaleza, CE',
    text: 'Estava negativado e mesmo assim consegui. O seguro me deu tranquilidade e o valor foi liberado na hora.',
  },
  {
    initials: 'FL',
    name: 'Fernanda L.',
    city: 'Recife, PE',
    text: 'Peguei para quitar as dívidas do cartão. Em dois dias eu respirei. O PIX caiu e eu paguei tudo atrasado.',
  },
  {
    initials: 'MA',
    name: 'Marcos A.',
    city: 'Curitiba, PR',
    text: 'Usei o valor para abrir meu pequeno negócio. Comprei o estoque no mesmo dia em que caiu na conta.',
  },
  {
    initials: 'SP',
    name: 'Sandra P.',
    city: 'Belo Horizonte, MG',
    text: 'Todo ano eu fecho com a ecred. Já virou rotina: sem fila de banco e sem aquela burocracia.',
  },
  {
    initials: 'JR',
    name: 'Juliana R.',
    city: 'Salvador, BA',
    text: 'Estava com medo de contratar. Só fechei porque tem o seguro. Se não tivesse, eu não teria pegado.',
  },
  {
    initials: 'CS',
    name: 'Camila S.',
    city: 'Campinas, SP',
    text: 'No começo do ano peguei para comprar o material da minha filha. Chegou a tempo e ainda deu para o uniforme.',
  },
  {
    initials: 'RT',
    name: 'Ricardo T.',
    city: 'Goiânia, GO',
    text: 'Já tentei empréstimo CLT e banco comum. Aqui a taxa é bem mais em conta e compensou demais.',
  },
  {
    initials: 'PN',
    name: 'Patrícia N.',
    city: 'Porto Alegre, RS',
    text: 'Obrigada de verdade. Achei que não ia ser aprovada e o valor caiu no meu PIX no mesmo dia.',
  },
  {
    initials: 'DM',
    name: 'Diego M.',
    city: 'Manaus, AM',
    text: 'Estava enrolado com várias contas. Quitei o que estava apertado e o atendimento foi direto.',
  },
  {
    initials: 'LF',
    name: 'Luciana F.',
    city: 'Ribeirão Preto, SP',
    text: 'É o terceiro ano seguido que renovo com vocês para girar a loja. Prefiro isso a banco genérico.',
  },
  {
    initials: 'BC',
    name: 'Bruno C.',
    city: 'Brasília, DF',
    text: 'Quase desisti no meio. O seguro foi o que me deu coragem. Sem ele eu não teria continuado.',
  },
]

const BADGES = [
  { icon: BadgeCheck, label: 'Pagamento reconhecido automaticamente' },
  { icon: ShieldCheck, label: 'Processo 100% seguro' },
]

function Step({
  label,
  state,
}: {
  label: string
  state: 'done' | 'current' | 'upcoming'
}) {
  return (
    <div className="flex items-center gap-2.5">
      {state === 'done' ? (
        <span className="w-4 h-4 rounded-full bg-primary flex items-center justify-center shrink-0">
          <Check size={11} className="text-[#0f1712]" strokeWidth={3} />
        </span>
      ) : state === 'current' ? (
        <span className="w-4 h-4 rounded-full border-2 border-primary flex items-center justify-center shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
        </span>
      ) : (
        <span className="w-4 h-4 rounded-full border-2 border-white/25 shrink-0" />
      )}
      <span
        className={
          state === 'done'
            ? 'text-[13px] text-white/60'
            : state === 'current'
              ? 'text-[13px] text-white font-medium'
              : 'text-[13px] text-white/45'
        }
      >
        {label}
      </span>
    </div>
  )
}

function Stars() {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          size={12}
          className="fill-amber-400 text-amber-400"
        />
      ))}
    </div>
  )
}

function PriceFooter({
  price,
  ctaLabel,
  onClick,
}: {
  price: number
  ctaLabel: string
  onClick: () => void
}) {
  return (
    <div className="flex flex-col items-center text-center">
      <p className="text-3xl font-black text-[#2e5535] tracking-tight leading-none">
        {formatBRL(price)}
      </p>
      <p className="text-sm text-muted-foreground mt-1.5">
        Pagamento único, sem mensalidades
      </p>
      <button
        type="button"
        onClick={onClick}
        className="mt-4 w-full h-14 rounded-full font-bold text-base inline-flex items-center justify-center gap-2 bg-primary text-[#0f1712] hover:bg-primary/90 hover:scale-[1.01] shadow-[0_0_25px_rgba(180,240,69,0.25)] transition-all"
      >
        {ctaLabel} <ArrowRight size={18} />
      </button>
      <div className="flex flex-col items-center gap-1.5 mt-4">
        {BADGES.map((badge) => {
          const Icon = badge.icon
          return (
            <span
              key={badge.label}
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground"
            >
              <Icon size={14} className="text-[#2e5535]" /> {badge.label}
            </span>
          )
        })}
      </div>
    </div>
  )
}

export function SeguroPage() {
  const navigate = useNavigate()
  const { data, update } = useSimulation()

  const firstName = data.name.split(' ')[0] || 'cliente'
  const base = data.approvedAmount > 0 ? data.approvedAmount : data.amount

  const quotes = [
    { id: 'A', productId: 'seguro-basico', price: 21, extra: 0 },
    { id: 'B', productId: 'seguro-plus', price: 37, extra: 2000 },
    { id: 'C', productId: 'seguro-premium', price: 47, extra: 6000 },
  ]

  const [selectedId, setSelectedId] = useState(() => {
    const match = quotes.find((quote) => quote.price === data.seguroPrice)
    return match?.id ?? 'B'
  })
  const selected = quotes.find((quote) => quote.id === selectedId) ?? quotes[1]

  const [feedIndex, setFeedIndex] = useState(0)
  const [feedVisible, setFeedVisible] = useState(true)

  useEffect(() => {
    if (REVIEWS.length <= 2) return
    let dead = false
    let hold = 0
    let wait = 0

    const loop = () => {
      hold = window.setTimeout(() => {
        if (dead) return
        setFeedVisible(false)
        wait = window.setTimeout(() => {
          if (dead) return
          setFeedIndex((current) => (current + 2) % REVIEWS.length)
          setFeedVisible(true)
          loop()
        }, 420)
      }, 4500)
    }

    loop()
    return () => {
      dead = true
      window.clearTimeout(hold)
      window.clearTimeout(wait)
    }
  }, [])

  const visibleReviews = Array.from({ length: 2 }, (_, index) => {
    return REVIEWS[(feedIndex + index) % REVIEWS.length]
  })

  const handlePay = () => {
    update({
      seguroPrice: selected.price,
      seguroExtra: selected.extra,
      checkoutProductId: selected.productId,
      checkoutNext: 'iof',
    })
    navigate('/checkout')
  }

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-1/4 right-[-15%] w-[55%] h-[55%] bg-primary/10 blur-[130px] rounded-full" />
      </div>

      <div className="relative max-w-md mx-auto px-5 pt-6 pb-14">
        <div className="flex items-center justify-between mb-6">
          <Logo variant="light" className="text-2xl" />
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2e5535] bg-primary/10 px-2.5 py-1 rounded-full">
            <Lock size={12} /> Etapa final
          </span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="rounded-2xl bg-gradient-to-br from-[#123320] to-[#0b1f13] text-white p-6 relative overflow-hidden shadow-lg"
        >
          <div className="absolute -top-12 -right-10 w-40 h-40 bg-primary/20 blur-[70px]" />
          <div className="relative z-10">
            <p className="text-[11px] font-bold text-primary uppercase tracking-[0.15em] mb-2">
              Falta pouco, {firstName}
            </p>
            <h1 className="text-xl font-bold tracking-tight leading-tight">
              Seu empréstimo está quase liberado
            </h1>
            <p className="text-white/70 mt-2 text-sm">
              Para liberar o PIX de{' '}
              <span className="text-primary font-semibold">
                {formatBRL(base)}
              </span>{' '}
              na sua conta, falta apenas contratar o seguro obrigatório do
              crédito.
            </p>
            <div className="mt-5 space-y-2">
              <Step
                state="done"
                label={`Empréstimo de ${formatBRL(base)} aprovado`}
              />
              <Step state="done" label="Conta digital criada" />
              <Step state="current" label="Contratar seguro do crédito" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.08 }}
          className="mt-7"
        >
          <h2 className="text-base font-bold mb-3 flex items-center gap-2">
            <ShieldCheck size={17} className="text-[#2e5535]" /> O que o seguro
            inclui
          </h2>
          <div className="space-y-2.5">
            {BENEFITS.map((benefit) => {
              const Icon = benefit.icon
              return (
                <div
                  key={benefit.title}
                  className="flex items-start gap-3 rounded-xl border border-border bg-card p-3.5"
                >
                  <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
                    <Icon size={15} className="text-[#2e5535]" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm leading-tight">
                      {benefit.title}
                    </p>
                    <p className="text-muted-foreground text-[13px] mt-0.5 leading-snug">
                      {benefit.desc}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.16 }}
          className="mt-7"
        >
          <h2 className="text-base font-bold mb-3">Quem contratou, aprovou</h2>
          <div
            className="space-y-2.5"
            aria-live="polite"
            style={{
              opacity: feedVisible ? 1 : 0,
              transition: 'opacity .42s ease',
            }}
          >
            {visibleReviews.map((review) => (
              <div
                key={review.name}
                className="rounded-xl border border-border bg-card p-4"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-9 h-9 rounded-full bg-[#2e5535] text-white flex items-center justify-center text-xs font-bold shrink-0">
                    {review.initials}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-sm leading-tight">
                      {review.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {review.city}
                    </p>
                  </div>
                  <div className="ml-auto">
                    <Stars />
                  </div>
                </div>
                <p className="text-[13px] text-muted-foreground leading-snug">
                  "{review.text}"
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.24 }}
          className="mt-7"
        >
          <h2 className="text-base font-bold mb-1">Escolha sua cotação</h2>
          <p className="text-xs text-muted-foreground mb-3">
            Cotações com valor extra liberam mais dinheiro na sua conta.
          </p>
          <div className="space-y-2.5">
            {quotes.map((quote) => {
              const isSelected = selectedId === quote.id
              const receive = base + quote.extra
              const installment = calculateInstallment(
                receive,
                data.installments,
              )
              return (
                <button
                  key={quote.id}
                  type="button"
                  onClick={() => setSelectedId(quote.id)}
                  aria-pressed={isSelected}
                  className={`w-full text-left rounded-xl border-2 p-3.5 transition-all ${
                    isSelected
                      ? 'border-[#2e5535] bg-[#2e5535]/[0.05]'
                      : 'border-border bg-card hover:border-[#2e5535]/40'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {isSelected ? (
                      <CircleCheck
                        size={20}
                        className="text-[#2e5535] shrink-0"
                      />
                    ) : (
                      <Circle
                        size={20}
                        className="text-muted-foreground/40 shrink-0"
                      />
                    )}
                    <div className="flex-1 min-w-0 flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-xs text-muted-foreground">
                          Você receberá
                        </p>
                        <p className="text-xl font-black text-[#16a34a] leading-tight">
                          {formatBRL(receive)}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {data.installments}x de {formatBRL(installment)}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-xs text-muted-foreground">Seguro</p>
                        <p className="text-base font-black text-[#2e5535] leading-tight mt-0.5">
                          {formatBRL(quote.price)}
                        </p>
                      </div>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.32 }}
          className="mt-8"
        >
          <PriceFooter
            price={selected.price}
            ctaLabel="Pagar seguro"
            onClick={handlePay}
          />
        </motion.div>
      </div>
    </div>
  )
}
