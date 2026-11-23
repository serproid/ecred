import { Route, Routes } from 'react-router-dom'
import { AbrindoPage } from './pages/AbrindoPage'
import { AnalisePage } from './pages/AnalisePage'
import { AprovacaoPage } from './pages/AprovacaoPage'
import { ComingSoonPage } from './pages/ComingSoonPage'
import { ConfirmacaoPage } from './pages/ConfirmacaoPage'
import { ContaPage } from './pages/ContaPage'
import { CpfPage } from './pages/CpfPage'
import { DadosPage } from './pages/DadosPage'
import { DiaPage } from './pages/DiaPage'
import { DigitalPage } from './pages/DigitalPage'
import { EnderecoPage } from './pages/EnderecoPage'
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
      <Route path="/aprovacao" element={<AprovacaoPage />} />
      <Route path="/dia" element={<DiaPage />} />
      <Route path="/endereco" element={<EnderecoPage />} />
      <Route path="/conta" element={<ContaPage />} />
      <Route path="/abrir" element={<AbrindoPage />} />
      <Route path="/digital" element={<DigitalPage />} />
      <Route
        path="/seguro"
        element={
          <ComingSoonPage
            eyebrow="Proteção"
            title="Seguro"
            subtitle="Proteja o seu empréstimo."
            progress={100}
            backTo="/digital"
          />
        }
      />
      <Route path="*" element={<LandingPage />} />
    </Routes>
  )
}
