import {Link} from 'react-router';
import {Image, Money} from '@shopify/hydrogen';
import type {ProductItemFragment} from 'storefrontapi.generated';
import {useState} from 'react';

const WEIGHT_LIMIT_KG = 22;

export function ProductItem({
  product,
  loading,
}: {
  product: ProductItemFragment;
  loading?: 'eager' | 'lazy';
}) {
  const [isAdding, setIsAdding] = useState(false);
  const compareAtPrice = product.compareAtPriceRange?.minVariantPrice;
  const price = product.priceRange.minVariantPrice;
  const hasDiscount = compareAtPrice && Number(compareAtPrice.amount) > Number(price.amount);

  // Get weight from first variant
  const variantWeight = product.variants?.nodes?.[0]?.weight;
  const weightUnit = product.variants?.nodes?.[0]?.weightUnit;
  
  // Convert to kg based on the unit
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

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsAdding(true);

    try {
      const response = await fetch('/cart-add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          merchandiseId: product.variants?.nodes?.[0]?.id,
          quantity: 1,
        }),
      });

      const result = await response.json() as {success: boolean; error?: string};

      if (result.success) {
        window.location.reload();
      } else {
        console.error('Failed to add to cart:', result.error);
        alert('Failed to add to cart. Please try again.');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add to cart. Please try again.');
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
      {/* Product Image - Link */}
      <Link to={`/products/${product.handle}`} className="block">
        <div className="aspect-square bg-gray-100 overflow-hidden">
          {product.featuredImage ? (
            <Image
              data={product.featuredImage}
              alt={product.featuredImage.altText || product.title}
              aspectRatio="1/1"
              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
              sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
              loading={loading}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              No image
            </div>
          )}
        </div>
      </Link>

      {/* Product Info - Flex column with spacing */}
      <div className="p-4 flex flex-col flex-grow">
        {/* Title - Link */}
        <Link to={`/products/${product.handle}`} className="block mb-auto">
          <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 group-hover:text-emerald-700 transition-colors">
            {product.title}
          </h3>
        </Link>

        {/* Heavy Item Warning */}
        {isOverWeightLimit && (
          <div className="mt-3 bg-amber-50 border border-amber-200 rounded-md p-3">
            <div className="flex items-start gap-2">
              <span className="text-amber-600 text-lg flex-shrink-0">⚠️</span>
              <div className="text-xs text-amber-800">
                <strong className="block mb-1">Heavy Item Shipping Notice</strong>
                <p><strong className="block mb-1">Local delivery is available within 100km of Katandra West.</strong></p>
                <p>As this item exceeds Aus Post's 22kg limit, or restricted via Aus Post rules.</p> 
                <p>Outside of this range will require you to arrange a courier.</p>
              </div>
            </div>
          </div>
        )}

        {/* Price and Button - Always at bottom */}
        <div className="mt-4">
          {/* Price */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg font-bold text-emerald-700">
              <Money data={price} />
            </span>
            {hasDiscount && (
              <span className="text-sm text-gray-400 line-through">
                <Money data={compareAtPrice} />
              </span>
            )}
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={isAdding}
            className="w-full bg-[#2092bb] hover:bg-[#1a7aa0] text-white font-medium py-2 px-4 rounded-md text-sm transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {isAdding ? 'Adding...' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
}