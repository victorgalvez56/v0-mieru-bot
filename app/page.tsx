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
        <div className="mx-auto max-w-full">
          <HowItWorks />
        </div>
      </div>
      
      <div id="features" className="bg-neutral-50 dark:bg-black">
        <div className="mx-auto max-w-full">
          <Demo />
        </div>
      </div>
      
      <div className="bg-white dark:bg-neutral-950">
        <div className="mx-auto max-w-full">
          <Commands />
        </div>
      </div>
      
      <div className="bg-neutral-50 dark:bg-black">
        <div className="mx-auto max-w-full">
          <Config />
        </div>
      </div>
      
      <Footer />
    </main>
  )
}
