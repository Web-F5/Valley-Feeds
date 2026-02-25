import {Button} from '~/components/ui/button';
import {useEffect, useRef, useState, useMemo} from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

type VideoType = 'youtube' | 'shopify';

type VideoItem = {
  name: string;
  href: string;
  type: VideoType;
  // YouTube
  youtubeId?: string;
  youtubeThumbnail?: string;
  // Shopify-hosted
  videoSources?: {url: string; mimeType: string}[];
  shopifyThumbnail?: string;
};

// Matches the shape returned by getProductVideos() in your lib
export type ShopifyMediaNode = {
  mediaContentType: string;
  embedUrl?: string;
  previewImage?: {url: string};
  sources?: {url: string; mimeType: string}[];
};

export type ShopifyProductNode = {
  title: string;
  onlineStoreUrl?: string;
  handle: string;
  media: {nodes: ShopifyMediaNode[]};
};

type Props = {
  products: ShopifyProductNode[];
};

// ─── Constants ────────────────────────────────────────────────────────────────

const AUTO_ROTATE_MS = 6_000;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function extractYoutubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/(?:watch\?.*v=|embed\/|shorts\/))([A-Za-z0-9_-]{11})/,
    /(?:youtu\.be\/)([A-Za-z0-9_-]{11})/,
  ];
  for (const re of patterns) {
    const match = url.match(re);
    if (match) return match[1];
  }
  return null;
}

function getYoutubeThumbnail(youtubeId: string): string {
  return `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`;
}

function normaliseProducts(products: ShopifyProductNode[]): VideoItem[] {
  console.log('normaliseProducts received:', products?.length, 'products')
  const items: VideoItem[] = [];
  
  for (const product of products) {
    console.log('Processing:', product.title)
    const productUrl =
      product.onlineStoreUrl ?? `/products/${product.handle}`;

    for (const media of product.media?.nodes ?? []) {
      console.log('  media type:', media.mediaContentType)
      if (media.mediaContentType === 'EXTERNAL_VIDEO') {
        console.log('  → VIDEO found, sources:', media.sources?.length)
        const youtubeId = extractYoutubeId(media.embedUrl ?? '');
        if (!youtubeId) continue;
        items.push({
          name: product.title,
          href: productUrl,
          type: 'youtube',
          youtubeId,
          youtubeThumbnail:
            media.previewImage?.url ?? getYoutubeThumbnail(youtubeId),
        });
        break;
      }

      if (media.mediaContentType === 'VIDEO') {
        if (!media.sources?.length) continue;
        items.push({
          name: product.title,
          href: productUrl,
          type: 'shopify',
          videoSources: media.sources,
          shopifyThumbnail: media.previewImage?.url,
        });
        break;
      }
    }
  }

  return items;
}

// ─── VideoPlayer ──────────────────────────────────────────────────────────────

function VideoPlayer({item}: {item: VideoItem}) {
  if (item.type === 'youtube' && item.youtubeId) {
    return (
      <iframe
        className="w-full h-full rounded-lg"
        src={`https://www.youtube.com/embed/${item.youtubeId}?autoplay=1&rel=0`}
        title={item.name}
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    );
  }

  if (item.type === 'shopify' && item.videoSources?.length) {
    // Filter to MP4 only — skip HLS (.m3u8) which only Safari supports natively
    const mp4Sources = item.videoSources.filter((s) => s.mimeType === 'video/mp4')
    
    return (
      <video
        className="w-full h-full rounded-lg bg-black"
        controls
        autoPlay
        playsInline
        preload="metadata"
      >
        {mp4Sources.map((s) => (
          <source key={s.url} src={s.url} type="video/mp4" />
        ))}
        Your browser does not support HTML5 video.
      </video>
    )
  }

  return null;
}

// ─── Main Carousel ────────────────────────────────────────────────────────────

export function ProductVideoCarousel({products}: Props) {
  const videos = useMemo(() => normaliseProducts(products), [products])

  const [currentIndex, setCurrentIndex] = useState(() =>
    videos.length > 0 ? Math.floor(Math.random() * videos.length) : 0,
  );
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  const startX = useRef<number | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Auto-rotate
  useEffect(() => {
    if (!videos.length || isPaused) return;

    intervalRef.current = setInterval(() => {
      setCurrentIndex((i) => (i + 1) % videos.length);
    }, AUTO_ROTATE_MS);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [videos.length, isPaused]);

  const next = () => setCurrentIndex((i) => (i + 1) % videos.length);
  const prev = () =>
    setCurrentIndex((i) => (i === 0 ? videos.length - 1 : i - 1));

  const onTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
    setIsPaused(true);
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (startX.current === null) return;
    const delta = e.changedTouches[0].clientX - startX.current;
    if (delta > 60) prev();
    if (delta < -60) next();
    startX.current = null;
    setIsPaused(false);
  };

  // ── Empty state ────────────────────────────────────────────────────────────
  if (!videos.length) {
    return (
      <section className="py-16 md:py-24 bg-stone-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-stone-500">No product videos found.</p>
        </div>
      </section>
    );
  }

  const video = videos[currentIndex];
  const thumbnail =
    video.type === 'youtube'
      ? (video.youtubeThumbnail ?? getYoutubeThumbnail(video.youtubeId!))
      : video.shopifyThumbnail;

  return (
    <section className="py-16 md:py-24 bg-stone-50">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-4">
          Product Guides &amp; Tips
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
          {/* Thumbnail / Play button */}
          <button
            onClick={() => setSelectedVideo(video)}
            className="relative w-full aspect-video group"
            type="button"
            aria-label={`Play video: ${video.name}`}
          >
            {thumbnail ? (
              <img
                key={thumbnail}
                src={thumbnail}
                alt={video.name}
                className="w-full h-full object-cover"
                loading="lazy"
                onError={(e) => {
                  if (
                    video.type === 'youtube' &&
                    video.youtubeId &&
                    !e.currentTarget.dataset.fallback
                  ) {
                    e.currentTarget.dataset.fallback = 'true';
                    e.currentTarget.src = `https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`;
                  }
                }}
              />
            ) : (
              <div className="w-full h-full bg-stone-200 flex items-center justify-center">
                <svg
                  className="w-16 h-16 text-stone-400"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            )}

            {/* Play overlay */}
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

            {/* Video type badge */}
            <span className="absolute top-3 right-3 text-xs font-medium bg-black/60 text-white rounded px-2 py-0.5">
              {video.type === 'youtube' ? 'YouTube' : 'Video'}
            </span>
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

          {/* Prev / Next arrows */}
          <button
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 rounded-full w-10 h-10 shadow hover:bg-white transition text-xl"
            type="button"
            aria-label="Previous video"
          >
            ‹
          </button>
          <button
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 rounded-full w-10 h-10 shadow hover:bg-white transition text-xl"
            type="button"
            aria-label="Next video"
          >
            ›
          </button>

          {/* Dot indicators */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
            {videos.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`w-2.5 h-2.5 rounded-full transition ${
                  i === currentIndex ? 'bg-emerald-700' : 'bg-stone-300'
                }`}
                type="button"
                aria-label={`Show video ${i + 1}`}
              />
            ))}
          </div>
        </div>

        {/* SEO / no-JS fallback */}
        <noscript>
          <div className="mt-6">
            {thumbnail && (
              <img
                src={thumbnail}
                alt={video.name}
                className="mx-auto rounded-lg"
              />
            )}
            <p className="mt-2 text-stone-600">{video.name}</p>
          </div>
        </noscript>
      </div>

      {/* Lightbox modal */}
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
            <VideoPlayer item={selectedVideo} />
          </div>
        </div>
      )}
    </section>
  );
}