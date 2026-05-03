import { Hero } from '@/components/hero'
import { HowItWorks } from '@/components/how-it-works'
import { Demo } from '@/components/demo'
import { Commands } from '@/components/commands'
import { Config } from '@/components/config'
import { Footer } from '@/components/footer'

export default function Home() {
  return (
    <main className="bg-gradient-to-b from-neutral-950 via-black to-neutral-950">
      <Hero />
      <HowItWorks />
      <Demo />
      <Commands />
      <Config />
      <Footer />
    </main>
  )
}
