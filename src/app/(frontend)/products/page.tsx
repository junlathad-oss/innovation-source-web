import type { Metadata } from 'next'
import Link from 'next/link'
import type { Where } from 'payload'
import { CategoryIcon } from '@/components/Icons'
import { getClient, getLocale, mediaUrl } from '@/lib/payload'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'สินค้า' }

type Props = { searchParams: Promise<{ category?: string; q?: string }> }

export default async function ProductsPage({ searchParams }: Props) {
  const { category, q } = await searchParams
  const locale = await getLocale()
  const payload = await getClient()
  const categories = (await payload.find({ collection: 'categories', locale, sort: 'order', limit: 50, depth: 0 })).docs
  const active = categories.find((c) => c.slug === category)

  const where: Where = {}
  if (active) where.category = { equals: active.id }
  if (q) where.or = [{ partNumber: { like: q } }, { name: { like: q } }]
  const products = (await payload.find({ collection: 'products', locale, where, limit: 60, depth: 1 })).docs

  return (
    <div className="container">
      <section className="page-hero">
        <div className="eyebrow">Products</div>
        <h1>{active ? active.title : q ? `ผลการค้นหา “${q}”` : 'สินค้าทั้งหมด'}</h1>
        <p>{active?.description || 'ชิ้นส่วนอิเล็กทรอนิกส์และอุปกรณ์ไฟฟ้าแท้จากผู้ผลิต หากไม่พบ Part Number ที่ต้องการ ส่งรายการมาให้ทีมขายจัดหาได้'}</p>
      </section>
      <nav className="filters" aria-label="หมวดสินค้า">
        <Link className="chip" href="/products" aria-current={!active ? 'page' : undefined}>ทั้งหมด</Link>
        {categories.map((c) => (
          <Link key={c.id} className="chip" href={`/products?category=${c.slug}`} aria-current={active?.id === c.id ? 'page' : undefined}>
            {c.title}
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
