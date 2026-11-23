import type { ReactNode } from 'react'

type OptionCardProps = {
  selected: boolean
  onClick: () => void
  children: ReactNode
}

export function OptionCard({ selected, onClick, children }: OptionCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left px-5 py-4 rounded-2xl border-2 font-medium transition-all duration-200 flex items-center justify-between gap-3 ${
        selected
          ? 'border-primary bg-primary/10 text-foreground shadow-[0_0_0_4px_rgba(180,240,69,0.12)]'
          : 'border-border bg-card text-foreground hover:border-[#2e5535]/40 hover:bg-muted/40'
      }`}
    >
      {children}
      <span
        className={`shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
          selected
            ? 'border-primary bg-primary'
            : 'border-border bg-transparent'
        }`}
      >
        {selected ? (
          <span className="w-2 h-2 rounded-full bg-[#0f1712]" />
        ) : null}
      </span>
    </button>
  )
}
