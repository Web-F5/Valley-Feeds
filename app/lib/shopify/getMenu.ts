export async function getMenu(handle: string) {
  const domain = process.env.SHOPIFY_STORE_DOMAIN
  const token = process.env.SHOPIFY_STOREFRONT_TOKEN

  if (!domain || !token) {
    console.error("❌ Missing Shopify env vars")
    return []
  }

  const res = await fetch(
    `https://${domain}/api/2024-04/graphql.json`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": token,
      },
      body: JSON.stringify({
        query: `
          query ($handle: String!) {
            menu(handle: $handle) {
              items {
                title
                url
                items {
                  title
                  url
                  items {
                    title
                    url
                  }
                }
              }
            }
          }
        `,
        variables: { handle },
      }),
      next: { revalidate: 3600 },
    }
  )

  const json = await res.json()

  if (!json.data?.menu) {
    console.warn(`⚠️ Shopify menu "${handle}" not found`)
    return []
  }

  return json.data.menu.items
}
