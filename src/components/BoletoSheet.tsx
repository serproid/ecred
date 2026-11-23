import { AnimatePresence, motion } from 'framer-motion'
import { Check, Loader2, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { onlyDigits } from '../lib/formatters'
import { formatBRL } from '../lib/loan'
import { useLockBodyScroll } from '../lib/useLockBodyScroll'

function formatBoleto(value: string) {
  return onlyDigits(value)
    .slice(0, 48)
    .replace(/(\d{5})(?=\d)/g, '$1 ')
    .trim()
}

type BoletoSheetProps = {
  open: boolean
  onClose: () => void
}

export function BoletoSheet({ open, onClose }: BoletoSheetProps) {
  const [code, setCode] = useState('')
  const [touched, setTouched] = useState(false)
  const [phase, setPhase] = useState<'form' | 'processing' | 'success'>('form')
  const timer = useRef<number | null>(null)

  useLockBodyScroll(open)

  useEffect(
    () => () => {
      if (timer.current) window.clearTimeout(timer.current)
    },
    [],
  )

  const digits = onlyDigits(code)
  const validLength =
    digits.length === 44 || digits.length === 47 || digits.length === 48
  const boletoValue = digits.length >= 10 ? Number(digits.slice(-10)) / 100 : 0
  const error =
    touched && !validLength
      ? 'Digite um código de boleto válido (44, 47 ou 48 dígitos).'
      : ''

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    setTouched(true)
    if (!validLength) return

    setPhase('processing')
    timer.current = window.setTimeout(() => setPhase('success'), 2000)
  }

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => {
            if (phase !== 'processing') onClose()
          }}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Pagar boleto"
            className="bg-[#0f1712] border border-white/10 w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 max-h-[92vh] overflow-y-auto"
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 60, opacity: 0 }}
            onClick={(event) => event.stopPropagation()}
          >
            {phase === 'form' ? (
              <form onSubmit={handleSubmit}>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold">Pagar boleto</h3>
                  <button
                    type="button"
                    aria-label="Fechar"
                    onClick={onClose}
                    className="text-white/50"
                  >
                    <X size={22} />
                  </button>
                </div>

                <label className="block text-white/60 text-sm mb-2">
                  Código do boleto
                </label>
                <input
                  inputMode="numeric"
                  value={code}
                  onChange={(event) => setCode(formatBoleto(event.target.value))}
                  placeholder="Digite a linha digitável"
                  autoComplete="off"
                  className={`w-full h-14 rounded-xl bg-white/5 border-2 px-4 text-white placeholder:text-white/30 outline-none transition-colors tracking-wide ${
                    error
                      ? 'border-red-500/70'
                      : 'border-white/10 focus:border-primary'
                  }`}
                />
                {error ? (
                  <p className="text-red-400 text-xs mt-2 mb-4">{error}</p>
                ) : (
                  <p className="text-white/40 text-xs mt-2 mb-4">
                    Cole ou digite o código de barras do boleto.
                  </p>
                )}

                {validLength ? (
                  <div className="rounded-2xl bg-primary/10 border border-primary/20 px-5 py-4 mb-6">
                    <p className="text-white/60 text-xs mb-1">
                      Boleto identificado
                    </p>
                    <p className="text-3xl font-black text-primary leading-none">
                      {formatBRL(boletoValue)}
                    </p>
                    <p className="text-white/40 text-xs mt-2 break-all">
                      {code}
                    </p>
                  </div>
                ) : null}

                <button
                  type="submit"
                  disabled={!validLength}
                  className={`w-full h-14 rounded-full font-bold text-lg bg-primary text-[#0f1712] transition-colors ${
                    validLength
                      ? 'hover:bg-primary/90'
                      : 'opacity-40 cursor-not-allowed'
                  }`}
                >
                  Pagar boleto
                </button>
              </form>
            ) : null}

            {phase === 'processing' ? (
              <div className="py-16 flex flex-col items-center text-center">
                <Loader2 size={48} className="text-primary animate-spin mb-6" />
                <h3 className="text-xl font-bold mb-2">Processando boleto</h3>
                <p className="text-white/60 text-sm">
                  Validando o código e efetuando o pagamento...
                </p>
              </div>
            ) : null}

            {phase === 'success' ? (
              <div className="py-12 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(180,240,69,0.4)]">
                  <Check size={32} className="text-[#0f1712]" strokeWidth={3} />
                </div>
                <h3 className="text-xl font-bold mb-2">
                  Boleto pago com sucesso
                </h3>
                <p className="text-white/60 text-sm">
                  Pagamento de {formatBRL(boletoValue)} confirmado.
                </p>
                <button
                  type="button"
                  onClick={onClose}
                  className="mt-8 w-full h-14 rounded-full font-bold text-lg bg-primary text-[#0f1712] hover:bg-primary/90 transition-colors"
                >
                  Concluir
                </button>
              </div>
            ) : null}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
