import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { Navbar } from '@/components/navbar'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Mieru-bot 見える - Accessibility Reviews on Every Pull Request',
  description: 'Automated WCAG 2.1 accessibility reviews for GitHub pull requests. Make the invisible visible with Mieru-bot—catch color contrast, ARIA issues, alt text, and more.',
  generator: 'v0.app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="font-sans antialiased bg-neutral-950 dark:bg-neutral-950">
        <Navbar />
        <div className="pt-24">
          {children}
        </div>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
