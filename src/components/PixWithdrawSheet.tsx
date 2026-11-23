import { AnimatePresence, motion } from 'framer-motion'
import { Check, Loader2, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { formatCpf, formatPhone, onlyDigits } from '../lib/formatters'
import { formatBRL } from '../lib/loan'
import { useLockBodyScroll } from '../lib/useLockBodyScroll'

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
  mode?: 'withdraw' | 'transfer'
  amount: number
  initialBank: string
  initialPixKeyType: string
  initialPixKey: string
  onClose: () => void
  onComplete: (payload: {
    bank: string
    pixKeyType: string
    pixKey: string
  }) => void
}

export function PixWithdrawSheet({
  open,
  mode = 'withdraw',
  amount,
  initialBank,
  initialPixKeyType,
  initialPixKey,
  onClose,
  onComplete,
}: PixWithdrawSheetProps) {
  const isTransfer = mode === 'transfer'
  const [phase, setPhase] = useState<'form' | 'processing' | 'success'>('form')
  const [bank, setBank] = useState(initialBank)
  const [keyType, setKeyType] = useState(initialPixKeyType)
  const [pixKey, setPixKey] = useState(initialPixKey)
  const [showErrors, setShowErrors] = useState(false)
  const timer = useRef<number | null>(null)

  useLockBodyScroll(open)

  useEffect(() => {
    if (!open) return
    setPhase('form')
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

    const payload = { bank, pixKeyType: keyType, pixKey: pixKey.trim() }
    setPhase('processing')
    timer.current = window.setTimeout(() => {
      setPhase('success')
      onComplete(payload)
    }, 2400)
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
            aria-label={isTransfer ? 'Transferir via PIX' : 'Sacar via PIX'}
            className="bg-[#0f1712] border border-white/10 w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 max-h-[92vh] overflow-y-auto"
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 60, opacity: 0 }}
            onClick={(event) => event.stopPropagation()}
          >
            {phase === 'form' ? (
              <form onSubmit={handleSubmit}>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold">
                    {isTransfer ? 'Transferir via PIX' : 'Sacar via PIX'}
                  </h3>
                  <button
                    type="button"
                    aria-label="Fechar"
                    onClick={onClose}
                    className="text-white/50"
                  >
                    <X size={22} />
                  </button>
                </div>

                <p className="text-white/60 text-sm mb-2">
                  {isTransfer ? 'Valor da transferência' : 'Valor do saque'}
                </p>
                <div className="rounded-2xl bg-primary/10 border border-primary/20 px-5 py-4 mb-2 flex items-center justify-between gap-3">
                  <div>
                    <div className="text-3xl font-black text-primary leading-none">
                      {formatBRL(amount)}
                    </div>
                    <p className="text-white/50 text-xs mt-2">
                      {isTransfer
                        ? 'Disponível para transferir'
                        : 'Todo o seu saldo disponível'}
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
                    bankError
                      ? 'border-red-500/70'
                      : 'border-white/10 focus:border-primary'
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

                <p className="text-white/60 text-sm mb-3">Tipo de chave PIX</p>
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
                    keyError
                      ? 'border-red-500/70'
                      : 'border-white/10 focus:border-primary'
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
                  {isTransfer ? 'Confirmar transferência' : 'Confirmar saque'}
                </button>
              </form>
            ) : null}

            {phase === 'processing' ? (
              <div className="py-16 flex flex-col items-center text-center">
                <Loader2 size={48} className="text-primary animate-spin mb-6" />
                <h3 className="text-xl font-bold mb-2">
                  {isTransfer ? 'Transferindo' : 'Processando saque'}
                </h3>
                <p className="text-white/60 text-sm">
                  {isTransfer
                    ? 'Enviando o valor para a chave informada...'
                    : 'Validando sua solicitação de PIX...'}
                </p>
              </div>
            ) : null}

            {phase === 'success' ? (
              <div className="py-12 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(180,240,69,0.4)]">
                  <Check size={32} className="text-[#0f1712]" strokeWidth={3} />
                </div>
                <h3 className="text-xl font-bold mb-2">
                  {isTransfer
                    ? 'Transferência enviada'
                    : 'Saque solicitado com sucesso'}
                </h3>
                <p className="text-white/60 text-sm max-w-xs">
                  {isTransfer
                    ? 'O valor será enviado para a chave PIX informada.'
                    : 'Você receberá o valor via PIX em instantes.'}
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
