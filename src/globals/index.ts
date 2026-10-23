import type { GlobalConfig } from 'payload'
import { anyone } from '../access'
import { homeBlocks } from '../blocks'
import { linkFields } from '../fields/link'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'ข้อมูลบริษัท',
  admin: { group: 'ตั้งค่า' },
  access: { read: anyone },
  fields: [
    { name: 'companyName', label: 'ชื่อบริษัท', type: 'text', localized: true, required: true },
    { name: 'groupName', label: 'บริษัทในเครือ', type: 'text' },
    { name: 'address', label: 'ที่อยู่', type: 'textarea', localized: true },
    { name: 'phone', label: 'โทรศัพท์', type: 'text' },
    { name: 'email', label: 'อีเมล', type: 'email' },
    { name: 'lineId', label: 'LINE ID', type: 'text' },
    { name: 'mapUrl', label: 'ลิงก์ Google Maps', type: 'text' },
    {
      name: 'seo',
      label: 'SEO',
      type: 'group',
      fields: [
        { name: 'title', type: 'text', localized: true },
        { name: 'description', type: 'textarea', localized: true },
        { name: 'image', type: 'upload', relationTo: 'media' },
      ],
    },
  ],
}

export const Header: GlobalConfig = {
  slug: 'header',
  label: 'เมนูด้านบน',
  admin: { group: 'ตั้งค่า' },
  access: { read: anyone },
  fields: [
    { name: 'nav', label: 'เมนู', type: 'array', maxRows: 7, fields: linkFields() },
    { name: 'cta', label: 'ปุ่มด้านขวา', type: 'group', fields: linkFields(false) },
  ],
}

export const Footer: GlobalConfig = {
  slug: 'footer',
  label: 'ส่วนท้าย',
  admin: { group: 'ตั้งค่า' },
  access: { read: anyone },
  fields: [
    {
      name: 'columns',
      label: 'คอลัมน์ลิงก์',
      type: 'array',
      maxRows: 3,
      fields: [
        { name: 'title', label: 'หัวข้อ', type: 'text', localized: true },
        { name: 'links', type: 'array', fields: linkFields() },
      ],
    },
    { name: 'legal', label: 'ลิงก์นโยบาย', type: 'array', fields: linkFields() },
  ],
}

export const HomePage: GlobalConfig = {
  slug: 'home-page',
  label: 'หน้าแรก',
  admin: { group: 'เนื้อหา', description: 'ลากเพื่อสลับลำดับ section ได้' },
  access: { read: anyone },
  versions: { drafts: true },
  fields: [{ name: 'layout', label: 'Sections', type: 'blocks', blocks: homeBlocks }],
}
