import type { Block } from 'payload'
import { linkFields } from '../fields/link'

const sectionHeading: Block['fields'] = [
  { name: 'eyebrow', label: 'หัวข้อเล็ก (อังกฤษ)', type: 'text' },
  { name: 'heading', label: 'หัวข้อ', type: 'text', localized: true },
]

export const HeroBlock: Block = {
  slug: 'hero',
  labels: { singular: 'Hero', plural: 'Hero' },
  fields: [
    { name: 'badge', label: 'ป้ายด้านบน', type: 'text', localized: true },
    { name: 'title', label: 'หัวข้อบรรทัดแรก', type: 'text', required: true, localized: true },
    { name: 'highlight', label: 'หัวข้อบรรทัดที่สอง (สีเขียว)', type: 'text', localized: true },
    { name: 'subtitle', label: 'คำโปรย', type: 'textarea', localized: true },
    { name: 'primaryCta', label: 'ปุ่มหลัก', type: 'group', fields: linkFields(false) },
    { name: 'secondaryCta', label: 'ปุ่มรอง', type: 'group', fields: linkFields(false) },
    {
      name: 'trust',
      label: 'จุดเด่นใต้ปุ่ม',
      type: 'array',
      maxRows: 4,
      fields: [
        { name: 'text', label: 'ข้อความ', type: 'text', required: true, localized: true },
        {
          name: 'icon',
          type: 'select',
          defaultValue: 'shield',
          options: ['shield', 'truck', 'support', 'chip'].map((v) => ({ label: v, value: v })),
        },
      ],
    },
    { name: 'image', label: 'ภาพ Hero', type: 'upload', relationTo: 'media' },
    { name: 'video', label: 'วิดีโอ Hero (mp4, วนลูป)', type: 'upload', relationTo: 'media' },
  ],
}

export const StatsBlock: Block = {
  slug: 'stats',
  labels: { singular: 'ตัวเลขสถิติ', plural: 'ตัวเลขสถิติ' },
  fields: [
    {
      name: 'items',
      type: 'array',
      minRows: 1,
      maxRows: 4,
      fields: [
        { name: 'value', label: 'ตัวเลข', type: 'text', required: true },
        { name: 'label', label: 'คำอธิบาย', type: 'text', required: true, localized: true },
      ],
    },
  ],
}

export const CategoryGridBlock: Block = {
  slug: 'categoryGrid',
  labels: { singular: 'หมวดสินค้า', plural: 'หมวดสินค้า' },
  fields: [
    ...sectionHeading,
    {
      name: 'categories',
      label: 'เลือกหมวด (เว้นว่าง = แสดงทั้งหมด)',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: true,
    },
  ],
}

export const SolutionsBlock: Block = {
  slug: 'solutions',
  labels: { singular: 'โซลูชัน', plural: 'โซลูชัน' },
  fields: [
    {
      name: 'items',
      type: 'array',
      minRows: 1,
      maxRows: 3,
      fields: [
        { name: 'eyebrow', label: 'หัวข้อเล็ก', type: 'text' },
        { name: 'title', label: 'หัวข้อ', type: 'textarea', required: true, localized: true },
        { name: 'body', label: 'คำอธิบาย', type: 'textarea', localized: true },
        { name: 'dark', label: 'พื้นหลังเข้ม', type: 'checkbox' },
        { name: 'link', type: 'group', fields: linkFields(false) },
      ],
    },
  ],
}

export const IndustriesBlock: Block = {
  slug: 'industries',
  labels: { singular: 'อุตสาหกรรม', plural: 'อุตสาหกรรม' },
  fields: [
    ...sectionHeading,
    {
      name: 'items',
      type: 'array',
      fields: [
        { name: 'title', label: 'ชื่อ', type: 'text', required: true },
        { name: 'body', label: 'คำอธิบาย', type: 'text', localized: true },
      ],
    },
  ],
}

export const TimelineBlock: Block = {
  slug: 'timeline',
  labels: { singular: 'ประวัติบริษัท', plural: 'ประวัติบริษัท' },
  fields: [
    ...sectionHeading,
    { name: 'body', label: 'คำอธิบาย', type: 'textarea', localized: true },
    {
      name: 'items',
      type: 'array',
      fields: [
        { name: 'year', label: 'ปี', type: 'text', required: true },
        { name: 'text', label: 'เหตุการณ์', type: 'text', required: true, localized: true },
      ],
    },
  ],
}

export const LogoWallBlock: Block = {
  slug: 'logoWall',
  labels: { singular: 'แบรนด์และพันธมิตร', plural: 'แบรนด์และพันธมิตร' },
  fields: [
    {
      name: 'style',
      label: 'รูปแบบ',
      type: 'select',
      defaultValue: 'cards',
      options: [
        { label: 'การ์ดแบรนด์', value: 'cards' },
        { label: 'แถบโลโก้', value: 'logos' },
      ],
    },
    { name: 'eyebrow', label: 'หัวข้อเล็ก (อังกฤษ)', type: 'text' },
    { name: 'heading', label: 'หัวข้อ', type: 'text', localized: true },
    { name: 'brands', label: 'เลือกแบรนด์ (เว้นว่าง = ทั้งหมด)', type: 'relationship', relationTo: 'brands', hasMany: true },
  ],
}

export const CallToActionBlock: Block = {
  slug: 'cta',
  labels: { singular: 'ขอใบเสนอราคา', plural: 'ขอใบเสนอราคา' },
  fields: [
    { name: 'heading', label: 'หัวข้อ', type: 'textarea', required: true, localized: true },
    { name: 'body', label: 'คำอธิบาย', type: 'text', localized: true },
    { name: 'buttonLabel', label: 'ข้อความปุ่ม', type: 'text', localized: true },
  ],
}

export const homeBlocks = [
  HeroBlock,
  StatsBlock,
  CategoryGridBlock,
  SolutionsBlock,
  IndustriesBlock,
  TimelineBlock,
  LogoWallBlock,
  CallToActionBlock,
]
