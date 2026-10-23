import type { Metadata } from 'next'
import Link from 'next/link'
import type { Where } from 'payload'
import { CategoryIcon } from '@/components/Icons'
import { getClient, getLocale, mediaUrl } from '@/lib/payload'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'สินค้า' }

type Props = { searchParams: Promise<{ category?: string; brand?: string; q?: string }> }

export default async function ProductsPage({ searchParams }: Props) {
  const { category, brand, q } = await searchParams
  const locale = await getLocale()
  const payload = await getClient()
  const categories = (await payload.find({ collection: 'categories', locale, sort: 'order', limit: 50, depth: 0 })).docs
  const brands = (await payload.find({ collection: 'brands', locale, sort: 'order', limit: 50, depth: 0 })).docs
  const active = categories.find((c) => c.slug === category)
  const activeBrand = brands.find((b) => b.slug === brand)
  const href = (next: { category?: string; brand?: string }) => {
    const params = new URLSearchParams()
    if (next.category) params.set('category', next.category)
    if (next.brand) params.set('brand', next.brand)
    const qs = params.toString()
    return qs ? `/products?${qs}` : '/products'
  }

  const where: Where = {}
  if (active) where.category = { equals: active.id }
  if (activeBrand) where.brand = { equals: activeBrand.id }
  if (q) where.or = [{ partNumber: { like: q } }, { name: { like: q } }]
  const products = (await payload.find({ collection: 'products', locale, where, limit: 60, depth: 1 })).docs

  return (
    <div className="container">
      <section className="page-hero">
        <div className="eyebrow">Products</div>
        <h1>{[activeBrand?.name, active?.title].filter(Boolean).join(' · ') || (q ? `ผลการค้นหา “${q}”` : 'สินค้าทั้งหมด')}</h1>
        <p>{activeBrand?.description || active?.description || 'ชิ้นส่วนอิเล็กทรอนิกส์และอุปกรณ์ไฟฟ้าแท้จากผู้ผลิต หากไม่พบ Part Number ที่ต้องการ ส่งรายการมาให้ทีมขายจัดหาได้'}</p>
      </section>
      <nav className="filters" aria-label="หมวดสินค้า" style={{ marginBottom: 12 }}>
        <span className="filters__label">หมวด</span>
        <Link className="chip" href={href({ brand: activeBrand?.slug ?? undefined })} aria-current={!active ? 'page' : undefined}>ทั้งหมด</Link>
        {categories.map((c) => (
          <Link key={c.id} className="chip" href={href({ category: c.slug ?? undefined, brand: activeBrand?.slug ?? undefined })} aria-current={active?.id === c.id ? 'page' : undefined}>
            {c.title}
          </Link>
        ))}
      </nav>
      <nav className="filters" aria-label="แบรนด์">
        <span className="filters__label">แบรนด์</span>
        <Link className="chip" href={href({ category: active?.slug ?? undefined })} aria-current={!activeBrand ? 'page' : undefined}>ทั้งหมด</Link>
        {brands.map((b) => (
          <Link key={b.id} className="chip" href={href({ category: active?.slug ?? undefined, brand: b.slug ?? undefined })} aria-current={activeBrand?.id === b.id ? 'page' : undefined}>
            {b.name}
          </Link>
        ))}
      </nav>
      {products.length ? (
        <div className="product-grid">
          {products.map((p) => {
            const img = mediaUrl(p.images?.[0], 'card')
            const cat = typeof p.category === 'object' ? p.category : null
            return (
              <Link key={p.id} className="product-card" href={`/products/${p.slug}`}>
                <div className="cat-card__media">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {img ? <img src={img} alt="" loading="lazy" /> : <CategoryIcon slug={cat?.slug} />}
                </div>
                {p.partNumber && <span className="product-card__pn">{p.partNumber}</span>}
                <strong>{p.name}</strong>
                {p.summary && <span style={{ color: 'var(--muted)', fontSize: 14 }}>{p.summary}</span>}
              </Link>
            )
          })}
        </div>
      ) : (
        <div className="empty">
          <p style={{ margin: '0 0 16px' }}>ยังไม่มีรายการในหมวดนี้บนเว็บไซต์ แต่ทีมขายจัดหาให้ได้</p>
          <Link className="btn btn--primary" href="/contact">ส่งรายการให้ทีมขาย</Link>
        </div>
      )}
    </div>
  )
}
