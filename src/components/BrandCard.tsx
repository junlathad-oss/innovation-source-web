import Link from 'next/link'
import type { Brand } from '@/payload-types'
import { mediaUrl, type Locale } from '@/lib/payload'
import { ArrowRight } from './Icons'

const kindLabel: Record<Locale, Record<NonNullable<Brand['kind']>, string>> = {
  th: { authorized: 'ตัวแทนจำหน่าย', partner: 'พันธมิตร', group: 'บริษัทในเครือ' },
  en: { authorized: 'Authorized', partner: 'Partner', group: 'Group company' },
}

export function BrandCard({ brand, locale, showDescription = false }: { brand: Brand; locale: Locale; showDescription?: boolean }) {
  const logo = mediaUrl(brand.logo, 'thumb')
  const kind = brand.kind ?? 'partner'
  const categories = (brand.categories ?? []).filter((c) => typeof c === 'object')
  const sinceLabel = brand.since ? ` · ${brand.since}` : ''

  return (
    <Link href={`/products?brand=${brand.slug}`} className={`brand-card brand-card--${kind}`}>
      <div className="brand-card__top">
        <span className="brand-card__badge">{kindLabel[locale][kind]}{sinceLabel}</span>
        {brand.origin && <span className="brand-card__origin">{brand.origin}</span>}
      </div>
      <div className="brand-card__mark">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {logo ? <img src={logo} alt={brand.name} loading="lazy" /> : brand.name}
      </div>
      {brand.tagline && <p className="brand-card__tagline">{brand.tagline}</p>}
      {showDescription && brand.description && <p className="brand-card__desc">{brand.description}</p>}
      {!!categories.length && (
        <ul className="brand-card__cats" aria-label={locale === 'th' ? 'หมวดสินค้า' : 'Categories'}>
          {categories.map((c) => typeof c === 'object' && <li key={c.id}>{c.title}</li>)}
        </ul>
      )}
      <span className="brand-card__cta">{locale === 'th' ? 'ดูสินค้าแบรนด์นี้' : 'View products'}<ArrowRight /></span>
    </Link>
  )
}
