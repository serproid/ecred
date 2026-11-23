export const MONTHLY_RATE = 0.0081

export const formatBRL = (value: number) =>
  value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

export function calculateInstallment(
  amount: number,
  installments: number,
  rate = MONTHLY_RATE,
) {
  return (
    (amount * (rate * Math.pow(1 + rate, installments))) /
    (Math.pow(1 + rate, installments) - 1)
  )
}

export function firstInstallmentDate(day: number) {
  return `${String(day).padStart(2, '0')} de janeiro de 2027`
}
