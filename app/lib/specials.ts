// lib/specials.ts
export async function getMonthlySpecials() {
    const query = `
      {
        collectionByHandle(handle: "monthly-specials") {
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
                variants(first: 1) {
                  edges {
                    node {
                      compareAtPrice {
                        amount
                      }
                    }
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
  