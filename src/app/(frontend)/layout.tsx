import type { Metadata } from 'next'
import { Anuphan, IBM_Plex_Sans_Thai, Outfit } from 'next/font/google'
import type { ReactNode } from 'react'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { getClient, getLocale, mediaUrl } from '@/lib/payload'
import './globals.css'

const outfit = Outfit({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-outfit' })
const anuphan = Anuphan({ subsets: ['thai', 'latin'], weight: ['400', '500', '600', '700'], variable: '--font-anuphan' })
const plexThai = IBM_Plex_Sans_Thai({ subsets: ['thai', 'latin'], weight: ['400', '500', '600'], variable: '--font-plex-thai' })

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  const payload = await getClient()
  const site = await payload.findGlobal({ slug: 'site-settings', locale, depth: 1 })
  const image = mediaUrl(site.seo?.image, 'hero')
  return {
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_SERVER_URL ||
        (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : 'http://localhost:3000'),
    ),
    title: { default: site.seo?.title || 'Innovation Source Thailand', template: '%s · Innovation Source' },
    description: site.seo?.description || undefined,
    openGraph: image ? { images: [image] } : undefined,
  }
}

export default async function FrontendLayout({ children }: { children: ReactNode }) {
  const locale = await getLocale()
  return (
    <html lang={locale} className={`${outfit.variable} ${anuphan.variable} ${plexThai.variable}`}>
      <body>
        <a className="sr-only" href="#main">ข้ามไปยังเนื้อหา</a>
        <Header locale={locale} />
        <main id="main">{children}</main>
        <Footer locale={locale} />
      </body>
    </html>
  )
}
