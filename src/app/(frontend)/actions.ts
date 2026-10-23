'use server'

import { cookies } from 'next/headers'
import { getClient } from '@/lib/payload'

export type InquiryState = { ok: boolean; message: string } | null

export async function submitInquiry(_prev: InquiryState, formData: FormData): Promise<InquiryState> {
  const email = String(formData.get('email') || '').trim()
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, message: 'กรุณากรอกอีเมลให้ถูกต้อง' }
  }
  const field = (name: string) => String(formData.get(name) || '').trim() || undefined

  try {
    const payload = await getClient()
    await payload.create({
      collection: 'inquiries',
      overrideAccess: false,
      data: {
        email,
        name: field('name'),
        company: field('company'),
        phone: field('phone'),
        message: field('message'),
      },
    })
    return { ok: true, message: 'ได้รับข้อมูลแล้ว ทีมขายจะติดต่อกลับภายใน 1 วันทำการ' }
  } catch {
    return { ok: false, message: 'ส่งไม่สำเร็จ กรุณาลองใหม่หรือโทร +66 (0) 62 359-4623' }
  }
}

export async function setLanguage(formData: FormData) {
  const lang = formData.get('lang') === 'en' ? 'en' : 'th'
  const store = await cookies()
  store.set('lang', lang, { path: '/', maxAge: 60 * 60 * 24 * 365, sameSite: 'lax' })
}
