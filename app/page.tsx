import { AnimatedHero } from '@/components/animated-hero'
import { HowItWorks } from '@/components/how-it-works'
import { Demo } from '@/components/demo'
import { Commands } from '@/components/commands'
import { Config } from '@/components/config'
import { Footer } from '@/components/footer'

export default function Home() {
  return (
    <main className="bg-white dark:bg-gradient-to-b dark:from-neutral-950 dark:via-black dark:to-neutral-950">
      <AnimatedHero />
      <div id="how-it-works" className="bg-white dark:bg-neutral-950">
        <HowItWorks />
      </div>
      <div id="features" className="bg-neutral-50 dark:bg-black">
        <Demo />
      </div>
      <div className="bg-white dark:bg-neutral-950">
        <Commands />
      </div>
      <div className="bg-neutral-50 dark:bg-black">
        <Config />
      </div>
      <Footer />
    </main>
  )
}
