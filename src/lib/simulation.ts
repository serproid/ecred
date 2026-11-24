import { createContext, useContext } from 'react'

export type SimulationData = {
  leadId: string
  amount: number
  installments: number
  cpf: string
  cpfLocked: boolean
  cpfSituation: string
  cpfDeathYear: number | null
  cpfChecked: boolean
  name: string
  birthDate: string
  gender: string
  motherName: string
  phone: string
  purpose: string
  occupation: string
  negativado: string
  salary: string
  noIncome: boolean
  incomeDay: number
  approvedAmount: number
  paymentDay: number
  cep: string
  addressRevealed: boolean
  street: string
  number: string
  noNumber: boolean
  complement: string
  district: string
  city: string
  uf: string
  email: string
  password: string
  bank: string
  pixKey: string
  pixKeyType: string
  seguroPrice: number
  seguroExtra: number
  checkoutProductId: string
  checkoutNext: string
  checkoutTotal: number
  checkoutLoan: number
  checkoutBumpIds: string[]
}

export type SimulationContextValue = {
  data: SimulationData
  update: (patch: Partial<SimulationData>) => void
}

export const SimulationContext =
  createContext<SimulationContextValue | null>(null)

export function useSimulation() {
  const context = useContext(SimulationContext)
  if (!context) {
    throw new Error('useSimulation must be used within a SimulationProvider')
  }
  return context
}
