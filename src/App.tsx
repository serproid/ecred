import './App.css'
import { CtaBand } from './components/CtaBand'
import { Faq } from './components/Faq'
import { Footer } from './components/Footer'
import { Hero } from './components/Hero'
import { HowItWorks } from './components/HowItWorks'
import { Stats } from './components/Stats'
import { WhyEcred } from './components/WhyEcred'

export default function App() {
  return (
    <>
      <Hero />
      <main>
        <Stats />
        <WhyEcred />
        <HowItWorks />
        <CtaBand />
        <Faq />
      </main>
      <Footer />
    </>
  )
}
