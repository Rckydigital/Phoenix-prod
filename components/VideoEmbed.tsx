'use client'

import { useState } from 'react'

// Vidéo YouTube ou Instagram intégrée, chargée seulement au clic :
// pas de cookies tiers avant l'action du visiteur (RGPD) et une page plus rapide.

export type Video = { platform: 'youtube' | 'instagram'; url: string; title: string; client?: string }

function youtubeId(url: string) {
  const m = url.match(/(?:youtu\.be\/|v=|shorts\/|embed\/)([A-Za-z0-9_-]{6,})/)
  return m ? m[1] : null
}
function instagramPath(url: string) {
  const m = url.match(/instagram\.com\/(?:[^/]+\/)?(p|reel|tv)\/([A-Za-z0-9_-]+)/)
  return m ? `${m[1] === 'tv' ? 'p' : m[1]}/${m[2]}` : null
}

export default function VideoEmbed({ video }: { video: Video }) {
  const [loaded, setLoaded] = useState(false)
  const yt = video.platform === 'youtube' ? youtubeId(video.url) : null
  const ig = video.platform === 'instagram' ? instagramPath(video.url) : null
  const src = yt
    ? `https://www.youtube-nocookie.com/embed/${yt}?autoplay=1&rel=0`
    : ig
      ? `https://www.instagram.com/${ig}/embed`
      : null
  const vertical = video.platform === 'instagram' || /shorts\//.test(video.url)

  return (
    <figure className="card overflow-hidden p-0">
      <div className={`relative w-full bg-ink ${vertical ? 'aspect-[4/5]' : 'aspect-video'}`}>
        {loaded && src ? (
          <iframe
            src={src}
            title={video.title}
            className="absolute inset-0 h-full w-full border-0 bg-white"
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
            loading="lazy"
          />
        ) : (
          <button
            type="button"
            onClick={() => (src ? setLoaded(true) : window.open(video.url, '_blank', 'noopener'))}
            className="group absolute inset-0 flex flex-col items-center justify-center gap-3 text-white"
            aria-label={`Lire la vidéo : ${video.title}`}
          >
            {yt && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={`https://i.ytimg.com/vi/${yt}/hqdefault.jpg`} alt="" className="absolute inset-0 h-full w-full object-cover opacity-70" />
            )}
            <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-brand transition-transform group-hover:scale-110">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="#1E2A33" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg>
            </span>
            <span className="relative rounded-full bg-black/50 px-3 py-1 text-xs font-medium">
              {video.platform === 'youtube' ? 'YouTube' : 'Instagram'} · cliquer pour lire
            </span>
          </button>
        )}
      </div>
      <figcaption className="px-5 py-4">
        {video.client && <p className="text-xs font-semibold uppercase tracking-wider text-brand-deep">{video.client}</p>}
        <p className="mt-1 font-semibold text-ink">{video.title}</p>
        <a href={video.url} target="_blank" rel="noopener noreferrer" className="mt-1 inline-block text-sm text-ink-soft hover:text-brand-deep">
          Voir sur {video.platform === 'youtube' ? 'YouTube' : 'Instagram'} →
        </a>
      </figcaption>
    </figure>
  )
}
