import { Link } from 'react-router-dom'
import { Logo } from './Logo'

export function Header() {
  return (
    <header className="w-full">
      <div className="container mx-auto px-4 py-6 flex items-center justify-center">
        <Link to="/" className="flex items-center">
          <Logo variant="dark" className="text-3xl" />
        </Link>
      </div>
    </header>
  )
}
