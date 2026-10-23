import { draftMode } from 'next/headers'
import { RenderBlocks } from '@/components/blocks/RenderBlocks'
import { getClient, getLocale } from '@/lib/payload'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const [locale, { isEnabled: draft }] = await Promise.all([getLocale(), draftMode()])
  const payload = await getClient()
  const home = await payload.findGlobal({ slug: 'home-page', locale, depth: 2, draft })
  return <RenderBlocks blocks={home.layout} locale={locale} />
}
