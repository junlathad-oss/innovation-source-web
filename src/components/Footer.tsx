import Link from 'next/link'
import { getClient, type Locale } from '@/lib/payload'

export async function Footer({ locale }: { locale: Locale }) {
  const payload = await getClient()
  const [footer, site] = await Promise.all([
    payload.findGlobal({ slug: 'footer', locale, depth: 0 }),
    payload.findGlobal({ slug: 'site-settings', locale, depth: 0 }),
  ])

  return (
    <footer className="site-footer" id="contact-info">
      <div className="container footer-grid">
        <div>
          <div className="brand" style={{ color: '#fff' }}>Innovation<span style={{ color: 'var(--mint)' }}>Source</span></div>
          <p style={{ lineHeight: 1.7, margin: '12px 0 0' }}>
            {site.companyName}
            {site.groupName && <><br />{site.groupName}</>}
          </p>
        </div>
        {footer.columns?.map((col) => (
          <div key={col.id}>
            <h4>{col.title}</h4>
            <ul>
              {col.links?.map((l) => (
                <li key={l.id}><Link href={l.href}>{l.label}</Link></li>
              ))}
            </ul>
          </div>
        ))}
        <div>
          <h4>{locale === 'th' ? 'ติดต่อ' : 'Contact'}</h4>
          <p style={{ margin: 0, lineHeight: 1.8, whiteSpace: 'pre-line' }}>{site.address}</p>
          {site.phone && <p style={{ margin: 0 }}><a href={`tel:${site.phone.replace(/[^+\d]/g, '')}`}>{site.phone}</a></p>}
          {site.email && <p style={{ margin: 0 }}><a href={`mailto:${site.email}`}>{site.email}</a></p>}
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} Innovation Source Thailand</span>
        <nav aria-label="Legal">
          {footer.legal?.map((l) => (
            <Link key={l.id} href={l.href}>{l.label}</Link>
          ))}
        </nav>
      </div>
    </footer>
  )
}
