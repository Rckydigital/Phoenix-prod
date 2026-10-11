// Logo icône RCKY DIGITAL : phénix épuré avec objectif photo (piste A)
export function PhoenixIcon({ className = 'h-10 w-10', title }: { className?: string; title?: string }) {
  return (
    <svg
      viewBox="30 26 200 200"
      className={className}
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      <path d="M118 120 Q80 70 60 65 Q85 100 118 128 Z" fill="#E8742A" />
      <path d="M118 126 Q75 95 52 95 Q80 125 118 134 Z" fill="#2A93A8" />
      <path d="M118 132 Q80 125 62 128 Q88 148 118 140 Z" fill="#7A2E6B" />
      <path d="M142 120 Q180 70 200 65 Q175 100 142 128 Z" fill="#E8742A" />
      <path d="M142 126 Q185 95 208 95 Q180 125 142 134 Z" fill="#2A93A8" />
      <path d="M142 132 Q180 125 198 128 Q172 148 142 140 Z" fill="#7A2E6B" />
      <path d="M130 106 Q122 92 130 80 Q138 92 130 106 Z" fill="#E8742A" />
      <path d="M124 143 Q128 170 130 188 Q132 170 136 143 Z" fill="#C8383C" />
      <circle cx="130" cy="128" r="16" fill="#1E2A33" />
      <circle cx="130" cy="128" r="9" fill="#2A93A8" />
      <circle cx="126" cy="124" r="3" fill="#FFFFFF" />
    </svg>
  )
}

export default function Logo({ light = false }: { light?: boolean }) {
  return (
    <span className="flex items-center gap-2">
      <PhoenixIcon className="h-10 w-10" />
      <span className={`text-xl font-extrabold tracking-wide ${light ? 'text-white' : 'text-ink'}`}>
        RCKY <span className={light ? 'text-[#F2A65A]' : 'text-brand-deep'}>DIGITAL</span>
      </span>
    </span>
  )
}
