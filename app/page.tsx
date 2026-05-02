import { Hero } from '@/components/hero'
import { HowItWorks } from '@/components/how-it-works'
import { Demo } from '@/components/demo'
import { Footer } from '@/components/footer'

export default function Home() {
  return (
    <main className="bg-gradient-to-b from-neutral-950 via-black to-neutral-950">
      <Hero />
      <HowItWorks />
      <Demo />
      <Footer />
    </main>
  )
}
