// Logo RCKY DIGITAL 2026 : grand format = phénix complet ; petit format (menu, pied de page) = version minimaliste serres + objectif
export function PhoenixIcon({ className = 'h-10 w-10', title, large = false }: { className?: string; title?: string; large?: boolean }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={large ? '/logo-phenix.webp' : '/logo-serres-small.webp'}
      alt={title ?? ''}
      aria-hidden={title ? undefined : true}
      className={`${className} object-contain`}
      draggable={false}
    />
  )
}

export default function Logo({ light = false }: { light?: boolean }) {
  return (
    <span className="flex items-center gap-2">
      <PhoenixIcon className="h-12 w-12" />
      <span className={`text-xl font-extrabold tracking-wide ${light ? 'text-white' : 'text-ink'}`}>
        RCKY <span className={light ? 'text-[#F2A65A]' : 'text-brand-deep'}>DIGITAL</span>
      </span>
    </span>
  )
}
