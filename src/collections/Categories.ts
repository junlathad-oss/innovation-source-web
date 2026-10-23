import type { CollectionConfig } from 'payload'
import { anyone, authenticated } from '../access'
import { slugField } from '../fields/slug'

export const Categories: CollectionConfig = {
  slug: 'categories',
  labels: { singular: 'หมวดสินค้า', plural: 'หมวดสินค้า' },
  admin: { useAsTitle: 'title', defaultColumns: ['title', 'subtitle', 'order'], group: 'สินค้า' },
  defaultSort: 'order',
  access: { read: anyone, create: authenticated, update: authenticated, delete: authenticated },
  fields: [
    { name: 'title', label: 'ชื่อหมวด (อังกฤษ)', type: 'text', required: true },
    { name: 'subtitle', label: 'คำอธิบายสั้น', type: 'text', localized: true },
    slugField('title'),
    { name: 'image', label: 'ภาพหมวด', type: 'upload', relationTo: 'media' },
    { name: 'description', label: 'รายละเอียด', type: 'textarea', localized: true },
    { name: 'order', label: 'ลำดับ', type: 'number', defaultValue: 0, admin: { position: 'sidebar' } },
  ],
}
