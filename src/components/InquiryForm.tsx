'use client'

import { useActionState } from 'react'
import { submitInquiry, type InquiryState } from '@/app/(frontend)/actions'

export function QuickInquiry({ buttonLabel }: { buttonLabel: string }) {
  const [state, action, pending] = useActionState<InquiryState, FormData>(submitInquiry, null)
  return (
    <div style={{ flex: '1 1 380px' }}>
      <form action={action} className="cta__form">
        <label className="sr-only" htmlFor="cta-email">อีเมล</label>
        <input id="cta-email" name="email" type="email" required placeholder="อีเมลบริษัทของคุณ" />
        <button className="btn btn--dark btn--sm" type="submit" disabled={pending}>
          {pending ? 'กำลังส่ง…' : buttonLabel}
        </button>
      </form>
      {state && <p className="cta__note" role="status">{state.message}</p>}
    </div>
  )
}

export function FullInquiry({ defaultMessage }: { defaultMessage?: string }) {
  const [state, action, pending] = useActionState<InquiryState, FormData>(submitInquiry, null)
  if (state?.ok) return <p className="form-status" role="status">{state.message}</p>
  return (
    <form action={action} className="form">
      <label>ชื่อผู้ติดต่อ<input name="name" autoComplete="name" /></label>
      <label>บริษัท<input name="company" autoComplete="organization" /></label>
      <label>อีเมล *<input name="email" type="email" required autoComplete="email" /></label>
      <label>โทรศัพท์<input name="phone" type="tel" autoComplete="tel" /></label>
      <label>รายการที่ต้องการ (Part Number / BOM / จำนวน)<textarea name="message" rows={6} defaultValue={defaultMessage} /></label>
      {state && !state.ok && <p className="form-status" role="alert">{state.message}</p>}
      <button className="btn btn--primary" type="submit" disabled={pending} style={{ justifySelf: 'start' }}>
        {pending ? 'กำลังส่ง…' : 'ส่งคำขอใบเสนอราคา'}
      </button>
    </form>
  )
}
