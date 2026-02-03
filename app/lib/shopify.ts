// lib/shopify.ts
export async function getPopularProducts() {
    const query = `
      {
        collectionByHandle(handle: "popular-products") {
          products(first: 6) {
            edges {
              node {
                id
                title
                handle
                images(first: 1) {
                  edges {
                    node {
                      url
                      altText
                    }
                  }
                }
                priceRange {
                  minVariantPrice {
                    amount
                    currencyCode
                  }
                }
              }
            }
          }
        }
      }
    `
  
    const res = await fetch(
      `https://${process.env.SHOPIFY_STORE_DOMAIN}/api/2024-01/graphql.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Storefront-Access-Token":
            process.env.SHOPIFY_STOREFRONT_TOKEN!,
        },
        body: JSON.stringify({ query }),
        next: { revalidate: 3600 }, // optional ISR
      }
    )
  
    const json = await res.json()
    return json.data.collectionByHandle.products.edges
  }
  