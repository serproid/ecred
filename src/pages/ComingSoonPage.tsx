import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Logo } from '../components/Logo'
import { ProgressBar } from '../components/ProgressBar'

type ComingSoonPageProps = {
  eyebrow?: string
  title?: string
  subtitle?: string
  progress?: number
  backTo?: string
}

export function ComingSoonPage({
  eyebrow = 'Passo 3',
  title = 'Confirmação',
  subtitle = 'Esta etapa será adicionada em seguida.',
  progress = 25,
  backTo = '/cpf',
}: ComingSoonPageProps) {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="py-5 px-4 md:px-8 z-10 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="max-w-2xl mx-auto w-full flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <Logo variant="light" className="text-3xl" />
          </Link>
          <Link
            to={backTo}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft size={16} />
            Voltar
          </Link>
        </div>
        <div className="max-w-2xl mx-auto w-full mt-4">
          <ProgressBar value={progress} />
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-start p-4 md:p-8 pt-8 md:pt-12 w-full max-w-2xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.25 }}
          className="w-full"
        >
          <div className="text-center mb-8">
            <p className="text-xs font-bold text-[#2e5535] uppercase tracking-[0.15em] mb-3">
              {eyebrow}
            </p>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-3">
              {title}
            </h1>
            <p className="text-muted-foreground max-w-md mx-auto">{subtitle}</p>
          </div>

          <div className="bg-card border border-border rounded-3xl p-6 md:p-10 shadow-xl mb-6 text-center">
            <p className="text-muted-foreground">
              Esta etapa será adicionada em seguida.
            </p>
          </div>

          <Link
            to={backTo}
            className="w-full inline-flex items-center justify-center gap-2 bg-primary text-[#0f1712] font-bold h-16 text-lg md:text-xl rounded-full transition-all hover:bg-primary/90 hover:scale-[1.02] shadow-[0_0_30px_rgba(180,240,69,0.25)]"
          >
            Voltar
          </Link>
        </motion.div>
      </main>

      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-primary/5 blur-[120px] rounded-full" />
      </div>
    </div>
  )
}
