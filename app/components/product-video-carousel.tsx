import { useEffect, useRef, useState } from "react"
import { Button } from "~/components/ui/button"
import videos from '~/data/product-videos.json';

type VideoItem = {
  name: string
  youtubeId: string
  href: string
  customThumbnail?: string
}

const AUTO_ROTATE_MS = 6000

function getYoutubeThumbnail(
  youtubeId: string,
  custom?: string
) {
  if (custom) return custom
  return `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`
}

export function ProductVideoCarousel() {
  const [mounted, setMounted] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null)
  const [isPaused, setIsPaused] = useState(false)
  const startX = useRef<number | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Hydration check
  useEffect(() => {
    setMounted(true)
  }, [])

  /** 🔀 Random video on first load */
  useEffect(() => {
    if (!mounted) return
    setCurrentIndex(Math.floor(Math.random() * videos.length))
  }, [mounted])

  /** 🔁 Auto-rotate */
  useEffect(() => {
    if (!mounted || isPaused) return

    intervalRef.current = setInterval(() => {
      setCurrentIndex((i) => (i + 1) % videos.length)
    }, AUTO_ROTATE_MS)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [mounted, isPaused])

  const next = () => {
    setCurrentIndex((i) => (i + 1) % videos.length)
  }

  const prev = () => {
    setCurrentIndex((i) => (i === 0 ? videos.length - 1 : i - 1))
  }

  /** 👉 Mobile swipe */
  const onTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX
    setIsPaused(true)
  }

  const onTouchEnd = (e: React.TouchEvent) => {
    if (startX.current === null) return
    const delta = e.changedTouches[0].clientX - startX.current

    if (delta > 60) prev()
    if (delta < -60) next()

    startX.current = null
    setIsPaused(false)
  }

  const video: VideoItem = videos[currentIndex]

  return (
    <section className="py-16 md:py-24 bg-stone-50">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-4">
          Product Guides & Tips
        </h2>
        <p className="text-lg text-stone-600 mb-10">
          Learn how to get the best results from your feed and nutrition products
        </p>

        {/* Carousel */}
        <div
          className="relative bg-white rounded-xl shadow-md overflow-hidden"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Video Thumbnail */}
          <button
            onClick={() => setSelectedVideo(video.youtubeId)}
            className="relative w-full aspect-video group"
            type="button"
          >
            <img
              src={getYoutubeThumbnail(video.youtubeId, video.customThumbnail)}
              alt={video.name}
              className="w-full h-full object-cover"
              loading="lazy"
              onError={(e) => {
                const img = e.currentTarget
                // Try lower quality thumbnail as fallback
                if (!img.dataset.fallback) {
                  img.dataset.fallback = "true"
                  img.src = `https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`
                }
              }}
            />

            {/* ▶ Play Overlay */}
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition flex items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-white/90 flex items-center justify-center group-hover:scale-110 transition">
                <svg
                  className="w-10 h-10 text-emerald-700 ml-1"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          </button>

          <div className="p-6">
            <h3 className="text-lg font-semibold text-stone-900 mb-4">
              {video.name}
            </h3>

            <Button
              variant="outline"
              size="sm"
              className="border-emerald-700 text-emerald-700 hover:bg-emerald-50"
              asChild
            >
              <a href={video.href}>View Product</a>
            </Button>
          </div>

          {/* Arrows */}
          <button
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 rounded-full w-10 h-10 shadow hover:bg-white transition"
            type="button"
            aria-label="Previous video"
          >
            ‹
          </button>
          <button
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 rounded-full w-10 h-10 shadow hover:bg-white transition"
            type="button"
            aria-label="Next video"
          >
            ›
          </button>

          {/* ● Dot Indicators */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
            {videos.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`w-2.5 h-2.5 rounded-full transition ${
                  i === currentIndex
                    ? "bg-emerald-700"
                    : "bg-stone-300"
                }`}
                type="button"
                aria-label={`Show video ${i + 1}`}
              />
            ))}
          </div>
        </div>

        {/* 🧠 SEO fallback for no-JS */}
        <noscript>
          <div className="mt-6">
            <img
              src={`https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`}
              alt={video.name}
              className="mx-auto rounded-lg"
            />
            <p className="mt-2 text-stone-600">{video.name}</p>
          </div>
        </noscript>
      </div>

      {/* 🎬 YouTube modal (lazy-loaded on click) */}
      {selectedVideo && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedVideo(null)}
        >
          <div
            className="relative w-full max-w-4xl aspect-video"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute -top-10 right-0 text-white text-sm hover:text-gray-300 transition"
              onClick={() => setSelectedVideo(null)}
              type="button"
            >
              Close ✕
            </button>

            <iframe
              className="w-full h-full rounded-lg"
              src={`https://www.youtube.com/embed/${selectedVideo}?autoplay=1&rel=0`}
              title="Product video"
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}

    </section>
  )
}