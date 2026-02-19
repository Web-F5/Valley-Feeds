// app/lib/shopify/queries.ts - COMPLETE VERSION FOR OPTIMISTIC CART
import {flattenConnection} from '@shopify/hydrogen';

export async function getMonthlySpecials(storefront: any) {
  const query = `
    query MonthlySpecials($handle: String!) {
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

              # ✅ ALL variant fields needed for optimistic cart
              variants(first: 1) {
                nodes {
                  id
                  title
                  availableForSale
                  price {
                    amount
                    currencyCode
                  }
                  compareAtPrice {
                    amount
                    currencyCode
                  }
                  selectedOptions {
                    name
                    value
                  }
                  weight
                  weightUnit
                  # Add product reference for the variant
                  product {
                    id
                    title
                    handle
                  }
                  # Add image if variant has one
                  image {
                    id
                    url
                    altText
                    width
                    height
                  }
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
    variables: { handle: 'monthly-specials' },
    cache: storefront.CacheLong(),
  });

  return flattenConnection(response?.collection?.products || { edges: [] });
}