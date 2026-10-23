import { cookies } from 'next/headers'
import { getPayload } from 'payload'
import config from '@payload-config'
import type { Media } from '@/payload-types'

export type Locale = 'th' | 'en'

export const getClient = () => getPayload({ config })

export async function getLocale(): Promise<Locale> {
  const store = await cookies()
  return store.get('lang')?.value === 'en' ? 'en' : 'th'
}

export function mediaUrl(media: number | Media | null | undefined, size?: 'thumb' | 'card' | 'hero') {
  if (!media || typeof media === 'number') return null
  const sized = size ? media.sizes?.[size]?.url : null
  return sized || media.url || null
}

export function isMedia(media: number | Media | null | undefined): media is Media {
  return Boolean(media) && typeof media === 'object'
}
