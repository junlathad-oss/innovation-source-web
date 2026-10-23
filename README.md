# Innovation Source — Website

Next.js 16 + Payload CMS 3 (one app). Content is editable at `/admin` in Thai or English.

## Stack
- **Payload 3.92** with Postgres (`@payloadcms/db-postgres`), Lexical rich text, Thai admin UI
- **Next.js 16** App Router, fonts: Outfit + Anuphan (headings), IBM Plex Sans Thai (body)
- Localized content: `th` (default) and `en`; visitors switch with the TH/EN button

## Getting started
Requires Node `^22.23.4 || >=24.22.1` and a Postgres database.

```bash
cp .env.example .env        # set DATABASE_URI and PAYLOAD_SECRET
npm install
npm run seed                # loads company content (run once on an empty DB)
npm run dev                 # http://localhost:3000, admin at /admin
```

The seed creates an admin user from `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD`
(defaults: `admin@innovation-sources.com` / `change-me-now` — change it right away).
To seed images, put these files in `./seed-media` first: `hero.png`, `hero.mp4`,
`capacitors.png`, `ics.png`, `resistors.png`, `harness.png`, `ties.png`, `electromechanical.png`.
Without them the site falls back to line-art icons.

## What editors can change
| Admin section | Controls |
| --- | --- |
| หน้าแรก (Home page) | Ordered blocks: Hero (image/video), Stats, Categories, Solutions, Industries, Timeline, Brands, Quote CTA. Drafts + versions. |
| สินค้า / หมวดสินค้า / แบรนด์ | Product catalog with part numbers, specs, datasheets |
| คำขอใบเสนอราคา | Quote requests submitted from the site, with a status |
| ข้อมูลบริษัท / เมนู / ส่วนท้าย | Contact details, SEO, header and footer links |

## Routes
`/` home · `/products` (filter `?category=`, search `?q=`) · `/products/[slug]` · `/contact`

## Deploying
Any Node host works (Vercel, Railway, a VPS). Use a managed Postgres (Neon, Supabase).
Uploaded media is stored on local disk by default; on serverless hosts add a storage
adapter such as `@payloadcms/storage-s3` or `@payloadcms/storage-vercel-blob`.
For production, generate migrations with `npx payload migrate:create` and run `npx payload migrate`.
