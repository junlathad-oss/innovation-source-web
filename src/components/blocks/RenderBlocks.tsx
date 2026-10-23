import Link from 'next/link'
import type { HomePage } from '@/payload-types'
import { getClient, isMedia, mediaUrl, type Locale } from '@/lib/payload'
import { ArrowRight, CategoryIcon, HeroIllustration, TrustIcon } from '../Icons'
import { QuickInquiry } from '../InquiryForm'
import { Reveal } from '../Reveal'

type Block = NonNullable<HomePage['layout']>[number]
type BlockOf<T extends Block['blockType']> = Extract<Block, { blockType: T }>

function Hero({ block }: { block: BlockOf<'hero'> }) {
  const image = mediaUrl(block.image, 'hero')
  const video = mediaUrl(block.video)
  return (
    <section className="container hero" id="top">
      <div className="hero__card">
        <div className="hero__copy">
          {block.badge && <span className="badge">{block.badge}</span>}
          <h1>
            {block.title}
            {block.highlight && <em>{block.highlight}</em>}
          </h1>
          {block.subtitle && <p>{block.subtitle}</p>}
          <div className="hero__ctas">
            {block.primaryCta?.href && (
              <Link className="btn btn--primary" href={block.primaryCta.href}>{block.primaryCta.label}<ArrowRight /></Link>
            )}
            {block.secondaryCta?.href && (
              <Link className="btn btn--ghost" href={block.secondaryCta.href}>{block.secondaryCta.label}</Link>
            )}
          </div>
          {!!block.trust?.length && (
            <div className="hero__trust">
              {block.trust.map((t) => (
                <div key={t.id}><TrustIcon name={t.icon} />{t.text}</div>
              ))}
            </div>
          )}
        </div>
        <div className="hero__media">
          {video ? (
            <video autoPlay muted loop playsInline poster={image ?? undefined} aria-hidden="true">
              <source src={video} type={isMedia(block.video) ? block.video.mimeType ?? 'video/mp4' : 'video/mp4'} />
            </video>
          ) : image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={image} alt={isMedia(block.image) ? block.image.alt ?? '' : ''} fetchPriority="high" />
          ) : (
            <HeroIllustration />
          )}
        </div>
      </div>
    </section>
  )
}

function Stats({ block }: { block: BlockOf<'stats'> }) {
  return (
    <section className="container">
      <Reveal className="stats">
        {block.items?.map((s) => (
          <div key={s.id}><strong>{s.value}</strong><span>{s.label}</span></div>
        ))}
      </Reveal>
    </section>
  )
}

async function CategoryGrid({ block, locale }: { block: BlockOf<'categoryGrid'>; locale: Locale }) {
  let categories = (block.categories ?? []).filter((c) => typeof c === 'object')
  if (!categories.length) {
    const payload = await getClient()
    categories = (await payload.find({ collection: 'categories', locale, sort: 'order', limit: 24, depth: 1 })).docs
  }
  return (
    <section className="container section" id="products">
      <div className="section-head">
        <div>
          {block.eyebrow && <div className="eyebrow">{block.eyebrow}</div>}
          {block.heading && <h2>{block.heading}</h2>}
        </div>
        <Link href="/products" style={{ fontWeight: 600 }}>{locale === 'th' ? 'ดูทุกหมวด →' : 'All categories →'}</Link>
      </div>
      <Reveal className="cat-grid">
        {categories.map((c) => {
          if (typeof c !== 'object') return null
          const img = mediaUrl(c.image, 'card')
          return (
            <Link key={c.id} className="cat-card" href={`/products?category=${c.slug}`}>
              <div className="cat-card__media">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {img ? <img src={img} alt="" loading="lazy" /> : <CategoryIcon slug={c.slug} />}
              </div>
              <div>
                <div className="cat-card__title">{c.title}</div>
                {c.subtitle && <div className="cat-card__sub">{c.subtitle}</div>}
              </div>
            </Link>
          )
        })}
      </Reveal>
    </section>
  )
}

function Solutions({ block }: { block: BlockOf<'solutions'> }) {
  return (
    <section className="container section" id="solutions">
      <Reveal className="solutions">
        {block.items?.map((s) => (
          <div key={s.id} className={`solution${s.dark ? ' solution--dark' : ''}`}>
            {s.eyebrow && <span className="solution__eyebrow">{s.eyebrow}</span>}
            <h3>{s.title}</h3>
            {s.body && <p>{s.body}</p>}
            {s.link?.href && <Link href={s.link.href}>{s.link.label} →</Link>}
          </div>
        ))}
      </Reveal>
    </section>
  )
}

function Industries({ block }: { block: BlockOf<'industries'> }) {
  return (
    <section className="container section" id="industries">
      {block.eyebrow && <div className="eyebrow">{block.eyebrow}</div>}
      {block.heading && <h2 style={{ margin: '12px 0 36px', fontSize: 'clamp(30px, 4vw, 40px)' }}>{block.heading}</h2>}
      <Reveal className="industries">
        {block.items?.map((it, i) => (
          <div key={it.id}>
            <small>{String(i + 1).padStart(2, '0')}</small>
            <h3>{it.title}</h3>
            {it.body && <p>{it.body}</p>}
          </div>
        ))}
      </Reveal>
    </section>
  )
}

function Timeline({ block }: { block: BlockOf<'timeline'> }) {
  return (
    <section className="container section" id="about">
      <Reveal className="story">
        <div className="story__intro">
          {block.eyebrow && <div className="eyebrow">{block.eyebrow}</div>}
          {block.heading && <h2>{block.heading}</h2>}
          {block.body && <p>{block.body}</p>}
        </div>
        <ol className="timeline">
          {block.items?.map((it) => (
            <li key={it.id}><strong>{it.year}</strong><span>{it.text}</span></li>
          ))}
        </ol>
      </Reveal>
    </section>
  )
}

async function LogoWall({ block, locale }: { block: BlockOf<'logoWall'>; locale: Locale }) {
  let brands = (block.brands ?? []).filter((b) => typeof b === 'object')
  if (!brands.length) {
    const payload = await getClient()
    brands = (await payload.find({ collection: 'brands', locale, sort: 'order', limit: 24, depth: 1 })).docs
  }
  return (
    <section className="container section">
      {block.heading && <div className="logos__title">{block.heading}</div>}
      <div className="logos">
        {brands.map((b) => {
          if (typeof b !== 'object') return null
          const logo = mediaUrl(b.logo, 'thumb')
          // eslint-disable-next-line @next/next/no-img-element
          return logo ? <img key={b.id} src={logo} alt={b.name} loading="lazy" /> : <span key={b.id}>{b.name}</span>
        })}
      </div>
    </section>
  )
}

function CallToAction({ block }: { block: BlockOf<'cta'> }) {
  return (
    <section className="container section" id="contact">
      <Reveal className="cta">
        <div className="cta__copy">
          <h2>{block.heading}</h2>
          {block.body && <p>{block.body}</p>}
        </div>
        <QuickInquiry buttonLabel={block.buttonLabel || 'ขอใบเสนอราคา'} />
      </Reveal>
    </section>
  )
}

export function RenderBlocks({ blocks, locale }: { blocks: HomePage['layout']; locale: Locale }) {
  return (
    <>
      {blocks?.map((block) => {
        switch (block.blockType) {
          case 'hero': return <Hero key={block.id} block={block} />
          case 'stats': return <Stats key={block.id} block={block} />
          case 'categoryGrid': return <CategoryGrid key={block.id} block={block} locale={locale} />
          case 'solutions': return <Solutions key={block.id} block={block} />
          case 'industries': return <Industries key={block.id} block={block} />
          case 'timeline': return <Timeline key={block.id} block={block} />
          case 'logoWall': return <LogoWall key={block.id} block={block} locale={locale} />
          case 'cta': return <CallToAction key={block.id} block={block} />
          default: return null
        }
      })}
    </>
  )
}
