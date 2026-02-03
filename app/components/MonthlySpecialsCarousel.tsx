"use client";
import {useEffect, useState, useCallback} from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import {Link} from 'react-router';
import {Image} from '@shopify/hydrogen';
import {Button} from '~/components/ui/button';

export function MonthlySpecialsCarousel({products}: {products: any[]}) {
  const [mounted, setMounted] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const [emblaRef, emblaApi] = useEmblaCarousel({align: 'start', loop: false});

  useEffect(() => {
    setMounted(true);
    const mq = window.matchMedia('(min-width: 1024px)');
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('init', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('init', onSelect);
    };
  }, [emblaApi, onSelect]);

  if (!mounted) return null;

  // Mobile: simple grid
  if (!isDesktop) {
    return (
      <div className="grid grid-cols-2 gap-3 px-4">
        {products.map((product: any) => (
          <SpecialCard key={product.id} product={product} />
        ))}
      </div>
    );
  }

  // Desktop: Embla carousel
  return (
    <div className="relative">
      <div ref={emblaRef} className="overflow-hidden">
        <div className="flex gap-4">
          {products.map((product: any) => (
            <div key={product.id} className="flex-shrink-0 w-64">
              <SpecialCard product={product} />
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-center gap-2 mt-4">
        <Button
          variant="outline"
          onClick={() => emblaApi?.scrollPrev()}
          disabled={!canScrollPrev}
        >
          ←
        </Button>
        <Button
          variant="outline"
          onClick={() => emblaApi?.scrollNext()}
          disabled={!canScrollNext}
        >
          →
        </Button>
      </div>
    </div>
  );
}

function SpecialCard({product}: {product: any}) {
  return (
    <Link
      to={`/products/${product.handle}`}
      className="block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-amber-200"
    >
      {product.featuredImage && (
        <div className="w-full aspect-square overflow-hidden">
          <Image
            data={product.featuredImage}
            sizes="256px"
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="p-3 bg-amber-50">
        <span className="text-xs font-bold text-amber-700 uppercase">Special</span>
        <h3 className="text-sm font-semibold text-stone-800 truncate mt-1">{product.title}</h3>
        <p className="text-sm text-stone-600 mt-1">
          A${Number(product.priceRange?.minVariantPrice?.amount).toFixed(2)}
        </p>
      </div>
    </Link>
  );
}