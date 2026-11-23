import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { getBrandName } from '../lib/brand'

export function TransferCard() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, rotate: -2 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="relative z-10"
    >
      <div className="bg-[#1a231d] border border-white/10 p-6 rounded-3xl shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[50px]" />

        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 2L2 7L12 12L22 7L12 2Z"
                stroke="#0f1712"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2 17L12 22L22 17"
                stroke="#0f1712"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2 12L12 17L22 12"
                stroke="#0f1712"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-white font-semibold">Transferência Recebida</h3>
            <p className="text-white/60 text-sm">Agora mesmo</p>
          </div>
        </div>

        <div className="text-center mb-8">
          <p className="text-white/60 text-sm mb-1">Valor recebido</p>
          <h2 className="text-4xl font-bold text-white tracking-tight">
            R$ 15.000,00
          </h2>
        </div>

        <div className="bg-[#0f1712] rounded-2xl p-4 mb-4">
          <div className="flex justify-between items-center text-sm mb-2">
            <span className="text-white/60">Remetente</span>
            <span className="text-white font-medium">
              {getBrandName()} Pagamentos
            </span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-white/60">Instituição</span>
            <span className="text-white font-medium">Banco Genérico S.A.</span>
          </div>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center gap-2 whitespace-nowrap min-h-9 px-4 py-2 w-full rounded-xl bg-white/5 border border-white/10 text-white text-sm font-medium pointer-events-none"
        >
          Ver comprovante
        </button>
      </div>

      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
        className="absolute -right-6 -bottom-6 bg-[#1a231d] border border-white/10 p-4 rounded-2xl shadow-xl flex items-center gap-3 backdrop-blur-md"
      >
        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
          <Check className="text-primary" />
        </div>
        <div>
          <p className="text-white font-medium text-sm">Aprovado!</p>
          <p className="text-white/60 text-xs">Em 2 minutos</p>
        </div>
      </motion.div>
    </motion.div>
  )
}
