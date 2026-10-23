import type { Field } from 'payload'

const toSlug = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9ก-๙]+/g, '-')
    .replace(/^-+|-+$/g, '')

export const slugField = (from: string): Field => ({
  name: 'slug',
  label: 'Slug (URL)',
  type: 'text',
  index: true,
  unique: true,
  admin: { position: 'sidebar', description: 'เว้นว่างไว้เพื่อสร้างอัตโนมัติ' },
  hooks: {
    beforeValidate: [
      ({ value, data }) => {
        if (typeof value === 'string' && value) return toSlug(value)
        const source = data?.[from]
        return typeof source === 'string' ? toSlug(source) : value
      },
    ],
  },
})
