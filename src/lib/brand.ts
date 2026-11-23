const STORAGE_KEY = 'ecred:brand'
const DEFAULT_BRAND = 'ecred'

export function getBrandSlug() {
  if (typeof window === 'undefined') return DEFAULT_BRAND

  try {
    const fromStorage = window.localStorage.getItem(STORAGE_KEY)
    if (fromStorage) return fromStorage
  } catch {
    void 0
  }

  try {
    const fromQuery = new URLSearchParams(window.location.search)
      .get('brand')
      ?.trim()
    if (fromQuery) return fromQuery
  } catch {
    void 0
  }

  return DEFAULT_BRAND
}

export function getBrandLower() {
  return getBrandSlug().toLowerCase()
}

export function getBrandName() {
  const brand = getBrandSlug()
  return brand.charAt(0).toUpperCase() + brand.slice(1).toLowerCase()
}
