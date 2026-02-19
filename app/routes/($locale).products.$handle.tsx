import {redirect, useLoaderData} from 'react-router';
import type {Route} from './+types/products.$handle';
import {
  getSelectedProductOptions,
  Analytics,
  useOptimisticVariant,
  getProductOptions,
  getAdjacentAndFirstAvailableVariants,
  useSelectedOptionInUrlParam,
  Image,
} from '@shopify/hydrogen';
import {ProductPrice} from '~/components/ProductPrice';
import {ProductForm} from '~/components/ProductForm';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';

export const meta: Route.MetaFunction = ({data}: Route.MetaArgs) => {
  return [
    {title: `${data?.product.title ?? ''} | Valley Feeds & General`},
    {
      rel: 'canonical',
      href: `/products/${data?.product.handle}`,
    },
    {
      name: 'description',
      content: data?.product.description || '',
    },
  ];
};

export async function loader(args: Route.LoaderArgs) {
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);
  return {...deferredData, ...criticalData};
}

async function loadCriticalData({context, params, request}: Route.LoaderArgs) {
  const {handle} = params;
  const {storefront} = context;

  if (!handle) {
    throw new Error('Expected product handle to be defined');
  }

  const [{product}] = await Promise.all([
    storefront.query(PRODUCT_QUERY, {
      variables: {handle, selectedOptions: getSelectedProductOptions(request)},
    }),
  ]);

  if (!product?.id) {
    throw new Response(null, {status: 404});
  }

  redirectIfHandleIsLocalized(request, {handle, data: product});

  return {product};
}

function loadDeferredData({context, params}: Route.LoaderArgs) {
  return {};
}

export default function Product() {
  const {product} = useLoaderData<typeof loader>();

  const selectedVariant = useOptimisticVariant(
    product.selectedOrFirstAvailableVariant,
    getAdjacentAndFirstAvailableVariants(product),
  );

  useSelectedOptionInUrlParam(selectedVariant.selectedOptions);

  const productOptions = getProductOptions({
    ...product,
    selectedOrFirstAvailableVariant: selectedVariant,
  });

  const {title, descriptionHtml, vendor} = product;

  // Calculate weight
  const WEIGHT_LIMIT_KG = 22;
  const variantWeight = selectedVariant?.weight;
  const weightUnit = selectedVariant?.weightUnit;
  
  let weightInKg = 0;
  if (variantWeight && weightUnit) {
    if (weightUnit === 'KILOGRAMS') {
      weightInKg = variantWeight;
    } else if (weightUnit === 'GRAMS') {
      weightInKg = variantWeight / 1000;
    } else if (weightUnit === 'POUNDS') {
      weightInKg = variantWeight * 0.453592;
    } else if (weightUnit === 'OUNCES') {
      weightInKg = variantWeight * 0.0283495;
    }
  }
  
  const isOverWeightLimit = weightInKg > WEIGHT_LIMIT_KG;

  console.log('Product Page:', title, 'Weight:', variantWeight, weightUnit, 'KG:', weightInKg);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Product Image */}
        <div className="lg:sticky lg:top-8 h-fit">
          <div className="bg-white rounded-lg overflow-hidden shadow-sm">
            {selectedVariant?.image ? (
              <Image
                data={selectedVariant.image}
                alt={selectedVariant.image.altText || title}
                aspectRatio="1/1"
                className="w-full object-contain"
                sizes="(min-width: 1024px) 50vw, 100vw"
              />
            ) : (
              <div className="w-full aspect-square bg-gray-200 flex items-center justify-center">
                <span className="text-gray-400">No image available</span>
              </div>
            )}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          {/* Vendor */}
          {vendor && (
            <p className="text-sm text-gray-600 uppercase tracking-wide">
              {vendor}
            </p>
          )}

          {/* Title */}
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
            {title}
          </h1>

          {/* Price */}
          <div className="border-t border-b border-gray-200 py-6">
            <ProductPrice
              price={selectedVariant?.price}
              compareAtPrice={selectedVariant?.compareAtPrice}
            />
          </div>

          {/* Heavy Item Warning - ADD THIS */}
          {isOverWeightLimit && (
            <div className="bg-amber-50 border border-amber-200 rounded-md p-4">
              <div className="flex items-start gap-3">
                <span className="text-amber-600 text-2xl flex-shrink-0">⚠️</span>
                <div className="text-sm text-amber-800">
                  <strong className="block mb-1 text-base">Heavy Item Shipping Notice</strong>
                  <p>This item exceeds Australia Post's 22kg limit, or restricted via Australia Post rules.</p> 
                  <p>Local delivery is available within 100km of Katandra West.</p>
                  <p>Outside of this range will require you to arrange a courier.</p>
                </div>
              </div>
            </div>
          )}

          {/* Product Form (Variants & Add to Cart) */}
          <ProductForm
            productOptions={productOptions}
            selectedVariant={selectedVariant}
          />

          {/* Availability */}
          <div className="flex items-center gap-2">
            {selectedVariant?.availableForSale ? (
              <>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">In Stock</span>
              </>
            ) : (
              <>
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Out of Stock</span>
              </>
            )}
          </div>

          {/* SKU */}
          {selectedVariant?.sku && (
            <p className="text-sm text-gray-500">
              SKU: {selectedVariant.sku}
            </p>
          )}

          {/* Description */}
          {descriptionHtml && (
            <div className="border-t border-gray-200 pt-6">
              <h2 className="text-xl font-semibold mb-4">Description</h2>
              <div
                className="prose prose-sm max-w-none text-gray-700"
                dangerouslySetInnerHTML={{__html: descriptionHtml}}
              />
            </div>
          )}
        </div>
      </div>

      <Analytics.ProductView
        data={{
          products: [
            {
              id: product.id,
              title: product.title,
              price: selectedVariant?.price.amount || '0',
              vendor: product.vendor,
              variantId: selectedVariant?.id || '',
              variantTitle: selectedVariant?.title || '',
              quantity: 1,
            },
          ],
        }}
      />
    </div>
  );
}

const PRODUCT_VARIANT_FRAGMENT = `#graphql
  fragment ProductVariant on ProductVariant {
    availableForSale
    compareAtPrice {
      amount
      currencyCode
    }
    id
    image {
      __typename
      id
      url
      altText
      width
      height
    }
    price {
      amount
      currencyCode
    }
    product {
      title
      handle
    }
    selectedOptions {
      name
      value
    }
    sku
    title
    unitPrice {
      amount
      currencyCode
    }
    weight
    weightUnit
  }
` as const;

const PRODUCT_FRAGMENT = `#graphql
  fragment Product on Product {
    id
    title
    vendor
    handle
    descriptionHtml
    description
    encodedVariantExistence
    encodedVariantAvailability
    options {
      name
      optionValues {
        name
        firstSelectableVariant {
          ...ProductVariant
        }
        swatch {
          color
          image {
            previewImage {
              url
            }
          }
        }
      }
    }
    selectedOrFirstAvailableVariant(selectedOptions: $selectedOptions, ignoreUnknownOptions: true, caseInsensitiveMatch: true) {
      ...ProductVariant
    }
    adjacentVariants (selectedOptions: $selectedOptions) {
      ...ProductVariant
    }
    seo {
      description
      title
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
` as const;

const PRODUCT_QUERY = `#graphql
  query Product(
    $country: CountryCode
    $handle: String!
    $language: LanguageCode
    $selectedOptions: [SelectedOptionInput!]!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ...Product
    }
  }
  ${PRODUCT_FRAGMENT}
` as const;