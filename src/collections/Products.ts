import type { CollectionConfig } from 'payload'
import { anyone, authenticated } from '../access'
import { slugField } from '../fields/slug'

export const Products: CollectionConfig = {
  slug: 'products',
  labels: { singular: 'สินค้า', plural: 'สินค้า' },
  admin: { useAsTitle: 'name', defaultColumns: ['name', 'partNumber', 'category', 'brand'], group: 'สินค้า' },
  access: { read: anyone, create: authenticated, update: authenticated, delete: authenticated },
  fields: [
    { name: 'name', label: 'ชื่อสินค้า', type: 'text', required: true, localized: true },
    { name: 'partNumber', label: 'Part Number', type: 'text', index: true },
    slugField('name'),
    {
      type: 'row',
      fields: [
        { name: 'category', label: 'หมวด', type: 'relationship', relationTo: 'categories', required: true },
        { name: 'brand', label: 'แบรนด์', type: 'relationship', relationTo: 'brands' },
      ],
    },
    { name: 'images', label: 'ภาพสินค้า', type: 'upload', relationTo: 'media', hasMany: true },
    { name: 'summary', label: 'คำอธิบายสั้น', type: 'textarea', localized: true },
    { name: 'body', label: 'รายละเอียด', type: 'richText', localized: true },
    {
      name: 'specs',
      label: 'สเปก',
      type: 'array',
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'label', label: 'หัวข้อ', type: 'text', required: true, localized: true },
            { name: 'value', label: 'ค่า', type: 'text', required: true },
          ],
        },
      ],
    },
    { name: 'datasheet', label: 'Datasheet (PDF)', type: 'upload', relationTo: 'media' },
    { name: 'featured', label: 'แสดงในหน้าแรก', type: 'checkbox', admin: { position: 'sidebar' } },
  ],
}
