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

The seed creates an admin user only when `SEED_ADMIN_EMAIL` and `SEED_ADMIN_PASSWORD` are set;
otherwise open `/admin` and Payload asks you to create the first user.
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

## Deploying (Vercel + Neon)
1. **Database:** create a Neon project and copy its pooled connection string.
2. **Vercel:** import this GitHub repo as a new project. `vercel.json` already sets the build
   command to `npm run ci`, which runs database migrations, loads the starter content into an
   empty database (it skips itself once content exists), and then runs `next build`.
3. **Storage:** in the Vercel project, open Storage → create a Blob store and connect it.
   That adds `BLOB_READ_WRITE_TOKEN`, so uploads are stored in Vercel Blob.
4. **Environment variables** (Production and Preview):
   - `DATABASE_URI`: the Neon connection string
   - `PAYLOAD_SECRET`: a long random string (`openssl rand -hex 32`)
   - `NEXT_PUBLIC_SERVER_URL`: the site URL, e.g. `https://www.innovation-sources.com`
5. Deploy, then open `/admin` straight away and create the first admin user.

### Schema changes
Changing a collection or global changes the database schema. Locally, Payload syncs the schema
automatically in dev. Before deploying, run `npm run migrate:create <name>` and commit the
generated file in `src/migrations`; the Vercel build applies it.
