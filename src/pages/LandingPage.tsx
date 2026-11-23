import { CtaBand } from '../components/CtaBand'
import { Faq } from '../components/Faq'
import { Footer } from '../components/Footer'
import { Hero } from '../components/Hero'
import { HowItWorks } from '../components/HowItWorks'
import { MobileCta } from '../components/MobileCta'
import { Stats } from '../components/Stats'
import { WhyEcred } from '../components/WhyEcred'

export function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-background text-foreground pb-20 sm:pb-0">
      <main className="flex-1">
        <Hero />
        <Stats />
        <WhyEcred />
        <HowItWorks />
        <CtaBand />
        <Faq />
      </main>
      <Footer />
      <MobileCta />
    </div>
  )
}
