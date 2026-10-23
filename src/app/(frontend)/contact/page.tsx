import type { Metadata } from 'next'
import { FullInquiry } from '@/components/InquiryForm'
import { getClient, getLocale } from '@/lib/payload'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'ติดต่อเรา' }

export default async function ContactPage({ searchParams }: { searchParams: Promise<{ pn?: string }> }) {
  const { pn } = await searchParams
  const locale = await getLocale()
  const payload = await getClient()
  const site = await payload.findGlobal({ slug: 'site-settings', locale, depth: 0 })

  return (
    <div className="container">
      <section className="page-hero">
        <div className="eyebrow">Contact</div>
        <h1>ขอใบเสนอราคา</h1>
        <p>ส่ง Part Number หรือ BOM มาได้เลย ทีมขายจะตอบกลับพร้อมราคาภายใน 1 วันทำการ</p>
      </section>
      <div className="product-detail" style={{ paddingTop: 0 }}>
        <FullInquiry defaultMessage={pn ? `${pn} จำนวน: ` : undefined} />
        <aside style={{ background: 'var(--surface)', borderRadius: 'var(--radius-lg)', padding: 40, display: 'grid', gap: 20, alignContent: 'start' }}>
          <div>
            <h2 style={{ fontSize: 22 }}>{site.companyName}</h2>
            {site.groupName && <p style={{ margin: '4px 0 0', color: 'var(--muted)' }}>{site.groupName}</p>}
          </div>
          {site.address && <p style={{ margin: 0, whiteSpace: 'pre-line' }}>{site.address}</p>}
          {site.phone && <p style={{ margin: 0 }}>โทร <a href={`tel:${site.phone.replace(/[^+\d]/g, '')}`}>{site.phone}</a></p>}
          {site.email && <p style={{ margin: 0 }}>อีเมล <a href={`mailto:${site.email}`}>{site.email}</a></p>}
          {site.lineId && <p style={{ margin: 0 }}>LINE {site.lineId}</p>}
          {site.mapUrl && <a className="btn btn--ghost" href={site.mapUrl} target="_blank" rel="noreferrer" style={{ justifySelf: 'start' }}>เปิดแผนที่</a>}
        </aside>
      </div>
    </div>
  )
}
