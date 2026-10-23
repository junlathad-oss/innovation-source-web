import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { CategoryIcon } from '@/components/Icons'
import { getClient, getLocale, mediaUrl } from '@/lib/payload'

export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ slug: string }> }

async function getProduct(slug: string) {
  const locale = await getLocale()
  const payload = await getClient()
  const res = await payload.find({ collection: 'products', locale, where: { slug: { equals: slug } }, limit: 1, depth: 1 })
  return res.docs[0]
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProduct((await params).slug)
  return product ? { title: product.partNumber ? `${product.partNumber} · ${product.name}` : product.name, description: product.summary ?? undefined } : {}
}

export default async function ProductPage({ params }: Props) {
  const product = await getProduct((await params).slug)
  if (!product) notFound()
  const category = typeof product.category === 'object' ? product.category : null
  const brand = typeof product.brand === 'object' ? product.brand : null
  const img = mediaUrl(product.images?.[0], 'hero')
  const datasheet = mediaUrl(product.datasheet)

  return (
    <div className="container">
      <nav aria-label="Breadcrumb" style={{ paddingTop: 32, fontSize: 14 }}>
        <Link href="/products">สินค้า</Link>
        {category && <> / <Link href={`/products?category=${category.slug}`}>{category.title}</Link></>}
      </nav>
      <div className="product-detail">
        <div className="cat-card__media" style={{ borderRadius: 'var(--radius-lg)', aspectRatio: '1 / 1' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {img ? <img src={img} alt={product.name} /> : <CategoryIcon slug={category?.slug} />}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {brand && <div className="eyebrow">{brand.name}</div>}
          <h1 style={{ fontSize: 'clamp(32px, 4vw, 44px)' }}>{product.name}</h1>
          {product.partNumber && <div className="product-card__pn" style={{ fontSize: 16 }}>P/N {product.partNumber}</div>}
          {product.summary && <p style={{ margin: 0, color: 'var(--ink-2)' }}>{product.summary}</p>}
          {!!product.specs?.length && (
            <table className="specs">
              <tbody>
                {product.specs.map((s) => (
                  <tr key={s.id}><th scope="row">{s.label}</th><td>{s.value}</td></tr>
                ))}
              </tbody>
            </table>
          )}
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link className="btn btn--primary" href={`/contact?pn=${encodeURIComponent(product.partNumber || product.name)}`}>ขอใบเสนอราคา</Link>
            {datasheet && <a className="btn btn--ghost" href={datasheet} target="_blank" rel="noreferrer">ดาวน์โหลด Datasheet</a>}
          </div>
        </div>
      </div>
      {product.body && <div style={{ maxWidth: 760 }}><RichText data={product.body} /></div>}
    </div>
  )
}
