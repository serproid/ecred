import { CircleAlert } from 'lucide-react'

export function FieldError({ message }: { message: string }) {
  if (!message) return null
  return (
    <p className="text-red-500 text-sm mt-1.5 flex items-center gap-1">
      <CircleAlert size={14} className="shrink-0" /> {message}
    </p>
  )
}
