import type { CollectionConfig } from 'payload'
import { anyone, authenticated } from '../access'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'สื่อ', plural: 'คลังสื่อ' },
  admin: { group: 'เนื้อหา' },
  access: { read: anyone, create: authenticated, update: authenticated, delete: authenticated },
  upload: {
    mimeTypes: ['image/*', 'video/mp4', 'video/webm'],
    imageSizes: [
      { name: 'thumb', width: 480 },
      { name: 'card', width: 960 },
      { name: 'hero', width: 1920 },
    ],
    focalPoint: true,
  },
  fields: [{ name: 'alt', label: 'คำอธิบายภาพ (alt)', type: 'text', localized: true }],
}
