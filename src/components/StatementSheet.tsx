import { AnimatePresence, motion } from 'framer-motion'
import { ArrowDownLeft, CheckCircle2, X } from 'lucide-react'
import { getBrandName } from '../lib/brand'
import { useLockBodyScroll } from '../lib/useLockBodyScroll'
import { formatBRL } from '../lib/loan'

type StatementSheetProps = {
  open: boolean
  amount: number
  onClose: () => void
}

export function StatementSheet({ open, amount, onClose }: StatementSheetProps) {
  useLockBodyScroll(open)

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
            aria-label="Extrato"
            className="bg-[#0f1712] border border-white/10 w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 max-h-[92vh] overflow-y-auto"
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 60, opacity: 0 }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">Extrato</h3>
              <button
                type="button"
                aria-label="Fechar"
                onClick={onClose}
                className="text-white/50"
              >
                <X size={22} />
              </button>
            </div>

            <div className="rounded-2xl bg-primary/10 border border-primary/20 px-5 py-4 mb-6">
              <p className="text-white/60 text-xs mb-1">Saldo atual</p>
              <p className="text-3xl font-black text-primary leading-none">
                {formatBRL(amount)}
              </p>
            </div>

            <h4 className="text-sm font-semibold text-white/60 mb-3">
              Movimentações
            </h4>
            <div className="space-y-2">
              <div className="flex items-center gap-3 bg-white/5 rounded-2xl px-4 py-3.5">
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
                    +{formatBRL(amount)}
                  </p>
                  <p className="text-white/40 text-xs">Hoje</p>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-white/5 rounded-2xl px-4 py-3.5">
                <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-white/10 text-white/70">
                  <CheckCircle2 size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">
                    Conta digital criada
                  </p>
                  <p className="text-white/50 text-xs">Cadastro aprovado</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-sm text-white/70">—</p>
                  <p className="text-white/40 text-xs">Hoje</p>
                </div>
              </div>
            </div>

            <p className="text-white/35 text-xs text-center mt-6">
              Nenhuma outra movimentação neste período.
            </p>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
