import type { Metadata } from 'next'
import { BrandCard } from '@/components/BrandCard'
import { getClient, getLocale } from '@/lib/payload'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'แบรนด์' }

export default async function BrandsPage() {
  const locale = await getLocale()
  const payload = await getClient()
  const brands = (await payload.find({ collection: 'brands', locale, sort: 'order', limit: 100, depth: 1 })).docs

  return (
    <div className="container">
      <section className="page-hero">
        <div className="eyebrow">Brands</div>
        <h1>{locale === 'th' ? 'แบรนด์และพันธมิตร' : 'Brands & partners'}</h1>
        <p>
          {locale === 'th'
            ? 'เลือกดูสินค้าตามแบรนด์ ทุกชิ้นนำเข้าตรงจากผู้ผลิตพร้อมเอกสารรับรอง'
            : 'Browse products by brand. Everything is sourced directly from the manufacturer, with certificates.'}
        </p>
      </section>
      <div className="brand-grid">
        {brands.map((b) => <BrandCard key={b.id} brand={b} locale={locale} showDescription />)}
      </div>
    </div>
  )
}
