import { Route, Routes } from 'react-router-dom'
import { ComingSoonPage } from './pages/ComingSoonPage'
import { ConfirmacaoPage } from './pages/ConfirmacaoPage'
import { CpfPage } from './pages/CpfPage'
import { DadosPage } from './pages/DadosPage'
import { LandingPage } from './pages/LandingPage'
import { ValorPage } from './pages/ValorPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/valor" element={<ValorPage />} />
      <Route path="/cpf" element={<CpfPage />} />
      <Route path="/confirmacao" element={<ConfirmacaoPage />} />
      <Route path="/dados" element={<DadosPage />} />
      <Route
        path="/renda"
        element={
          <ComingSoonPage
            eyebrow="Passo 5"
            title="Qual a sua renda?"
            subtitle="Isso nos ajuda a ajustar as parcelas ao seu orçamento."
            progress={40}
            backTo="/dados"
          />
        }
      />
      <Route path="*" element={<LandingPage />} />
    </Routes>
  )
}
