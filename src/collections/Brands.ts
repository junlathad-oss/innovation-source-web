import type { CollectionConfig } from 'payload'
import { anyone, authenticated } from '../access'
import { slugField } from '../fields/slug'

export const Brands: CollectionConfig = {
  slug: 'brands',
  labels: { singular: 'แบรนด์/พันธมิตร', plural: 'แบรนด์และพันธมิตร' },
  admin: { useAsTitle: 'name', group: 'สินค้า' },
  defaultSort: 'order',
  access: { read: anyone, create: authenticated, update: authenticated, delete: authenticated },
  fields: [
    { name: 'name', label: 'ชื่อ', type: 'text', required: true },
    slugField('name'),
    { name: 'logo', label: 'โลโก้', type: 'upload', relationTo: 'media' },
    {
      name: 'kind',
      label: 'ประเภท',
      type: 'select',
      defaultValue: 'authorized',
      options: [
        { label: 'ตัวแทนจำหน่ายอย่างเป็นทางการ', value: 'authorized' },
        { label: 'พันธมิตร', value: 'partner' },
        { label: 'บริษัทในเครือ', value: 'group' },
      ],
    },
    { name: 'since', label: 'ตั้งแต่ปี', type: 'number' },
    { name: 'origin', label: 'ประเทศ', type: 'text', localized: true },
    { name: 'tagline', label: 'คำโปรยบนการ์ด', type: 'text', localized: true },
    { name: 'description', label: 'รายละเอียด (หน้าแบรนด์)', type: 'textarea', localized: true },
    { name: 'categories', label: 'หมวดสินค้าที่จำหน่าย', type: 'relationship', relationTo: 'categories', hasMany: true },
    { name: 'url', label: 'เว็บไซต์', type: 'text' },
    { name: 'order', label: 'ลำดับ', type: 'number', defaultValue: 0, admin: { position: 'sidebar' } },
  ],
}
