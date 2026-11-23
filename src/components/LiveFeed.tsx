import { AnimatePresence, motion } from 'framer-motion'
import { Check, RotateCcw, TrendingUp, X, Zap } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

const NAMES = [
  'João S.',
  'Maria S.',
  'Pedro C.',
  'Ana B.',
  'Carlos O.',
  'Juliana M.',
  'Roberto A.',
  'Fernanda T.',
  'Lucas P.',
  'Camila R.',
  'Marcos V.',
  'Patrícia L.',
  'André F.',
  'Vanessa G.',
  'Rafael D.',
  'Simone N.',
  'Tiago M.',
  'Aline C.',
]

const CITIES = [
  'São Paulo, SP',
  'Rio de Janeiro, RJ',
  'Belo Horizonte, MG',
  'Curitiba, PR',
  'Porto Alegre, RS',
  'Salvador, BA',
  'Brasília, DF',
  'Fortaleza, CE',
  'Recife, PE',
  'Goiânia, GO',
  'Manaus, AM',
  'Campinas, SP',
]

const AMOUNTS = [
  2000, 3000, 4500, 5000, 6000, 7500, 8500, 10000, 12000, 15000, 18000,
]

const KINDS = [
  'received',
  'received',
  'received',
  'approved',
  'approved',
  'reapproved',
  'increased',
  'denied',
  'score',
] as const

type Kind = (typeof KINDS)[number]

type LiveEvent = {
  id: number
  kind: Kind
  name: string
  amount: string
  city: string
}

const currency = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

function pick<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)]
}

function makeAmount() {
  const base = pick(AMOUNTS) + Math.floor(Math.random() * 900)
  const cents = 1 + Math.floor(Math.random() * 99)
  return currency.format(base + cents / 100)
}

function isRed(kind: Kind) {
  return kind === 'denied' || kind === 'score'
}

function EventIcon({ kind }: { kind: Kind }) {
  const className = isRed(kind) ? 'text-red-400' : 'text-primary'

  switch (kind) {
    case 'received':
      return <Zap size={13} className={className} />
    case 'approved':
      return <Check size={13} className={className} strokeWidth={3} />
    case 'reapproved':
      return <RotateCcw size={13} className={className} />
    case 'increased':
      return <TrendingUp size={13} className={className} />
    default:
      return <X size={13} className={className} strokeWidth={3} />
  }
}

function EventText({ event }: { event: LiveEvent }) {
  const amount = (
    <span className="font-semibold text-primary">{event.amount}</span>
  )

  switch (event.kind) {
    case 'received':
      return (
        <>
          recebeu {amount} via Pix
        </>
      )
    case 'approved':
      return (
        <>
          foi aprovado com limite de {amount}
        </>
      )
    case 'reapproved':
      return (
        <>
          foi reaprovado e liberou {amount}
        </>
      )
    case 'increased':
      return (
        <>
          aumentou o limite para {amount}
        </>
      )
    case 'denied':
      return <span className="text-red-400">teve o crédito recusado</span>
    default:
      return (
        <span className="text-red-400">não passou na análise desta vez</span>
      )
  }
}

function initialEvents(): LiveEvent[] {
  const kinds: Kind[] = ['received', 'approved', 'received']
  return kinds.map((kind, index) => ({
    id: index,
    kind,
    name: NAMES[index * 3],
    amount: makeAmount(),
    city: CITIES[index * 2],
  }))
}

export function LiveFeed() {
  const nextId = useRef(3)
  const [count, setCount] = useState(() => 380 + Math.floor(Math.random() * 60))
  const [events, setEvents] = useState<LiveEvent[]>(initialEvents)

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prev) => {
        const delta =
          Math.random() > 0.34
            ? 1 + Math.floor(Math.random() * 7)
            : -(1 + Math.floor(Math.random() * 5))
        return Math.min(1400, Math.max(280, prev + delta))
      })
    }, 2400)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setEvents((prev) =>
        [
          {
            id: nextId.current++,
            kind: pick(KINDS),
            name: pick(NAMES),
            amount: makeAmount(),
            city: pick(CITIES),
          },
          ...prev,
        ].slice(0, 3),
      )
    }, 8500)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="w-full max-w-lg mx-auto px-4">
      <div className="rounded-2xl bg-white/[0.06] border border-white/10 backdrop-blur-md shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between gap-3 px-4 md:px-5 py-2.5 border-b border-white/10">
          <span className="flex items-center gap-2 text-[10px] font-semibold tracking-[0.14em] text-white/80 uppercase">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shrink-0" />
            Ao vivo
          </span>
          <span className="text-[11px] md:text-xs text-white/65 whitespace-nowrap">
            <span className="font-bold text-primary tabular-nums">{count}</span>{' '}
            pessoas analisando agora
          </span>
        </div>

        <div className="px-2 py-1.5 h-[120px] overflow-hidden">
          <AnimatePresence initial={false} mode="popLayout">
            {events.map((event) => (
              <motion.div
                layout
                key={event.id}
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="flex items-center gap-2.5 px-2 md:px-3 h-9"
              >
                <span
                  className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                    isRed(event.kind) ? 'bg-red-500/15' : 'bg-primary/15'
                  }`}
                >
                  <EventIcon kind={event.kind} />
                </span>
                <p className="flex-1 min-w-0 text-left text-xs md:text-[13px] leading-snug text-white/60 truncate">
                  <span className="font-semibold text-white">{event.name}</span>{' '}
                  <EventText event={event} />
                </p>
                <span className="shrink-0 text-[10px] text-white/40 whitespace-nowrap hidden sm:block">
                  {event.city}
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
