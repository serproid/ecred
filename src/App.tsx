import { Route, Routes } from 'react-router-dom'
import { AnalisePage } from './pages/AnalisePage'
import { ComingSoonPage } from './pages/ComingSoonPage'
import { ConfirmacaoPage } from './pages/ConfirmacaoPage'
import { CpfPage } from './pages/CpfPage'
import { DadosPage } from './pages/DadosPage'
import { LandingPage } from './pages/LandingPage'
import { RendaPage } from './pages/RendaPage'
import { ValorPage } from './pages/ValorPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/valor" element={<ValorPage />} />
      <Route path="/cpf" element={<CpfPage />} />
      <Route path="/confirmacao" element={<ConfirmacaoPage />} />
      <Route path="/dados" element={<DadosPage />} />
      <Route path="/renda" element={<RendaPage />} />
      <Route path="/analise" element={<AnalisePage />} />
      <Route
        path="/push"
        element={
          <ComingSoonPage
            eyebrow="Passo 6"
            title="Ative as notificações"
            subtitle="Receba o resultado da sua análise em tempo real."
            progress={60}
            backTo="/renda"
          />
        }
      />
      <Route path="*" element={<LandingPage />} />
    </Routes>
  )
}
