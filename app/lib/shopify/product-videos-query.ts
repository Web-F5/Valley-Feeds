const COLLECTION_VIDEOS_QUERY = `#graphql
  query CollectionVideos {
    collection(handle: "products-with-videos") {
      products(first: 50) {
        nodes {
          title
          onlineStoreUrl
          handle
          media(first: 10) {
            nodes {
              mediaContentType
              ... on ExternalVideo {
                embedUrl
                previewImage { url }
              }
              ... on Video {
                sources { url mimeType }
                previewImage { url }
              }
            }
          }
        }
      }
    }
  }
` as const

export type ShopifyMediaNode = {
  mediaContentType: string
  embedUrl?: string
  previewImage?: { url: string }
  sources?: { url: string; mimeType: string }[]
}

export type ShopifyProductNode = {
  title: string
  onlineStoreUrl?: string
  handle: string
  media: { nodes: ShopifyMediaNode[] }
}

export async function getProductVideos(storefront: any): Promise<ShopifyProductNode[]> {
  const {collection} = await storefront.query(COLLECTION_VIDEOS_QUERY)
  console.log('Collection result:', JSON.stringify(collection, null, 2))
  const nodes = collection?.products?.nodes ?? []
  return JSON.parse(JSON.stringify(nodes)) as ShopifyProductNode[]
}