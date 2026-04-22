import {useCallback, useEffect, useRef, useState} from 'react';
import {Image} from '@shopify/hydrogen';

// ─── Types ────────────────────────────────────────────────────────────────────

type ShopifyImage = {
  id?: string | null;
  url: string;
  altText?: string | null;
  width?: number | null;
  height?: number | null;
};

type MediaNode = {
  mediaContentType: string;
  embedUrl?: string;
  previewImage?: {url: string};
  sources?: {url: string; mimeType: string}[];
};

type GalleryItem =
  | {kind: 'image'; image: ShopifyImage}
  | {kind: 'youtube'; youtubeId: string; thumbnail: string; title: string}
  | {kind: 'shopify-video'; sources: {url: string; mimeType: string}[]; poster?: string};

type Props = {
  selectedImage?: ShopifyImage | null;
  images: ShopifyImage[];
  media?: {nodes: MediaNode[]};
  title: string;
};

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

function buildGalleryItems(
  images: ShopifyImage[],
  media?: {nodes: MediaNode[]},
): GalleryItem[] {
  const items: GalleryItem[] = images.map((image) => ({
    kind: 'image',
    image,
  }));

  if (!media?.nodes) return items;

  for (const node of media.nodes) {
    if (node.mediaContentType === 'EXTERNAL_VIDEO' && node.embedUrl) {
      const youtubeId = extractYoutubeId(node.embedUrl);
      if (!youtubeId) continue;
      items.push({
        kind: 'youtube',
        youtubeId,
        thumbnail:
          node.previewImage?.url ??
          `https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg`,
        title: 'Product video',
      });
    }

    if (node.mediaContentType === 'VIDEO' && node.sources?.length) {
      const mp4Sources = node.sources.filter((s) => s.mimeType === 'video/mp4');
      if (!mp4Sources.length) continue;
      items.push({
        kind: 'shopify-video',
        sources: mp4Sources,
        poster: node.previewImage?.url,
      });
    }
  }

  return items;
}

// ─── Main view renderer ───────────────────────────────────────────────────────

function MainView({item, title}: {item: GalleryItem; title: string}) {
  if (item.kind === 'image') {
    return (
      <Image
        data={item.image}
        alt={item.image.altText || title}
        className="w-full h-full object-contain"
        sizes="(min-width: 1024px) 50vw, 100vw"
      />
    );
  }

  if (item.kind === 'youtube') {
    return (
      <div className="w-full aspect-square flex items-center justify-center bg-black">
        <div className="w-full aspect-video">
          <iframe
            className="w-full h-full"
            src={`https://www.youtube.com/embed/${item.youtubeId}?rel=0`}
            title={item.title}
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    );
  }

  if (item.kind === 'shopify-video') {
    return (
      <div className="w-full aspect-square flex items-center justify-center bg-black">
        <div className="w-full aspect-video">
          <video
            className="w-full h-full"
            controls
            playsInline
            preload="metadata"
            poster={item.poster}
          >
            {item.sources.map((s) => (
              <source key={s.url} src={s.url} type="video/mp4" />
            ))}
            Your browser does not support HTML5 video.
          </video>
        </div>
      </div>
    );
  }

  return null;
}

// ─── Thumbnail ─────────────────────────────────────────────────────────────────

function Thumbnail({
  item,
  isActive,
  onClick,
  index,
}: {
  item: GalleryItem;
  isActive: boolean;
  onClick: () => void;
  index: number;
}) {
  const base =
    'relative flex-shrink-0 w-16 h-16 rounded-md overflow-hidden cursor-pointer transition-all duration-150 border-2';
  const active = 'border-emerald-600 shadow-md scale-105';
  const inactive = 'border-transparent hover:border-emerald-300 opacity-70 hover:opacity-100';

  if (item.kind === 'image') {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`${base} ${isActive ? active : inactive}`}
        aria-label={`View image ${index + 1}`}
      >
        <img
          src={item.image.url}
          alt={item.image.altText || `Product image ${index + 1}`}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </button>
    );
  }

  const thumbnailUrl =
    item.kind === 'youtube'
      ? item.thumbnail
      : item.kind === 'shopify-video'
      ? item.poster
      : undefined;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`${base} ${isActive ? active : inactive} bg-stone-100`}
      aria-label={`View video ${index + 1}`}
    >
      {thumbnailUrl ? (
        <img
          src={thumbnailUrl}
          alt="Video thumbnail"
          className="w-full h-full object-cover"
          loading="lazy"
        />
      ) : (
        <div className="w-full h-full bg-stone-200" />
      )}
      {/* Play icon overlay */}
      <div className="absolute inset-0 flex items-center justify-center bg-black/30">
        <div className="w-6 h-6 rounded-full bg-white/90 flex items-center justify-center">
          <svg className="w-3 h-3 text-emerald-700 ml-0.5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      </div>
    </button>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────

export function ProductImageGallery({selectedImage, images, media, title}: Props) {
  const items = buildGalleryItems(images, media);

  // Find the index of the selected variant image, default to 0
  const initialIndex = selectedImage
    ? Math.max(
        0,
        items.findIndex(
          (item) => item.kind === 'image' && item.image.url === selectedImage.url,
        ),
      )
    : 0;

  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const thumbStripRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);

  // When variant changes, update active image
  useEffect(() => {
    if (!selectedImage) return;
    const idx = items.findIndex(
      (item) => item.kind === 'image' && item.image.url === selectedImage.url,
    );
    if (idx >= 0) setActiveIndex(idx);
  }, [selectedImage?.url]);

  // Scroll active thumbnail into view
  useEffect(() => {
    const strip = thumbStripRef.current;
    if (!strip) return;
    const thumb = strip.children[activeIndex] as HTMLElement | undefined;
    if (thumb) {
      thumb.scrollIntoView({behavior: 'smooth', block: 'nearest', inline: 'center'});
    }
  }, [activeIndex]);

  const goTo = useCallback(
    (index: number) => {
      setActiveIndex((index + items.length) % items.length);
    },
    [items.length],
  );

  // Swipe handlers for main image
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (delta > 50) goTo(activeIndex - 1);
    if (delta < -50) goTo(activeIndex + 1);
    touchStartX.current = null;
  };

  if (!items.length) {
    return (
      <div className="w-full aspect-square bg-gray-200 flex items-center justify-center rounded-lg">
        <span className="text-gray-400">No image available</span>
      </div>
    );
  }

  const activeItem = items[activeIndex];

  return (
    <div className="flex flex-col gap-3">
      {/* Main image / video */}
      <div
        className="bg-white rounded-lg overflow-hidden shadow-sm flex items-center justify-center min-h-64 lg:min-h-96 select-none"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <MainView item={activeItem} title={title} />
      </div>

      {/* Thumbnail strip — only show if more than 1 item */}
      {items.length > 1 && (
        <div className="relative">
          {/* Left arrow */}
          <button
            type="button"
            onClick={() => {
              if (thumbStripRef.current) {
                thumbStripRef.current.scrollBy({left: -120, behavior: 'smooth'});
              }
            }}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-white shadow flex items-center justify-center text-stone-600 hover:bg-stone-50 transition"
            aria-label="Scroll thumbnails left"
          >
            ‹
          </button>

          {/* Scrollable strip */}
          <div
            ref={thumbStripRef}
            className="flex gap-2 overflow-x-auto scroll-smooth px-8 py-1 scrollbar-hide"
            style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}
          >
            {items.map((item, i) => (
              <Thumbnail
                key={i}
                item={item}
                index={i}
                isActive={i === activeIndex}
                onClick={() => goTo(i)}
              />
            ))}
          </div>

          {/* Right arrow */}
          <button
            type="button"
            onClick={() => {
              if (thumbStripRef.current) {
                thumbStripRef.current.scrollBy({left: 120, behavior: 'smooth'});
              }
            }}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-white shadow flex items-center justify-center text-stone-600 hover:bg-stone-50 transition"
            aria-label="Scroll thumbnails right"
          >
            ›
          </button>
        </div>
      )}

      {/* Mobile swipe indicator — only show if multiple items */}
      {items.length > 1 && (
        <div className="flex justify-center gap-1.5 sm:hidden">
          {items.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i)}
              className={`w-1.5 h-1.5 rounded-full transition-all ${
                i === activeIndex ? 'bg-emerald-600 w-3' : 'bg-stone-300'
              }`}
              aria-label={`Go to item ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}