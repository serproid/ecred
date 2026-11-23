import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

export function MobileCta() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 560)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div
      className={`sm:hidden fixed inset-x-0 bottom-0 z-40 px-4 pb-4 pt-3 bg-[#0b1410]/95 backdrop-blur-md border-t border-white/10 transition-transform duration-300 ${
        visible ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <Link
        to="/valor"
        className="btn-alive flex items-center justify-center w-full bg-primary text-[#0f1712] font-bold h-13 py-4 text-base rounded-full shadow-[0_0_30px_rgba(180,240,69,0.35)]"
      >
        Simular meu crédito
      </Link>
    </div>
  )
}
