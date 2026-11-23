import { Check, ChevronDown, Search } from 'lucide-react'
import { useMemo, useRef, useState } from 'react'
import { BANKS } from '../lib/banks'

const normalize = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()

type BankComboboxProps = {
  value: string
  onChange: (value: string) => void
  error?: boolean
}

export function BankCombobox({
  value,
  onChange,
  error = false,
}: BankComboboxProps) {
  const [query, setQuery] = useState(value)
  const [open, setOpen] = useState(false)
  const [highlighted, setHighlighted] = useState(0)
  const blurTimer = useRef<number | null>(null)

  const filtered = useMemo(() => {
    const term = normalize(query)
    if (!term) return BANKS.slice(0, 40)
    return BANKS.filter((bank) => normalize(bank).includes(term))
      .sort((a, b) => {
        const aStarts = normalize(a).startsWith(term) ? 0 : 1
        const bStarts = normalize(b).startsWith(term) ? 0 : 1
        return aStarts - bStarts
      })
      .slice(0, 40)
  }, [query])

  const hasSelection =
    normalize(value).length > 0 &&
    BANKS.some((bank) => normalize(bank) === normalize(value))

  const select = (bank: string) => {
    setQuery(bank)
    onChange(bank)
    setOpen(false)
  }

  const handleChange = (text: string) => {
    setQuery(text)
    setOpen(true)
    setHighlighted(0)
    const exact = BANKS.find((bank) => normalize(bank) === normalize(text))
    onChange(exact ?? '')
  }

  return (
    <div className="relative">
      <div className="relative">
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none"
        />
        <input
          type="text"
          value={query}
          onChange={(event) => handleChange(event.target.value)}
          onFocus={() => setOpen(true)}
          onBlur={() => {
            blurTimer.current = window.setTimeout(() => setOpen(false), 120)
          }}
          onKeyDown={(event) => {
            if (event.key === 'ArrowDown') {
              event.preventDefault()
              setOpen(true)
              setHighlighted((current) =>
                Math.min(current + 1, filtered.length - 1),
              )
            } else if (event.key === 'ArrowUp') {
              event.preventDefault()
              setHighlighted((current) => Math.max(current - 1, 0))
            } else if (event.key === 'Enter') {
              if (open && filtered[highlighted]) {
                event.preventDefault()
                select(filtered[highlighted])
              }
            } else if (event.key === 'Escape') {
              setOpen(false)
            }
          }}
          placeholder="Digite o nome do banco"
          autoComplete="off"
          role="combobox"
          aria-expanded={open}
          aria-autocomplete="list"
          aria-invalid={error || undefined}
          className={`w-full h-14 rounded-xl bg-white/5 border-2 pl-11 pr-11 text-white placeholder:text-white/30 outline-none transition-colors ${
            error ? 'border-red-500/70' : 'border-white/10 focus:border-primary'
          }`}
        />
        {hasSelection ? (
          <Check
            size={18}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-primary pointer-events-none"
          />
        ) : (
          <ChevronDown
            size={18}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none"
          />
        )}
      </div>

      {open ? (
        <div className="absolute z-20 left-0 right-0 mt-2 rounded-xl bg-[#16211a] border border-white/10 shadow-2xl overflow-hidden">
          {filtered.length > 0 ? (
            <ul className="max-h-56 overflow-y-auto py-1">
              {filtered.map((bank, index) => {
                const selected = normalize(bank) === normalize(value)
                return (
                  <li key={bank}>
                    <button
                      type="button"
                      onMouseDown={(event) => event.preventDefault()}
                      onMouseEnter={() => setHighlighted(index)}
                      onClick={() => select(bank)}
                      className={`w-full flex items-center gap-2 px-4 py-2.5 text-left text-sm transition-colors ${
                        index === highlighted ? 'bg-white/10' : ''
                      } ${selected ? 'text-primary' : 'text-white/85'}`}
                    >
                      {selected ? (
                        <Check size={15} className="shrink-0" />
                      ) : null}
                      <span className="flex-1">{bank}</span>
                    </button>
                  </li>
                )
              })}
            </ul>
          ) : (
            <p className="px-4 py-4 text-sm text-white/50 text-center">
              Nenhum banco encontrado
            </p>
          )}
        </div>
      ) : null}
    </div>
  )
}
