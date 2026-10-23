/**
 * Seeds the CMS with the company's real content (from the current site).
 * Run once on an empty database: `npm run seed`
 * Images: drop files into ./seed-media (hero.webp, hero.mp4, capacitors.webp, ics.webp,
 * resistors.webp, harness.webp, ties.webp, electromechanical.webp) before running.
 */
import fs from 'fs'
import path from 'path'
import { getPayload } from 'payload'
import config from '@payload-config'

const payload = await getPayload({ config })
const mediaDir = path.resolve(process.cwd(), 'seed-media')

async function upload(file: string, alt: string) {
  const filePath = path.join(mediaDir, file)
  if (!fs.existsSync(filePath)) return undefined
  const doc = await payload.create({ collection: 'media', data: { alt }, filePath })
  return doc.id
}

const existing = await payload.count({ collection: 'categories' })
if (existing.totalDocs > 0) {
  payload.logger.info('Database already has content; skipping seed.')
  process.exit(0)
}

// Only create an admin when credentials are supplied; otherwise /admin asks for the first user
if (process.env.SEED_ADMIN_EMAIL && process.env.SEED_ADMIN_PASSWORD && (await payload.count({ collection: 'users' })).totalDocs === 0) {
  await payload.create({
    collection: 'users',
    data: { email: process.env.SEED_ADMIN_EMAIL, password: process.env.SEED_ADMIN_PASSWORD, name: 'Admin' },
  })
}

const categoryData = [
  { slug: 'capacitors', title: 'Capacitors', th: 'ตัวเก็บประจุ', en: 'Electrolytic, film & ceramic' },
  { slug: 'ics', title: 'ICs & Semiconductors', th: 'ไอซีและเซมิคอนดักเตอร์', en: 'Integrated circuits & discretes' },
  { slug: 'resistors', title: 'Resistors & Diodes', th: 'ตัวต้านทานและไดโอด', en: 'Passive components' },
  { slug: 'harness', title: 'Wire Harness', th: 'ชุดสายไฟสั่งผลิต', en: 'Custom-designed harnesses' },
  { slug: 'ties', title: 'Cable Ties', th: 'สายรัดเคเบิ้ลไทร์', en: 'Nylon cable ties' },
  { slug: 'electromechanical', title: 'Electromechanical', th: 'รีเลย์ สวิตช์ คอนเนกเตอร์', en: 'Relays, switches, connectors' },
]

for (const [order, c] of categoryData.entries()) {
  const image = await upload(`${c.slug}.webp`, c.title)
  const doc = await payload.create({ collection: 'categories', locale: 'th', data: { title: c.title, slug: c.slug, subtitle: c.th, order, image } })
  await payload.update({ collection: 'categories', id: doc.id, locale: 'en', data: { subtitle: c.en } })
}

const categoryIds = Object.fromEntries(
  (await payload.find({ collection: 'categories', limit: 50, depth: 0 })).docs.map((c) => [c.slug, c.id]),
)
const cats = (...slugs: string[]) => slugs.map((s) => categoryIds[s]).filter(Boolean)

const brandData = [
  {
    name: 'RUBYCON', slug: 'rubycon', kind: 'authorized', since: 2018, categories: cats('capacitors'),
    th: { origin: 'ญี่ปุ่น', tagline: 'ตัวเก็บประจุคุณภาพสูงจากญี่ปุ่น', description: 'ผู้ผลิตตัวเก็บประจุอะลูมิเนียมอิเล็กโทรไลต์และฟิล์มจากญี่ปุ่น เราเป็นตัวแทนจำหน่ายอย่างเป็นทางการในประเทศไทยตั้งแต่ปี 2018' },
    en: { origin: 'Japan', tagline: 'High-reliability capacitors from Japan', description: 'Japanese maker of aluminum electrolytic and film capacitors. Our authorized distribution in Thailand began in 2018.' },
  },
  {
    name: 'element14', slug: 'element14', kind: 'authorized', since: 2020, categories: cats('ics', 'resistors', 'electromechanical'),
    th: { tagline: 'ชิ้นส่วนอิเล็กทรอนิกส์หลากหลายในที่เดียว', description: 'ผู้จัดจำหน่ายชิ้นส่วนอิเล็กทรอนิกส์ระดับโลก ครอบคลุมเซมิคอนดักเตอร์ พาสซีฟ และอิเล็กโทรแมคคานิคอล เป็นตัวแทนอย่างเป็นทางการตั้งแต่ปี 2020' },
    en: { tagline: 'Broadline electronic components', description: 'Global electronic component distributor covering semiconductors, passives and electromechanical parts. Authorized partner since 2020.' },
  },
  {
    name: 'AlphaSource', slug: 'alphasource', kind: 'group', since: 2014, categories: cats('harness', 'ties'),
    th: { tagline: 'บริษัทในเครือ ดูแลลูกค้าในประเทศ', description: 'AlphaSource Corporation ก่อตั้งปี 2014 เป็นจุดเริ่มต้นของกลุ่มบริษัท ดูแลลูกค้าในประเทศ' },
    en: { tagline: 'Group company serving local customers', description: 'AlphaSource Corporation, founded in 2014, is where the group started, serving local customers.' },
  },
  {
    name: 'FET Solution Engineering', slug: 'fet-solution-engineering', kind: 'partner', categories: [],
    th: { tagline: 'พันธมิตรทางธุรกิจ' }, en: { tagline: 'Business partner' },
  },
  {
    name: 'Alliance Packing Group', slug: 'alliance-packing-group', kind: 'partner', categories: [],
    th: { tagline: 'พันธมิตรทางธุรกิจ' }, en: { tagline: 'Business partner' },
  },
] as const
for (const [order, { th, en, categories, ...b }] of brandData.entries()) {
  const doc = await payload.create({ collection: 'brands', locale: 'th', data: { ...b, categories: [...categories], order, ...th } })
  await payload.update({ collection: 'brands', id: doc.id, locale: 'en', data: en })
}

await payload.updateGlobal({
  slug: 'site-settings',
  locale: 'th',
  data: {
    companyName: 'บริษัท อินโนเวชั่น ซอร์ซ (ประเทศไทย) จำกัด',
    groupName: 'AlphaSource Corporation Co., Ltd.',
    address: '19 ซอย Happy Place 4 ถ.เจ้าคุณทหาร\nแขวงคลองสามประเวศ เขตลาดกระบัง กรุงเทพฯ 10520',
    phone: '+66 (0) 62 359-4623',
    email: 'sales@innovation-sources.com',
    seo: {
      title: 'Innovation Source Thailand · ผู้ออกแบบและจัดจำหน่ายชิ้นส่วนอิเล็กทรอนิกส์',
      description: 'ตัวแทนจำหน่าย RUBYCON และ element14 ในประเทศไทย ออกแบบ Wire Harness และโซลูชันไฟฟ้า–อิเล็กทรอนิกส์ตั้งแต่ปี 2014',
    },
  },
})
await payload.updateGlobal({
  slug: 'site-settings',
  locale: 'en',
  data: {
    companyName: 'Innovation Source (Thailand) Co., Ltd.',
    address: '19 Soi Happy Place 4, Chaokhuntaharn Rd.,\nKhlongsampravet, Ladkrabang, Bangkok 10520',
    seo: {
      title: 'Innovation Source Thailand · Electronic component design & distribution',
      description: 'Authorized RUBYCON and element14 distributor in Thailand. Wire harness and electrical solution design since 2014.',
    },
  },
})

const nav = (th: boolean) => [
  { label: th ? 'สินค้า' : 'Products', href: '/products' },
  { label: th ? 'โซลูชัน' : 'Solutions', href: '/#solutions' },
  { label: th ? 'แบรนด์' : 'Brands', href: '/brands' },
  { label: th ? 'เกี่ยวกับเรา' : 'About', href: '/#about' },
  { label: th ? 'ติดต่อ' : 'Contact', href: '/contact' },
]
const header = await payload.updateGlobal({ slug: 'header', locale: 'th', data: { nav: nav(true), cta: { label: 'ขอใบเสนอราคา', href: '/contact' } } })
await payload.updateGlobal({
  slug: 'header',
  locale: 'en',
  data: {
    nav: nav(false).map((n, i) => ({ ...n, id: header.nav?.[i]?.id })),
    cta: { label: 'Request a quote', href: '/contact' },
  },
})

await payload.updateGlobal({
  slug: 'footer',
  locale: 'th',
  data: {
    columns: [{ title: 'บริษัท', links: [{ label: 'เกี่ยวกับเรา', href: '/#about' }, { label: 'โซลูชัน', href: '/#solutions' }, { label: 'สินค้า', href: '/products' }] }],
    legal: [{ label: 'นโยบายคุกกี้', href: '/cookies-policy' }, { label: 'นโยบายความเป็นส่วนตัว', href: '/privacy-policy' }],
  },
})

const heroImage = await upload('hero.webp', 'ชิ้นส่วนอิเล็กทรอนิกส์บนแท่นจัดแสดง')
const heroVideo = await upload('hero.mp4', '')

await payload.updateGlobal({
  slug: 'home-page',
  locale: 'th',
  data: {
    _status: 'published',
    layout: [
      {
        blockType: 'hero',
        badge: 'Authorized Distributor · RUBYCON · element14',
        title: 'ชิ้นส่วนอิเล็กทรอนิกส์',
        highlight: 'ที่วิศวกรไว้วางใจ',
        subtitle: 'ออกแบบและจัดหาโซลูชันไฟฟ้า–อิเล็กทรอนิกส์ครบวงจร สำหรับอุตสาหกรรมยานยนต์ ระบบอัตโนมัติ และผู้ผลิตอุปกรณ์ไฟฟ้า ตั้งแต่ปี 2014',
        primaryCta: { label: 'ดูสินค้าทั้งหมด', href: '/products' },
        secondaryCta: { label: 'ปรึกษาทีมออกแบบ', href: '/contact' },
        trust: [
          { text: 'ของแท้จากผู้ผลิต มีใบรับรอง', icon: 'shield' },
          { text: 'นำเข้าตรงจาก Principal', icon: 'truck' },
          { text: 'วิศวกรดูแลตั้งแต่ออกแบบ', icon: 'support' },
        ],
        image: heroImage,
        video: heroVideo,
      },
      {
        blockType: 'stats',
        items: [
          { value: '2014', label: 'เริ่มต้นธุรกิจ' },
          { value: '2', label: 'แบรนด์ระดับโลกที่เป็นตัวแทนจำหน่าย' },
          { value: '4', label: 'กลุ่มอุตสาหกรรมที่ดูแล' },
          { value: '1 วัน', label: 'ตอบกลับใบเสนอราคา' },
        ],
      },
      { blockType: 'categoryGrid', eyebrow: 'Products', heading: 'หมวดสินค้า' },
      {
        blockType: 'solutions',
        items: [
          { eyebrow: '01 — DESIGN', title: 'ออกแบบ Wire Harness\nและระบบไฟฟ้าตามสเปก', body: 'ทีมวิศวกรร่วมออกแบบตั้งแต่ Schematic จนถึงชิ้นงานต้นแบบ ลดเวลาพัฒนาและต้นทุนการผลิต', dark: true, link: { label: 'เริ่มโปรเจกต์', href: '/contact' } },
          { eyebrow: '02 — SOURCING', title: 'จัดหาชิ้นส่วนแท้\nตรงจากผู้ผลิตทั่วโลก', body: 'ตัวแทนจำหน่ายอย่างเป็นทางการของ RUBYCON และ element14 ในประเทศไทย พร้อมเอกสารรับรองครบถ้วน', link: { label: 'ดูสินค้า', href: '/products' } },
        ],
      },
      {
        blockType: 'industries',
        eyebrow: 'Industries',
        heading: 'อุตสาหกรรมที่เราดูแล',
        items: [
          { title: 'Electronics', body: 'ผู้ผลิตแผงวงจรและอุปกรณ์อิเล็กทรอนิกส์' },
          { title: 'Automation', body: 'ระบบอัตโนมัติและเครื่องจักรในโรงงาน' },
          { title: 'Automotive', body: 'ชิ้นส่วนและชุดสายไฟยานยนต์' },
          { title: 'Electrical Equipment', body: 'ผู้ผลิตอุปกรณ์ไฟฟ้า' },
        ],
      },
      {
        blockType: 'timeline',
        eyebrow: 'Our Story',
        heading: 'จากทีม 2 คน\nสู่พันธมิตรเชิงกลยุทธ์',
        body: 'เป้าหมายของเราคือการเป็นพันธมิตรเชิงกลยุทธ์ด้านการออกแบบโซลูชันไฟฟ้าและอิเล็กทรอนิกส์ให้ลูกค้าทุกราย',
        items: [
          { year: '2014', text: 'ก่อตั้ง Alpha Source Corporation' },
          { year: '2015', text: 'ก่อตั้ง Innovation Source นำเข้าตรงจาก Principal' },
          { year: '2016', text: 'เริ่มบริการออกแบบ Wire Harness' },
          { year: '2018', text: 'ตัวแทนจำหน่าย RUBYCON' },
          { year: '2020', text: 'ตัวแทนจำหน่าย element14' },
        ],
      },
      { blockType: 'logoWall', style: 'cards', eyebrow: 'Brands', heading: 'เลือกดูตามแบรนด์' },
      { blockType: 'cta', heading: 'มี BOM หรือ Part Number\nที่ต้องการอยู่แล้ว?', body: 'ส่งรายการมา ทีมขายตอบกลับพร้อมราคาภายใน 1 วันทำการ', buttonLabel: 'ขอใบเสนอราคา' },
    ],
  },
})

payload.logger.info('Seed complete.')
process.exit(0)
