import type { SVGProps } from 'react'

const base = (p: SVGProps<SVGSVGElement>) => ({
  width: 18,
  height: 18,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  ...p
})

export const PlusIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="M12 5v14M5 12h14" />
  </svg>
)

export const PencilIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="M4 20h4L19 9l-4-4L4 16v4z" />
    <path d="M13.5 6.5l4 4" />
  </svg>
)

export const CloseIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
)

export const ArrowRight = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="M4 12h16M14 6l6 6-6 6" />
  </svg>
)

export const ArrowLeft = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="M20 12H4M10 6l-6 6 6 6" />
  </svg>
)

export const ArrowUpRight = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="M7 17L17 7M8 7h9v9" />
  </svg>
)

export const PlayIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base({ fill: 'currentColor', stroke: 'none', ...p })}>
    <path d="M8 5.5v13a1 1 0 001.5.86l10.5-6.5a1 1 0 000-1.72L9.5 4.64A1 1 0 008 5.5z" />
  </svg>
)

export const TrashIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a1 1 0 001 1h8a1 1 0 001-1l1-12M9 7V4h6v3" />
  </svg>
)

export const InstagramIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" />
  </svg>
)

export const YoutubeIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <rect x="3" y="5.5" width="18" height="13" rx="4" />
    <path d="M10.5 9.5v5l4.5-2.5-4.5-2.5z" />
  </svg>
)

export const MailIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <rect x="3" y="5" width="18" height="14" rx="2.5" />
    <path d="M3.5 7l8.5 6 8.5-6" />
  </svg>
)

export const MoonIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="M20 14.5A8 8 0 019.5 4a8 8 0 1010.5 10.5z" />
  </svg>
)

export const SunIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4" />
  </svg>
)
