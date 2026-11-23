import { AnimatePresence, motion } from 'framer-motion'
import { Loader2, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { formatCpf, formatPhone, onlyDigits } from '../lib/formatters'
import { formatBRL } from '../lib/loan'

const BANKS = [
  'Banco do Brasil',
  'Banco Santander',
  'Caixa Econômica Federal',
  'Banco Bradesco',
  'Itaú Unibanco',
  'NuBank',
  'Banco C6',
  'Banco Inter',
  'Banco BTG Pactual',
  'Banco Safra',
  'Banco Original',
  'Banco Neon',
  'Banco Pan',
  'PicPay',
  'Mercado Pago',
]

const KEY_TYPES = [
  {
    id: 'cpf',
    label: 'CPF',
    placeholder: '000.000.000-00',
    inputMode: 'numeric' as const,
    errorHint: 'Informe um CPF com 11 dígitos.',
  },
  {
    id: 'telefone',
    label: 'Telefone',
    placeholder: '(00) 00000-0000',
    inputMode: 'tel' as const,
    errorHint: 'Informe um telefone com DDD.',
  },
  {
    id: 'email',
    label: 'E-mail',
    placeholder: 'voce@email.com',
    inputMode: 'email' as const,
    errorHint: 'Informe um e-mail válido.',
  },
  {
    id: 'aleatoria',
    label: 'Aleatória',
    placeholder: 'Cole sua chave aleatória',
    inputMode: 'text' as const,
    errorHint: '',
  },
]

const isEmailValid = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

type PixWithdrawSheetProps = {
  open: boolean
  amount: number
  initialBank: string
  initialPixKeyType: string
  initialPixKey: string
  onClose: () => void
  onConfirm: (payload: {
    bank: string
    pixKeyType: string
    pixKey: string
  }) => void
}

export function PixWithdrawSheet({
  open,
  amount,
  initialBank,
  initialPixKeyType,
  initialPixKey,
  onClose,
  onConfirm,
}: PixWithdrawSheetProps) {
  const [mode, setMode] = useState<'form' | 'processing'>('form')
  const [bank, setBank] = useState(initialBank)
  const [keyType, setKeyType] = useState(initialPixKeyType)
  const [pixKey, setPixKey] = useState(initialPixKey)
  const [showErrors, setShowErrors] = useState(false)
  const timer = useRef<number | null>(null)

  useEffect(() => {
    if (!open) return
    setMode('form')
    setShowErrors(false)
    setBank(initialBank)
    setKeyType(initialPixKeyType)
    setPixKey(initialPixKey)
  }, [open, initialBank, initialPixKeyType, initialPixKey])

  useEffect(
    () => () => {
      if (timer.current) window.clearTimeout(timer.current)
    },
    [],
  )

  useEffect(() => {
    if (!open) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [open])

  const selectedType = KEY_TYPES.find((item) => item.id === keyType) ?? null

  const keyValid =
    keyType === 'cpf'
      ? onlyDigits(pixKey).length === 11
      : keyType === 'telefone'
        ? onlyDigits(pixKey).length >= 10
        : keyType === 'email'
          ? isEmailValid(pixKey)
          : keyType === 'aleatoria'
            ? pixKey.trim().length > 0
            : false

  const bankValid = bank.trim().length > 0
  const canSubmit = Boolean(keyType) && keyValid && bankValid

  const bankError =
    showErrors && !bankValid
      ? 'Selecione seu banco para receber o PIX.'
      : ''
  const typeError =
    showErrors && !keyType ? 'Escolha o tipo de chave PIX.' : ''
  const keyError = !keyType
    ? ''
    : !pixKey.trim()
      ? showErrors
        ? 'Informe sua chave PIX.'
        : ''
      : !keyValid
        ? selectedType?.errorHint ?? ''
        : ''

  const handleKeyChange = (value: string) => {
    if (keyType === 'cpf') {
      setPixKey(formatCpf(value))
      return
    }
    if (keyType === 'telefone') {
      setPixKey(formatPhone(value))
      return
    }
    setPixKey(value)
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    setShowErrors(true)
    if (!canSubmit) return

    setMode('processing')
    timer.current = window.setTimeout(() => {
      onConfirm({ bank, pixKeyType: keyType, pixKey: pixKey.trim() })
    }, 2600)
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
            if (mode !== 'processing') onClose()
          }}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Sacar via PIX"
            className="bg-[#0f1712] border border-white/10 w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 max-h-[92vh] overflow-y-auto"
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 60, opacity: 0 }}
            onClick={(event) => event.stopPropagation()}
          >
            {mode === 'form' ? (
              <form onSubmit={handleSubmit}>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold">Sacar via PIX</h3>
                  <button
                    type="button"
                    aria-label="Fechar"
                    onClick={onClose}
                    className="text-white/50"
                  >
                    <X size={22} />
                  </button>
                </div>

                <p className="text-white/60 text-sm mb-2">Valor do saque</p>
                <div className="rounded-2xl bg-primary/10 border border-primary/20 px-5 py-4 mb-2 flex items-center justify-between gap-3">
                  <div>
                    <div className="text-3xl font-black text-primary leading-none">
                      {formatBRL(amount)}
                    </div>
                    <p className="text-white/50 text-xs mt-2">
                      Todo o seu saldo disponível
                    </p>
                  </div>
                  <span className="shrink-0 text-[11px] font-bold uppercase tracking-wider text-[#0f1712] bg-primary rounded-full px-3 py-1">
                    Total
                  </span>
                </div>

                <label className="block text-white/60 text-sm mb-2 mt-6">
                  Seu banco
                </label>
                <select
                  value={bank}
                  onChange={(event) => setBank(event.target.value)}
                  className={`w-full h-14 rounded-xl bg-white/5 border-2 px-4 text-white outline-none transition-colors ${
                    bankError ? 'border-red-500/70' : 'border-white/10 focus:border-primary'
                  }`}
                >
                  <option value="" className="bg-[#0f1712]">
                    Selecione seu banco
                  </option>
                  {BANKS.map((option) => (
                    <option key={option} value={option} className="bg-[#0f1712]">
                      {option}
                    </option>
                  ))}
                </select>
                {bankError ? (
                  <p className="text-red-400 text-xs mt-2 mb-6">{bankError}</p>
                ) : (
                  <p className="text-white/40 text-xs mt-2 mb-6">
                    Selecione o banco onde você tem conta para receber o PIX.
                  </p>
                )}

                <p className="text-white/60 text-sm mb-3">
                  Tipo de chave PIX
                </p>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {KEY_TYPES.map((type) => (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => {
                        if (type.id !== keyType) {
                          setKeyType(type.id)
                          setPixKey('')
                        }
                      }}
                      className={`px-4 py-3 rounded-xl border-2 text-sm font-medium text-left transition-all ${
                        keyType === type.id
                          ? 'border-primary bg-primary/10 text-white'
                          : 'border-white/10 bg-white/5 text-white/70 hover:border-white/25'
                      }`}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
                {typeError ? (
                  <p className="text-red-400 text-xs mb-4">{typeError}</p>
                ) : null}

                <label className="block text-white/60 text-sm mb-2">
                  Sua chave PIX
                </label>
                <input
                  type={keyType === 'email' ? 'email' : 'text'}
                  inputMode={selectedType?.inputMode ?? 'text'}
                  value={pixKey}
                  disabled={!keyType}
                  onChange={(event) => handleKeyChange(event.target.value)}
                  placeholder={
                    selectedType?.placeholder ?? 'Escolha o tipo de chave acima'
                  }
                  autoComplete="off"
                  className={`w-full h-14 rounded-xl bg-white/5 border-2 px-4 text-white placeholder:text-white/30 outline-none transition-colors ${
                    keyError ? 'border-red-500/70' : 'border-white/10 focus:border-primary'
                  } ${keyType ? '' : 'opacity-50 cursor-not-allowed'}`}
                />
                {keyError ? (
                  <p className="text-red-400 text-xs mt-2 mb-6">{keyError}</p>
                ) : (
                  <p className="text-white/40 text-xs mt-2 mb-6">
                    {keyType
                      ? 'Digite a chave PIX que vai receber o valor.'
                      : 'Primeiro escolha o tipo de chave acima.'}
                  </p>
                )}

                <button
                  type="submit"
                  className="w-full h-14 rounded-full font-bold text-lg bg-primary text-[#0f1712] hover:bg-primary/90 transition-colors"
                >
                  Confirmar saque
                </button>
              </form>
            ) : (
              <div className="py-16 flex flex-col items-center text-center">
                <Loader2 size={48} className="text-primary animate-spin mb-6" />
                <h3 className="text-xl font-bold mb-2">Processando saque</h3>
                <p className="text-white/60 text-sm">
                  Validando sua solicitação de PIX...
                </p>
              </div>
            )}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
