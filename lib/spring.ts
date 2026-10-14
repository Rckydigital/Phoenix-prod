// Ressort « à la Apple » : deux réglages lisibles au lieu de masse/raideur/amortissement.
//  - damping : 1 = pas de rebond (par défaut), < 1 = léger rebond (seulement après un geste avec élan)
//  - response : rapidité en secondes (ce n'est pas une durée fixe)
// Le ressort part toujours de la valeur ACTUELLE et garde la vitesse : on peut l'interrompre à tout moment.

export type SpringOpts = { damping?: number; response?: number; velocity?: number }

export type SpringHandle = { stop: () => void }

export function spring(
  from: number,
  to: number,
  onUpdate: (v: number, velocity: number) => void,
  { damping = 1, response = 0.4, velocity = 0 }: SpringOpts = {},
  onDone?: () => void,
): SpringHandle {
  const k = Math.pow((2 * Math.PI) / response, 2) // raideur (masse = 1)
  const c = (4 * Math.PI * damping) / response // amortissement
  let x = from
  let v = velocity
  let last = performance.now()
  let raf = 0
  let stopped = false

  const step = (now: number) => {
    if (stopped) return
    // pas de temps borné pour rester stable si l'onglet a été en arrière-plan
    let dt = Math.min((now - last) / 1000, 1 / 30)
    last = now
    // sous-pas pour la précision
    const sub = 4
    dt /= sub
    for (let i = 0; i < sub; i++) {
      const a = -k * (x - to) - c * v
      v += a * dt
      x += v * dt
    }
    if (Math.abs(x - to) < 0.3 && Math.abs(v) < 2) {
      onUpdate(to, 0)
      onDone?.()
      return
    }
    onUpdate(x, v)
    raf = requestAnimationFrame(step)
  }
  raf = requestAnimationFrame(step)
  return { stop: () => { stopped = true; cancelAnimationFrame(raf) } }
}

// Projection de l'élan (fonction d'Apple, Designing Fluid Interfaces) : où le geste « va » finir.
export function project(velocity: number, decelerationRate = 0.998) {
  return ((velocity / 1000) * decelerationRate) / (1 - decelerationRate)
}

// Résistance progressive au-delà d'une limite (rubber-banding).
export function rubberband(overshoot: number, dimension: number, constant = 0.55) {
  return (overshoot * dimension * constant) / (dimension + constant * Math.abs(overshoot))
}

export function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}
