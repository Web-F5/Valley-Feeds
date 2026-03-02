// app/components/monthly-specials.tsx - DIRECT API CALLS
import {Link, useNavigation} from 'react-router';
import {Image} from '@shopify/hydrogen';
import {Button} from '~/components/ui/button';
import useEmblaCarousel from 'embla-carousel-react';
import {useEffect, useState, useRef} from 'react';

export function MonthlySpecials({products}: {products: any[]}) {
  const [mounted, setMounted] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const viewportRef = useRef<HTMLDivElement | null>(null);
  const [emblaRef, emblaApi] = useEmblaCarousel({align: 'start', loop: false});

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const mq = window.matchMedia('(min-width: 1024px)');
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, [mounted]);

  useEffect(() => {
    if (!emblaApi || !isDesktop || !mounted || !viewportRef.current) return;

    let interval: ReturnType<typeof setInterval> | null = null;

    const start = () => {
      if (interval) return;
      interval = setInterval(() => {
        if (emblaApi.canScrollNext()) emblaApi.scrollNext();
        else emblaApi.scrollTo(0);
      }, 4000);
    };

    const stop = () => {
      if (!interval) return;
      clearInterval(interval);
      interval = null;
    };

    const timeout = setTimeout(() => start(), 1000);

    emblaApi.on('pointerDown', stop);
    emblaApi.on('pointerUp', start);

    const viewport = viewportRef.current;
    viewport.addEventListener('mouseenter', stop);
    viewport.addEventListener('mouseleave', start);

    return () => {
      clearTimeout(timeout);
      stop();
      viewport.removeEventListener('mouseenter', stop);
      viewport.removeEventListener('mouseleave', start);
    };
  }, [emblaApi, isDesktop, mounted]);

  useEffect(() => {
    if (!emblaApi) return;
    const updateButtons = () => {
      setCanScrollPrev(emblaApi.canScrollPrev());
      setCanScrollNext(emblaApi.canScrollNext());
    };
    updateButtons();
    emblaApi.on('select', updateButtons);
    emblaApi.on('reInit', updateButtons);
  }, [emblaApi]);

  if (!products || products.length === 0) {
    return (
      <section className="w-full py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Monthly Specials</h2>
          <p className="text-lg text-stone-600 mb-8">
            Limited-time offers on top feeds & supplies
          </p>
          <div className="text-amber-600 p-4 bg-amber-50 rounded">
            No monthly specials available at the moment.
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full py-16 md:py-24 pb-8 bg-gray-50 relative">
      <div className="max-w-7xl mx-auto px-4 text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold">Monthly Specials</h2>
        <p className="text-lg text-stone-600">
          Limited-time offers on top feeds & supplies
        </p>
      </div>

      <div
        className="overflow-hidden w-full relative"
        ref={(node) => {
          emblaRef(node);
          viewportRef.current = node;
        }}
      >
        <div className="flex gap-6">
          {products.map((product) => {
            const variant = product.variants?.nodes?.[0];
            
            if (!variant?.id || !product.priceRange) return null;

            const price = Number(product.priceRange.minVariantPrice.amount);
                       
            const compareAt = Number(
              product.compareAtPriceRange?.minVariantPrice?.amount || 
              variant.compareAtPrice?.amount || 
              0
            );

            const image = product.images?.nodes?.[0];

            return (
              <ProductCard
                key={product.id}
                product={product}
                variant={variant}
                price={price}
                compareAt={compareAt}
                image={image}
              />
            );
          })}
        </div>

        <div className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-gray-50 to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-gray-50 to-transparent" />

        <button
          onClick={() => emblaApi?.scrollPrev()}
          disabled={!canScrollPrev}
          suppressHydrationWarning
          className="absolute left-0 top-1/2 -translate-y-1/2 bg-white shadow rounded-full w-10 h-10 flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed z-10"
          aria-label="Previous"
        >
          ‹
        </button>
        <button
          onClick={() => emblaApi?.scrollNext()}
          disabled={!canScrollNext}
          suppressHydrationWarning
          className="absolute right-0 top-1/2 -translate-y-1/2 bg-white shadow rounded-full w-10 h-10 flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed z-10"
          aria-label="Next"
        >
          ›
        </button>
      </div>
    </section>
  );
}

function ProductCard({product, variant, price, compareAt, image}: any) {
  const [isAdding, setIsAdding] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  // Get weight - the variant is already extracted from edges/nodes
  const variantWeight = variant?.weight;
  const weightUnit = variant?.weightUnit;
  
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
  
  const isOverWeightLimit = weightInKg > 22;

  const handleAddToCart = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAdding(true);

    try {
      const response = await fetch('/cart-add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          merchandiseId: variant.id,
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
  <div className="flex-shrink-0 w-1/2 md:w-1/3 lg:w-1/6 px-3">
    <div className="border rounded-lg overflow-visible h-full bg-white shadow-sm hover:shadow-md transition-shadow relative">
      <div className="flex flex-col h-full">
        {/* Image Link */}
        <Link to={`/products/${product.handle}`}>
          {image ? (
            <Image
              data={image}
              aspectRatio="1/1"
              sizes="(min-width: 1024px) 16vw, (min-width: 768px) 33vw, 50vw"
              className="w-full object-cover rounded-t-lg"
              loading="eager"
            />
          ) : (
            <div className="w-full aspect-square bg-gray-200 flex items-center justify-center text-gray-400 text-xs">
              No Image
            </div>
          )}
        </Link>

        <div className="flex flex-col p-3 h-full">
          {/* Title Link */}
          <Link to={`/products/${product.handle}`}>
            <h3 className="text-sm font-semibold line-clamp-2 mb-2 hover:text-emerald-700">
              {product.title}
            </h3>
          </Link>

          <div className="mt-auto">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-emerald-700 font-bold text-base">
                {new Intl.NumberFormat('en-AU', {
                  style: 'currency',
                  currency: 'AUD',
                }).format(price)}
              </span>
              {compareAt && compareAt > price && (
                <span className="text-sm text-gray-400 line-through">
                  {new Intl.NumberFormat('en-AU', {
                    style: 'currency',
                    currency: 'AUD',
                  }).format(compareAt)}
                </span>
              )}
              
              {/* Weight Warning Icon with Tooltip */}
                {isOverWeightLimit && (
                  <div 
                    className="relative ml-auto group"
                    onMouseEnter={() => setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}
                    onClick={() => setShowTooltip(!showTooltip)}
                  >
                    <span className="text-amber-600 cursor-help text-lg">⚠️</span>
                    
                    {showTooltip && (
                      <>
                        {/* Desktop tooltip - right aligned */}
                        <div className="hidden md:block absolute bottom-full right-0 mb-2 w-48 bg-amber-50 border border-amber-200 rounded-md p-3 shadow-lg z-50">
                          <div className="text-xs text-amber-800">
                            <strong className="block mb-1 underline decoration-amber-600">Shipping Notice</strong>
                <p><strong className="block mb-1">Local delivery available within 100km of Katandra West.</strong></p>
                <p>This item exceeds Aus Post's 22kg limit, or restricted via Aus Post rules.</p> 
                <p>Outside this range will require you to arrange a courier.</p>
                          </div>
                        </div>
                        
                        {/* Mobile tooltip - centered above card */}
                        <div className="md:hidden fixed left-1/2 -translate-x-1/2 bottom-20 w-[85vw] max-w-sm bg-amber-50 border border-amber-200 rounded-md p-3 shadow-lg z-50">
                          <div className="text-xs text-amber-800">
                            <strong className="block mb-1 underline decoration-amber-600">Shipping Notice</strong>
                <p><strong className="block mb-1">Local delivery available within 100km of Katandra West.</strong></p>
                <p>This item exceeds Aus Post's 22kg limit, or restricted via Aus Post rules.</p> 
                <p>Outside this range will require you to arrange a courier.</p>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )}
            </div>

            <form onSubmit={handleAddToCart}>
              <Button
                type="submit"
                size="sm"
                className="w-full"
                disabled={isAdding}
              >
                {isAdding ? 'Adding...' : 'Add to Cart'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
);
}