import type { CollectionConfig } from 'payload'
import { anyone, authenticated } from '../access'

export const Inquiries: CollectionConfig = {
  slug: 'inquiries',
  labels: { singular: 'คำขอใบเสนอราคา', plural: 'คำขอใบเสนอราคา' },
  admin: { useAsTitle: 'email', defaultColumns: ['email', 'company', 'status', 'createdAt'], group: 'ลูกค้า' },
  access: { create: anyone, read: authenticated, update: authenticated, delete: authenticated },
  timestamps: true,
  fields: [
    { name: 'name', label: 'ชื่อผู้ติดต่อ', type: 'text' },
    { name: 'company', label: 'บริษัท', type: 'text' },
    { name: 'email', label: 'อีเมล', type: 'email', required: true },
    { name: 'phone', label: 'โทรศัพท์', type: 'text' },
    { name: 'message', label: 'รายการ / BOM / Part Number', type: 'textarea' },
    {
      name: 'status',
      label: 'สถานะ',
      type: 'select',
      defaultValue: 'new',
      access: { create: ({ req }) => Boolean(req.user), update: ({ req }) => Boolean(req.user) },
      options: [
        { label: 'ใหม่', value: 'new' },
        { label: 'กำลังดำเนินการ', value: 'in-progress' },
        { label: 'ส่งใบเสนอราคาแล้ว', value: 'quoted' },
        { label: 'ปิดแล้ว', value: 'closed' },
      ],
      admin: { position: 'sidebar' },
    },
  ],
}
