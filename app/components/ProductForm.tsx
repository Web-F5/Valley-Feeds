import {Link, useNavigate} from 'react-router';
import {type MappedProductOptions} from '@shopify/hydrogen';
import type {
  Maybe,
  ProductOptionValueSwatch,
} from '@shopify/hydrogen/storefront-api-types';
import {AddToCartButton} from './AddToCartButton';
import {useAside} from './Aside';
import type {ProductFragment} from 'storefrontapi.generated';

export function ProductForm({
  productOptions,
  selectedVariant,
}: {
  productOptions: MappedProductOptions[];
  selectedVariant: ProductFragment['selectedOrFirstAvailableVariant'];
}) {
  const navigate = useNavigate();
  const {open} = useAside();
  return (
    <div className="space-y-6">
      {productOptions.map((option) => {
        // If there is only a single value in the option values, don't display the option
        if (option.optionValues.length === 1) return null;

        return (
          <div className="space-y-3" key={option.name}>
            <h5 className="text-sm font-medium text-gray-900">{option.name}</h5>
            <div className="flex flex-wrap gap-2">
              {option.optionValues.map((value) => {
                const {
                  name,
                  handle,
                  variantUriQuery,
                  selected,
                  available,
                  exists,
                  isDifferentProduct,
                  swatch,
                } = value;

                if (isDifferentProduct) {
                  return (
                    <Link
                      className={`
                        px-4 py-2 text-sm font-medium rounded-md border transition-colors
                        ${selected 
                          ? 'bg-emerald-600 text-white border-emerald-600' 
                          : available 
                          ? 'bg-white text-gray-900 border-gray-300 hover:border-emerald-600' 
                          : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                        }
                      `}
                      key={option.name + name}
                      prefetch="intent"
                      preventScrollReset
                      replace
                      to={`/products/${handle}?${variantUriQuery}`}
                      style={!available ? {pointerEvents: 'none'} : {}}
                    >
                      <ProductOptionSwatch swatch={swatch} name={name} />
                    </Link>
                  );
                } else {
                  return (
                    <button
                      type="button"
                      className={`
                        px-4 py-2 text-sm font-medium rounded-md border transition-colors
                        ${selected 
                          ? 'bg-emerald-600 text-white border-emerald-600' 
                          : available 
                          ? 'bg-white text-gray-900 border-gray-300 hover:border-emerald-600' 
                          : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                        }
                      `}
                      key={option.name + name}
                      disabled={!exists}
                      onClick={() => {
                        if (!selected) {
                          void navigate(`?${variantUriQuery}`, {
                            replace: true,
                            preventScrollReset: true,
                          });
                        }
                      }}
                    >
                      <ProductOptionSwatch swatch={swatch} name={name} />
                    </button>
                  );
                }
              })}
            </div>
          </div>
        );
      })}
      
      <AddToCartButton
        disabled={!selectedVariant || !selectedVariant.availableForSale}
        onClick={() => {
          open('cart');
        }}
        lines={
          selectedVariant
            ? [
                {
                  merchandiseId: selectedVariant.id,
                  quantity: 1,
                },
              ]
            : []
        }
      >
        {selectedVariant?.availableForSale ? 'Add to cart' : 'Sold out'}
      </AddToCartButton>
    </div>
  );
}

function ProductOptionSwatch({
  swatch,
  name,
}: {
  swatch?: Maybe<ProductOptionValueSwatch> | undefined;
  name: string;
}) {
  const image = swatch?.image?.previewImage?.url;
  const color = swatch?.color;

  if (!image && !color) return name;

  return (
    <div
      aria-label={name}
      className="flex items-center justify-center"
      style={{
        backgroundColor: color || 'transparent',
        width: '100%',
        height: '100%',
      }}
    >
      {!!image && <img src={image} alt={name} className="w-full h-full object-cover" />}
    </div>
  );
}