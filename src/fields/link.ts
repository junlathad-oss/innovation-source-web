import type { Field } from 'payload'

export const linkFields = (required = true): Field[] => [
  {
    type: 'row',
    fields: [
      { name: 'label', label: 'ข้อความ', type: 'text', required, localized: true },
      { name: 'href', label: 'ลิงก์', type: 'text', required, admin: { description: 'เช่น /products หรือ #contact' } },
    ],
  },
]
