import path from 'path'
import { fileURLToPath } from 'url'
import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import sharp from 'sharp'
import { en } from '@payloadcms/translations/languages/en'
import { th } from '@payloadcms/translations/languages/th'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Categories } from './collections/Categories'
import { Brands } from './collections/Brands'
import { Products } from './collections/Products'
import { Inquiries } from './collections/Inquiries'
import { Footer, Header, HomePage, SiteSettings } from './globals'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || '',
  secret: process.env.PAYLOAD_SECRET || '',
  admin: {
    user: Users.slug,
    meta: { titleSuffix: ' · Innovation Source' },
    importMap: { baseDir: path.resolve(dirname) },
  },
  collections: [Products, Categories, Brands, Media, Inquiries, Users],
  globals: [HomePage, SiteSettings, Header, Footer],
  localization: {
    locales: [
      { label: 'ไทย', code: 'th' },
      { label: 'English', code: 'en' },
    ],
    defaultLocale: 'th',
    fallback: true,
  },
  i18n: { supportedLanguages: { th, en }, fallbackLanguage: 'th' },
  editor: lexicalEditor(),
  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URI || '' },
  }),
  sharp,
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
})
