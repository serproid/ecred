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
  salary: '',
  noIncome: false,
  incomeDay: 0,
  approvedAmount: 0,
  paymentDay: 0,
  cep: '',
  addressRevealed: false,
  street: '',
  number: '',
  noNumber: false,
  complement: '',
  district: '',
  city: '',
  uf: '',
  email: '',
  password: '',
  bank: '',
  pixKey: '',
  pixKeyType: '',
  seguroPrice: 0,
  seguroExtra: 0,
  checkoutProductId: '',
  checkoutNext: '',
  checkoutTotal: 0,
  checkoutLoan: 0,
  checkoutBumpIds: [],
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
