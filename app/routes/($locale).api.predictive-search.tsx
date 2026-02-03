import type {Route} from './+types/api.predictive-search';
import {data} from 'react-router';

export async function loader({request, context}: Route.LoaderArgs) {
  const {storefront} = context;
  const url = new URL(request.url);
  const searchTerm = url.searchParams.get('q');

  if (!searchTerm) {
    return data({products: []});
  }

  try {
    const {predictiveSearch} = await storefront.query(PREDICTIVE_SEARCH_API_QUERY, {
      variables: {query: searchTerm, limit: 6},
    });

    const products = predictiveSearch?.products?.map((product: any) => ({
      id: product.id,
      title: product.title,
      url: `/products/${product.handle}`,
      image: product.featuredImage?.url || product.images?.nodes?.[0]?.url,
      price: product.priceRange?.minVariantPrice?.amount,
    })) || [];

    return data({products});
  } catch (error) {
    console.error('Predictive search error:', error);
    return data({products: []});
  }
}

const PREDICTIVE_SEARCH_API_QUERY = `#graphql
  query PredictiveSearchAPI($query: String!, $limit: Int!) {
    predictiveSearch(query: $query, limit: $limit, types: PRODUCT) {
      products {
        id
        title
        handle
        featuredImage {
          url
          altText
          width
          height
        }
        images(first: 1) {
          nodes {
            url
            altText
            width
            height
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
` as const;