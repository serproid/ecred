import { Route, Routes } from 'react-router-dom'
import { ComingSoonPage } from './pages/ComingSoonPage'
import { ConfirmacaoPage } from './pages/ConfirmacaoPage'
import { CpfPage } from './pages/CpfPage'
import { LandingPage } from './pages/LandingPage'
import { ValorPage } from './pages/ValorPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/valor" element={<ValorPage />} />
      <Route path="/cpf" element={<CpfPage />} />
      <Route path="/confirmacao" element={<ConfirmacaoPage />} />
      <Route
        path="/dados"
        element={
          <ComingSoonPage
            eyebrow="Passo 4"
            title="Sobre o seu empréstimo"
            subtitle="Essas respostas nos ajudam a montar a melhor oferta para o seu perfil."
            progress={32}
            backTo="/confirmacao"
          />
        }
      />
      <Route path="*" element={<LandingPage />} />
    </Routes>
  )
}
