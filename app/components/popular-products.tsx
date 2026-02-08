import {Link, useNavigation} from 'react-router';
import {Button} from '~/components/ui/button';
import useEmblaCarousel from 'embla-carousel-react';
import {Image} from '@shopify/hydrogen';
import {useEffect, useState, useRef} from 'react';

export function PopularProducts({products}: {products: any[]}) {
  const [mounted, setMounted] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const viewportRef = useRef<HTMLDivElement | null>(null);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    loop: false,
  });

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
    if (!mounted || !emblaApi || !isDesktop || !viewportRef.current) return;

    let interval: ReturnType<typeof setInterval> | null = null;

    const start = () => {
      if (interval) return;
      interval = setInterval(() => {
        emblaApi.canScrollNext()
          ? emblaApi.scrollNext()
          : emblaApi.scrollTo(0);
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
  }, [mounted, emblaApi, isDesktop]);

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

  // Don't render carousel until mounted on client
  if (!mounted) {
    return (
      <section id="popular-products" className="w-full py-16 md:py-24 bg-gray-50 relative">
        <div className="max-w-7xl mx-auto px-4 text-center mb-12">
          <h2  className="text-3xl md:text-4xl font-bold">Popular Products</h2>
          <p className="text-lg text-stone-600">
            Top-selling products in feeds & supplies
          </p>
        </div>
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {products.map((product) => {
              const variant = product.variants?.nodes?.[0];
              if (!variant?.id || !product.priceRange) return null;
              const price = Number(product.priceRange.minVariantPrice.amount);
              const compareAtAmount = product.compareAtPriceRange?.minVariantPrice?.amount;
              const compareAt = compareAtAmount && Number(compareAtAmount) > 0 ? Number(compareAtAmount) : null;
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
        </div>
      </section>
    );
  }

  return (
    <section id="popular-products" className="w-full py-16 md:py-24 bg-gray-50 relative">
      <div className="max-w-7xl mx-auto px-4 text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold">Popular Products</h2>
        <p className="text-lg text-stone-600">
          Top-selling products in feeds & supplies
        </p>
      </div>

      <div className="relative w-full">
        <div
          className="overflow-hidden"
          ref={(node) => {
            emblaRef(node);
            viewportRef.current = node;
          }}
        >
          <div className="flex">
            {products.map((product) => {
              const variant = product.variants?.nodes?.[0];
              
              if (!variant?.id || !product.priceRange) return null;

              const price = Number(product.priceRange.minVariantPrice.amount);
              const compareAtAmount = product.compareAtPriceRange?.minVariantPrice?.amount;
              const compareAt = compareAtAmount && Number(compareAtAmount) > 0 ? Number(compareAtAmount) : null;
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
        </div>

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
      <div className="border rounded-lg overflow-hidden h-full bg-white shadow-sm hover:shadow-md transition-shadow">
        <div className="flex flex-col h-full">
          <Link to={`/products/${product.handle}`}>
            {image ? (
              <Image
                data={image}
                aspectRatio="1/1"
                sizes="(min-width: 1024px) 16vw, (min-width: 768px) 33vw, 50vw"
                className="w-full object-cover"
                loading="eager"
              />
            ) : (
              <div className="w-full aspect-square bg-gray-200 flex items-center justify-center text-gray-400 text-xs">
                No Image
              </div>
            )}
          </Link>

          <div className="flex flex-col p-3 h-full">
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