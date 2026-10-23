import type { SVGProps } from 'react'

const base = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, 'aria-hidden': true } as const

export const ArrowRight = (p: SVGProps<SVGSVGElement>) => (
  <svg width="16" height="16" viewBox="0 0 24 24" {...base} strokeWidth={2.2} {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
)

export const SearchIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg width="16" height="16" viewBox="0 0 24 24" {...base} strokeWidth={2} {...p}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </svg>
)

const trustIcons = {
  shield: (
    <>
      <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  truck: (
    <>
      <path d="M3 7h11v9H3zM14 10h4l3 3v3h-7" />
      <circle cx="7" cy="18" r="1.6" />
      <circle cx="17" cy="18" r="1.6" />
    </>
  ),
  support: (
    <>
      <path d="M4 18v-3a8 8 0 0 1 16 0v3" />
      <rect x="3" y="15" width="4" height="5" rx="1.5" />
      <rect x="17" y="15" width="4" height="5" rx="1.5" />
    </>
  ),
  chip: (
    <>
      <rect x="6" y="6" width="12" height="12" rx="2" />
      <path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4" />
    </>
  ),
}

export type TrustIconName = keyof typeof trustIcons

export const TrustIcon = ({ name }: { name?: string | null }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" {...base} stroke="var(--accent)" style={{ flexShrink: 0 }}>
    {trustIcons[(name as TrustIconName) || 'shield'] ?? trustIcons.shield}
  </svg>
)

const categoryPaths: Record<string, React.ReactNode> = {
  capacitors: <><rect x="18" y="6" width="20" height="36" rx="10" /><path d="M18 14h20M24 42v10M32 42v10" /></>,
  ics: <><rect x="14" y="14" width="28" height="28" rx="4" /><path d="M20 8v6M28 8v6M36 8v6M20 42v6M28 42v6M36 42v6M8 20h6M8 28h6M8 36h6M42 20h6M42 28h6M42 36h6" /></>,
  resistors: <><path d="M4 28h12M40 28h12" /><rect x="16" y="21" width="24" height="14" rx="7" /><path d="M23 21v14M29 21v14M34 21v14" /></>,
  harness: <><path d="M6 18c14 0 14 20 28 20h16M6 28c14 0 14 10 28 10M6 38c14 0 14 0 28 0" /><rect x="44" y="32" width="8" height="12" rx="2" /></>,
  ties: <><circle cx="28" cy="28" r="14" /><rect x="38" y="24" width="10" height="8" rx="2" /><path d="M48 28h4" /></>,
  electromechanical: <><rect x="12" y="16" width="32" height="24" rx="4" /><path d="M20 16V10M36 16V10M20 40v6M36 40v6" /><circle cx="28" cy="28" r="4" /></>,
}

export function CategoryIcon({ slug }: { slug?: string | null }) {
  const key = Object.keys(categoryPaths).find((k) => slug?.includes(k)) ?? 'ics'
  return (
    <svg width="56" height="56" viewBox="0 0 56 56" {...base} strokeWidth={2} stroke="var(--accent)">
      {categoryPaths[key]}
    </svg>
  )
}

export const Logo = () => (
  <svg width="34" height="34" viewBox="0 0 34 34" fill="none" aria-hidden="true">
    <rect x="1" y="1" width="32" height="32" rx="9" fill="#0F6B4F" />
    <path d="M11 10v14M17 13v11M23 10v14" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" />
    <circle cx="17" cy="9.5" r="1.8" fill="#7FD3B0" />
  </svg>
)

export const HeroIllustration = () => (
  <svg viewBox="0 0 520 460" width="100%" style={{ maxWidth: 560 }} role="img" aria-label="Capacitor and IC chip on a circuit board">
    <ellipse cx="260" cy="360" rx="220" ry="52" fill="#D2E4DA" />
    <g stroke="#9CC4B0" strokeWidth="2" fill="none"><path d="M60 360h90l30-30h70" /><path d="M300 330h70l30 30h60" /><path d="M150 380h220" /></g>
    <rect x="190" y="230" width="150" height="110" rx="10" fill="#14231D" />
    <rect x="204" y="244" width="122" height="82" rx="6" fill="#1D3229" />
    <rect x="90" y="150" width="76" height="190" rx="38" fill="#0F6B4F" />
    <ellipse cx="128" cy="160" rx="38" ry="14" fill="#2B8A6A" />
    <path d="M98 196h60" stroke="#7FD3B0" strokeWidth="3" />
    <rect x="378" y="200" width="56" height="140" rx="28" fill="#24322D" />
    <ellipse cx="406" cy="208" rx="28" ry="10" fill="#3D4E47" />
  </svg>
)
