export const onlyDigits = (value: string) => value.replace(/\D/g, '')

export function formatCpf(value: string) {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})/, '$1-$2')
    .replace(/(-\d{2})\d+?$/, '$1')
}

export function formatDate(value: string) {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{2})(\d)/, '$1/$2')
    .replace(/(\d{2})(\d)/, '$1/$2')
    .replace(/(\/\d{4})\d+?$/, '$1')
}

export function formatPhone(value: string) {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2')
    .replace(/(-\d{4})\d+?$/, '$1')
}

export function isValidCpf(value: string) {
  const digits = onlyDigits(value)
  if (digits.length !== 11 || /^(\d)\1{10}$/.test(digits)) return false

  const checkDigit = (length: number) => {
    let sum = 0
    let weight = length + 1
    for (let index = 0; index < length; index += 1) {
      sum += Number(digits[index]) * weight
      weight -= 1
    }
    const rest = (sum * 10) % 11
    return rest === 10 ? 0 : rest
  }

  return (
    checkDigit(9) === Number(digits[9]) &&
    checkDigit(10) === Number(digits[10])
  )
}
