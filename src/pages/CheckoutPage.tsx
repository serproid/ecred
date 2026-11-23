import {
  AlarmClock,
  ArrowRight,
  BadgeCheck,
  Check,
  CirclePlus,
  CreditCard,
  Headset,
  Lock,
  Plus,
  ShieldCheck,
  Star,
  Zap,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Logo } from '../components/Logo'
import { formatBRL } from '../lib/loan'
import { useSimulation } from '../lib/simulation'

const SEGUROS: Record<string, { name: string; desc: string; price: number }> = {
  'seguro-basico': {
    name: 'Seguro Prestamista Básico',
    desc: 'Cobertura padrão do empréstimo',
    price: 21,
  },
  'seguro-plus': {
    name: 'Seguro Prestamista Plus',
    desc: 'Cobertura completa do empréstimo',
    price: 37,
  },
  'seguro-premium': {
    name: 'Seguro Prestamista Premium',
    desc: 'Cobertura máxima do empréstimo',
    price: 47,
  },
}

const BUMPS = [
  {
    id: 'suporte-24h',
    title: 'Suporte Exclusivo 24h',
    desc: 'Atendimento prioritário 24h/7d no WhatsApp',
    price: 9,
    loanExtra: 0,
    icon: Headset,
    iconClass: 'bg-[#16a34a] text-white',
  },
  {
    id: 'aumento-credito',
    title: 'Aumento de Crédito +R$ 5.000',
    desc: '+R$ 5.000 a mais direto na sua conta',
    price: 22,
    loanExtra: 5000,
    icon: CirclePlus,
    iconClass: 'bg-amber-100 text-amber-500',
  },
  {
    id: 'cartao-credito',
    title: 'Cartão de Crédito Ecred',
    desc: 'Limite de R$ 2.000, sem anuidade no 1º ano',
    price: 19,
    loanExtra: 0,
    icon: CreditCard,
    iconClass: 'bg-[#0f1712] text-white',
  },
]

const TESTIMONIALS = [
  {
    initials: 'RM',
    name: 'Roberto M.',
    city: 'São Paulo, SP',
    text: 'Paguei e caiu em 7 minutos. É real!',
  },
  {
    initials: 'AP',
    name: 'Ana Paula',
    city: 'Belo Horizonte, MG',
    text: 'Excelente atendimento. Só acreditei quando vi o Pix. Vale a pena',
  },
  {
    initials: 'JS',
    name: 'Juliana S.',
    city: 'Fortaleza, CE',
    text: 'Estava atolada em dívida e sem saída. Consegui resolver tudo aqui, recomendo demais',
  },
  {
    initials: 'MC',
    name: 'Marina C.',
    city: 'Belo Horizonte, MG',
    text: 'Peguei para pagar as dívidas do cartão. Caiu rápido e eu quitei tudo.',
  },
  {
    initials: 'FS',
    name: 'Felipe S.',
    city: 'Curitiba, PR',
    text: 'Abri minha barbearia com esse valor. Melhor do que esperar banco.',
  },
  {
    initials: 'RO',
    name: 'Renata O.',
    city: 'Recife, PE',
    text: 'Só contratei por causa do seguro. Sem isso eu não teria coragem.',
  },
  {
    initials: 'AL',
    name: 'André L.',
    city: 'Salvador, BA',
    text: 'Todo ano pego com a ecred. Já nem olho outra opção.',
  },
  {
    initials: 'BN',
    name: 'Beatriz N.',
    city: 'Campinas, SP',
    text: 'Comprei o material escolar da minha filha. O PIX caiu na hora.',
  },
  {
    initials: 'TP',
    name: 'Thiago P.',
    city: 'Manaus, AM',
    text: 'Taxa bem mais em conta que o empréstimo CLT. Compensa.',
  },
  {
    initials: 'CV',
    name: 'Cláudia V.',
    city: 'Porto Alegre, RS',
    text: 'Estava insegura, mas o seguro me tranquilizou. Caiu no mesmo dia.',
  },
  {
    initials: 'PH',
    name: 'Paulo H.',
    city: 'Goiânia, GO',
    text: 'Prefiro vocês a banco genérico. Sem enrolação e o PIX caiu.',
  },
  {
    initials: 'VK',
    name: 'Vanessa K.',
    city: 'Natal, RN',
    text: 'Paguei as contas de casa e ainda sobrou um pouco. Obrigada.',
  },
]

function Stars({ size = 14, count = 5 }: { size?: number; count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <Star
          key={index}
          size={size}
          className="fill-amber-400 text-amber-400"
        />
      ))}
    </>
  )
}

export function CheckoutPage() {
  const navigate = useNavigate()
  const { data, update } = useSimulation()

  const baseProduct =
    SEGUROS[data.checkoutProductId] ?? SEGUROS['seguro-plus']
  const basePrice = data.seguroPrice > 0 ? data.seguroPrice : baseProduct.price

  const [seconds, setSeconds] = useState(900)
  const [selected, setSelected] = useState<Record<string, boolean>>({})
  const [feedIndex, setFeedIndex] = useState(0)
  const [feedVisible, setFeedVisible] = useState(true)

  useEffect(() => {
    const id = window.setInterval(() => {
      setSeconds((current) => (current > 0 ? current - 1 : 0))
    }, 1000)
    return () => window.clearInterval(id)
  }, [])

  useEffect(() => {
    if (TESTIMONIALS.length <= 3) return
    let dead = false
    let hold = 0
    let wait = 0

    const loop = () => {
      hold = window.setTimeout(() => {
        if (dead) return
        setFeedVisible(false)
        wait = window.setTimeout(() => {
          if (dead) return
          setFeedIndex((current) => (current + 3) % TESTIMONIALS.length)
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

  const selectedBumps = BUMPS.filter((bump) => selected[bump.id])
  const total = basePrice + selectedBumps.reduce((sum, bump) => sum + bump.price, 0)
  const visibleReviews = Array.from({ length: 3 }, (_, index) => {
    return TESTIMONIALS[(feedIndex + index) % TESTIMONIALS.length]
  })

  const time = `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(
    seconds % 60,
  ).padStart(2, '0')}`

  const toggleBump = (id: string) =>
    setSelected((current) => ({ ...current, [id]: !current[id] }))

  const handleGeneratePix = () => {
    const base = data.approvedAmount > 0 ? data.approvedAmount : data.amount
    const loanExtra = selectedBumps.reduce(
      (sum, bump) => sum + bump.loanExtra,
      0,
    )
    update({
      checkoutTotal: total,
      checkoutLoan: base + data.seguroExtra + loanExtra,
      checkoutBumpIds: selectedBumps.map((bump) => bump.id),
    })
    navigate('/pagamento')
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-28 relative selection:bg-primary selection:text-primary-foreground">
      <div className="bg-destructive text-destructive-foreground px-4 py-2.5 flex items-center justify-center gap-2 sticky top-0 z-50 shadow-md">
        <AlarmClock size={16} className="animate-pulse" />
        <span className="text-sm font-bold tracking-wide uppercase">
          Oferta expira em <span className="tabular-nums">{time}</span>
        </span>
      </div>

      <main className="max-w-md mx-auto px-5 pt-6 flex flex-col gap-8">
        <header className="flex items-center justify-between">
          <Logo variant="light" className="text-2xl" />
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#2e5535] bg-primary/10 px-2.5 py-1 rounded-md">
            <Lock size={12} />
            Pagamento Seguro
          </span>
        </header>

        <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#0f1712] rounded-xl flex items-center justify-center shrink-0">
              <span className="text-white font-bold text-xs">ecred</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-base leading-tight">
                {baseProduct.name}
              </p>
              <p className="text-sm text-muted-foreground mt-0.5 leading-snug">
                {baseProduct.desc}
              </p>
            </div>
            <p className="font-black text-lg tabular-nums whitespace-nowrap">
              {formatBRL(basePrice)}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-border space-y-2 text-sm">
            <div className="flex items-center justify-between gap-3">
              <span className="text-muted-foreground truncate">
                {baseProduct.name}
              </span>
              <span className="tabular-nums whitespace-nowrap">
                {formatBRL(basePrice)}
              </span>
            </div>
            {selectedBumps.map((bump) => (
              <div
                key={bump.id}
                className="flex items-center justify-between gap-3"
              >
                <span className="text-muted-foreground truncate">
                  {bump.title}
                </span>
                <span className="tabular-nums whitespace-nowrap">
                  +{formatBRL(bump.price)}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
            <span className="font-bold text-lg">Total:</span>
            <span className="font-black text-xl tabular-nums text-[#16a34a]">
              {formatBRL(total)}
            </span>
          </div>
        </section>

        <section className="space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-2">
            Adicione mais vantagens
          </h3>
          {BUMPS.map((bump) => {
            const active = Boolean(selected[bump.id])
            const Icon = bump.icon
            return (
              <button
                key={bump.id}
                type="button"
                onClick={() => toggleBump(bump.id)}
                aria-pressed={active}
                className={`w-full text-left rounded-2xl border bg-card shadow-sm transition-all cursor-pointer overflow-hidden ${
                  active
                    ? 'border-[#16a34a] ring-1 ring-[#16a34a]'
                    : 'border-border hover:border-[#2e5535]/40'
                }`}
              >
                <div className="flex items-center gap-3.5 p-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${bump.iconClass}`}
                  >
                    <Icon size={22} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-[15px] leading-snug">
                      {bump.title}
                    </p>
                    <p className="text-[13px] text-muted-foreground mt-0.5 leading-snug">
                      {bump.desc}
                    </p>
                  </div>
                </div>
                <div
                  className={`flex items-center justify-between gap-3 px-4 py-3 border-t transition-colors ${
                    active
                      ? 'border-[#16a34a]/25 bg-[#16a34a]/[0.07]'
                      : 'border-border bg-muted/40'
                  }`}
                >
                  <span className="text-sm">
                    <span className="font-black text-[#2e5535]">
                      +{formatBRL(bump.price)}
                    </span>
                  </span>
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-[13px] font-bold transition-colors ${
                      active
                        ? 'bg-[#16a34a] text-white'
                        : 'border border-[#2e5535]/30 text-[#2e5535] bg-white'
                    }`}
                  >
                    {active ? (
                      <>
                        <Check size={14} strokeWidth={3} /> Adicionado
                      </>
                    ) : (
                      <>
                        <Plus size={14} strokeWidth={3} /> Adicionar
                      </>
                    )}
                  </span>
                </div>
              </button>
            )
          })}
        </section>

        <section className="space-y-4 pt-4 border-t border-border">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Stars size={14} />
              <span className="ml-1 text-sm font-black">4,9/5</span>
            </div>
            <h3 className="text-sm font-bold text-muted-foreground tracking-wide">
              Mais de 120 mil clientes atendidos
            </h3>
          </div>

          <div
            className="grid gap-3"
            aria-live="polite"
            style={{
              opacity: feedVisible ? 1 : 0,
              transition: 'opacity .42s ease',
            }}
          >
            {visibleReviews.map((review) => (
              <div
                key={review.name}
                className="bg-card border border-border rounded-xl p-4 flex gap-3 shadow-sm"
              >
                <div className="w-10 h-10 rounded-full bg-[#2e5535] text-white flex items-center justify-center font-bold text-sm shrink-0">
                  {review.initials}
                </div>
                <div>
                  <div className="flex items-center gap-1 mb-1">
                    <Stars size={10} />
                    <span className="ml-1 inline-flex items-center gap-0.5 text-[10px] font-semibold text-[#16a34a]">
                      <BadgeCheck size={11} /> Perfil verificado
                    </span>
                  </div>
                  <p className="text-sm font-medium leading-snug mb-1">
                    {review.text}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {review.name} · {review.city}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="flex flex-wrap items-center justify-center gap-4 text-muted-foreground pb-4">
          <div className="flex items-center gap-1.5">
            <ShieldCheck size={14} />
            <span className="text-xs font-medium">Site Seguro SSL</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Lock size={14} />
            <span className="text-xs font-medium">LGPD 100%</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Zap size={14} />
            <span className="text-xs font-medium">PIX Banco Central</span>
          </div>
        </section>
      </main>

      <div className="fixed bottom-0 inset-x-0 bg-background/80 backdrop-blur-xl border-t border-border p-4 z-40 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
        <div className="max-w-md mx-auto flex items-center gap-4">
          <div className="flex-1">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Total
            </p>
            <p className="text-xl font-black text-foreground tabular-nums leading-none">
              {formatBRL(total)}
            </p>
          </div>
          <button
            type="button"
            onClick={handleGeneratePix}
            className="h-14 px-8 rounded-full font-black text-base uppercase tracking-wide inline-flex items-center justify-center gap-2 transition-all shrink-0 bg-primary text-primary-foreground hover:scale-[1.02] shadow-[0_0_20px_rgba(180,240,69,0.3)]"
          >
            Gerar PIX <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}
