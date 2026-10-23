import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: { useAsTitle: 'email', group: 'ระบบ' },
  auth: true,
  fields: [{ name: 'name', type: 'text' }],
}
