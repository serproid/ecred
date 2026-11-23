import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import { LandingPage } from './pages/LandingPage'

const ValorPage = lazy(() =>
  import('./pages/ValorPage').then((module) => ({ default: module.ValorPage })),
)
const CpfPage = lazy(() =>
  import('./pages/CpfPage').then((module) => ({ default: module.CpfPage })),
)
const ConfirmacaoPage = lazy(() =>
  import('./pages/ConfirmacaoPage').then((module) => ({
    default: module.ConfirmacaoPage,
  })),
)
const DadosPage = lazy(() =>
  import('./pages/DadosPage').then((module) => ({ default: module.DadosPage })),
)
const RendaPage = lazy(() =>
  import('./pages/RendaPage').then((module) => ({ default: module.RendaPage })),
)
const AnalisePage = lazy(() =>
  import('./pages/AnalisePage').then((module) => ({
    default: module.AnalisePage,
  })),
)
const AprovacaoPage = lazy(() =>
  import('./pages/AprovacaoPage').then((module) => ({
    default: module.AprovacaoPage,
  })),
)
const DiaPage = lazy(() =>
  import('./pages/DiaPage').then((module) => ({ default: module.DiaPage })),
)
const EnderecoPage = lazy(() =>
  import('./pages/EnderecoPage').then((module) => ({
    default: module.EnderecoPage,
  })),
)
const ContaPage = lazy(() =>
  import('./pages/ContaPage').then((module) => ({ default: module.ContaPage })),
)
const AbrindoPage = lazy(() =>
  import('./pages/AbrindoPage').then((module) => ({
    default: module.AbrindoPage,
  })),
)
const DigitalPage = lazy(() =>
  import('./pages/DigitalPage').then((module) => ({
    default: module.DigitalPage,
  })),
)
const SeguroPage = lazy(() =>
  import('./pages/SeguroPage').then((module) => ({
    default: module.SeguroPage,
  })),
)
const CheckoutPage = lazy(() =>
  import('./pages/CheckoutPage').then((module) => ({
    default: module.CheckoutPage,
  })),
)
const PaymentPage = lazy(() =>
  import('./pages/PaymentPage').then((module) => ({
    default: module.PaymentPage,
  })),
)

function PageFallback() {
  return (
    <div className="min-h-dvh flex items-center justify-center bg-background">
      <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
    </div>
  )
}

export default function App() {
  return (
    <Suspense fallback={<PageFallback />}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/valor" element={<ValorPage />} />
        <Route path="/cpf" element={<CpfPage />} />
        <Route path="/confirmacao" element={<ConfirmacaoPage />} />
        <Route path="/dados" element={<DadosPage />} />
        <Route path="/renda" element={<RendaPage />} />
        <Route path="/analise" element={<AnalisePage />} />
        <Route path="/aprovacao" element={<AprovacaoPage />} />
        <Route path="/dia" element={<DiaPage />} />
        <Route path="/endereco" element={<EnderecoPage />} />
        <Route path="/conta" element={<ContaPage />} />
        <Route path="/abrir" element={<AbrindoPage />} />
        <Route path="/digital" element={<DigitalPage />} />
        <Route path="/seguro" element={<SeguroPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/pagamento" element={<PaymentPage />} />
        <Route path="*" element={<LandingPage />} />
      </Routes>
    </Suspense>
  )
}
