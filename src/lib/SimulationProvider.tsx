import { useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { SimulationContext } from './simulation'
import type { SimulationContextValue, SimulationData } from './simulation'

const initialState: SimulationData = {
  amount: 10000,
  installments: 12,
  cpf: '',
  cpfLocked: false,
  name: '',
  birthDate: '',
  gender: '',
  motherName: '',
  phone: '',
  purpose: '',
  occupation: '',
  negativado: '',
}

export function SimulationProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<SimulationData>(initialState)

  const value = useMemo<SimulationContextValue>(
    () => ({
      data,
      update: (patch) => setData((prev) => ({ ...prev, ...patch })),
    }),
    [data],
  )

  return (
    <SimulationContext.Provider value={value}>
      {children}
    </SimulationContext.Provider>
  )
}
