import { createContext, useContext } from 'react'

export type SimulationData = {
  amount: number
  installments: number
  cpf: string
  cpfLocked: boolean
  name: string
  birthDate: string
  gender: string
  motherName: string
  phone: string
  purpose: string
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
