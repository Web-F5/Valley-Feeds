// app/lib/shopify/pop-products-query.ts
import {flattenConnection} from '@shopify/hydrogen';

export async function getPopularProducts(storefront: any) {
  const query = `
    query PopularProducts($handle: String!) {
      collection(handle: $handle) {
        products(first: 10) {
          edges {
            node {
              id
              title
              handle
              priceRange {
                minVariantPrice {
                  amount
                  currencyCode
                }
              }
              compareAtPriceRange {
                minVariantPrice {
                  amount
                  currencyCode
                }
              }
              variants(first: 1) {
                nodes {
                  id
                  availableForSale
                  compareAtPrice {
                    amount
                    currencyCode
                  }
                  weight
                  weightUnit
                }
              }
              images(first: 1) {
                nodes {
                  id
                  url
                  altText
                  width
                  height
                }
              }
            }
          }
        }
      }
    }
  `;

  const response = await storefront.query(query, {
    variables: { handle: 'popular-products' }, 
    cache: storefront.CacheLong(),
  });

  return flattenConnection(response?.collection?.products || { edges: [] });
}