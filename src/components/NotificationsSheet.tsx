import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowDownLeft,
  CheckCircle2,
  PartyPopper,
  X,
} from 'lucide-react'
import type { ReactNode } from 'react'
import { useLockBodyScroll } from '../lib/useLockBodyScroll'
import { formatBRL } from '../lib/loan'

type NotificationItem = {
  icon: ReactNode
  title: string
  message: string
  when: string
  unread: boolean
}

type NotificationsSheetProps = {
  open: boolean
  amount: number
  onClose: () => void
}

export function NotificationsSheet({
  open,
  amount,
  onClose,
}: NotificationsSheetProps) {
  useLockBodyScroll(open)

  const items: NotificationItem[] = [
    {
      icon: <ArrowDownLeft size={18} />,
      title: 'Crédito na conta',
      message: `${formatBRL(amount)} caiu na sua conta digital.`,
      when: 'Agora',
      unread: true,
    },
    {
      icon: <CheckCircle2 size={18} />,
      title: 'Conta criada com sucesso',
      message: 'Sua conta digital está pronta para uso.',
      when: 'Agora',
      unread: true,
    },
    {
      icon: <PartyPopper size={18} />,
      title: 'Empréstimo aprovado',
      message: `Seu crédito de ${formatBRL(amount)} foi aprovado.`,
      when: 'Há 2 min',
      unread: false,
    },
  ]

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Notificações"
            className="bg-[#0f1712] border border-white/10 w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 max-h-[92vh] overflow-y-auto"
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 60, opacity: 0 }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold">Notificações</h3>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#0f1712] bg-primary rounded-full px-2 py-0.5">
                  2 novas
                </span>
              </div>
              <button
                type="button"
                aria-label="Fechar"
                onClick={onClose}
                className="text-white/50"
              >
                <X size={22} />
              </button>
            </div>

            <div className="space-y-2">
              {items.map((item) => (
                <div
                  key={item.title}
                  className={`flex items-start gap-3 rounded-2xl px-4 py-3.5 border ${
                    item.unread
                      ? 'bg-primary/[0.07] border-primary/20'
                      : 'bg-white/5 border-white/10'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                      item.unread
                        ? 'bg-primary/20 text-primary'
                        : 'bg-white/10 text-white/70'
                    }`}
                  >
                    {item.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-semibold text-sm">{item.title}</p>
                      <span className="text-white/40 text-[11px] shrink-0">
                        {item.when}
                      </span>
                    </div>
                    <p className="text-white/55 text-xs mt-1 leading-snug">
                      {item.message}
                    </p>
                  </div>
                  {item.unread ? (
                    <span className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1.5" />
                  ) : null}
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
