type MediaNode = {
  mediaContentType: string
  embedUrl?: string
  previewImage?: {url: string}
  sources?: {url: string; mimeType: string}[]
}

type Props = {
  media: {nodes: MediaNode[]}
}

function extractYoutubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/(?:watch\?.*v=|embed\/|shorts\/))([A-Za-z0-9_-]{11})/,
    /(?:youtu\.be\/)([A-Za-z0-9_-]{11})/,
  ]
  for (const re of patterns) {
    const match = url.match(re)
    if (match) return match[1]
  }
  return null
}

export function ProductVideo({media}: Props) {
  const videoNode = media.nodes.find(
    (n) => n.mediaContentType === 'EXTERNAL_VIDEO' || n.mediaContentType === 'VIDEO'
  )

  if (!videoNode) return null

  // YouTube
  if (videoNode.mediaContentType === 'EXTERNAL_VIDEO' && videoNode.embedUrl) {
    const youtubeId = extractYoutubeId(videoNode.embedUrl)
    if (!youtubeId) return null

    return (
      <div className="mt-4 bg-white rounded-lg overflow-hidden shadow-sm">
        <div className="aspect-video">
          <iframe
            className="w-full h-full"
            src={`https://www.youtube.com/embed/${youtubeId}?rel=0`}
            title="Product video"
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    )
  }

  // Shopify-hosted
  if (videoNode.mediaContentType === 'VIDEO' && videoNode.sources?.length) {
    const mp4Sources = videoNode.sources.filter((s) => s.mimeType === 'video/mp4')
    if (!mp4Sources.length) return null

    return (
      <div className="mt-4 bg-white rounded-lg overflow-hidden shadow-sm">
        <div className="aspect-video">
          <video
            className="w-full h-full bg-black"
            controls
            playsInline
            preload="metadata"
            poster={videoNode.previewImage?.url}
          >
            {mp4Sources.map((s) => (
              <source key={s.url} src={s.url} type="video/mp4" />
            ))}
            Your browser does not support HTML5 video.
          </video>
        </div>
      </div>
    )
  }

  return null
}