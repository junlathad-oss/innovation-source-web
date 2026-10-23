import Link from 'next/link'
import { setLanguage } from '@/app/(frontend)/actions'
import { getClient, type Locale } from '@/lib/payload'
import { Logo, SearchIcon } from './Icons'

export async function Header({ locale }: { locale: Locale }) {
  const payload = await getClient()
  const header = await payload.findGlobal({ slug: 'header', locale, depth: 0 })
  const other = locale === 'th' ? 'en' : 'th'

  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <Link href="/" className="brand" aria-label="Innovation Source หน้าแรก">
          <Logo />
          <div>Innovation<span>Source</span></div>
        </Link>
        <nav className="nav" aria-label="Main">
          {header.nav?.map((item) => (
            <Link key={item.id} href={item.href}>{item.label}</Link>
          ))}
        </nav>
        <div className="header-actions">
          <form action="/products" className="search" role="search">
            <SearchIcon />
            <label className="sr-only" htmlFor="q">ค้นหา Part Number</label>
            <input id="q" name="q" type="search" placeholder="ค้นหา Part Number…" />
          </form>
          <form action={setLanguage}>
            <input type="hidden" name="lang" value={other} />
            <button className="lang-toggle" type="submit" aria-label={other === 'en' ? 'Switch to English' : 'เปลี่ยนเป็นภาษาไทย'}>
              {other.toUpperCase()}
            </button>
          </form>
          {header.cta?.href && (
            <Link className="btn btn--primary btn--sm" href={header.cta.href}>{header.cta.label}</Link>
          )}
        </div>
      </div>
    </header>
  )
}
