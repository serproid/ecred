export function createAccountNumber() {
  return `${Math.floor(10000 + Math.random() * 89999)}-${Math.floor(
    Math.random() * 9,
  )}`
}

export function getNextDueDate() {
  return new Date(Date.now() + 2592e6).toLocaleDateString('pt-BR')
}
