import {Link} from 'react-router';
import {Image, Money, Pagination} from '@shopify/hydrogen';
import {urlWithTrackingParams, type RegularSearchReturn} from '~/lib/search';
import {useState} from 'react';

type SearchItems = RegularSearchReturn['result']['items'];
type PartialSearchResult<ItemType extends keyof SearchItems> = Pick<
  SearchItems,
  ItemType
> &
  Pick<RegularSearchReturn, 'term'>;

type SearchResultsProps = RegularSearchReturn & {
  children: (args: SearchItems & {term: string}) => React.ReactNode;
};

export function SearchResults({
  term,
  result,
  children,
}: Omit<SearchResultsProps, 'error' | 'type'>) {
  if (!result?.total) {
    return null;
  }

  return children({...result.items, term});
}

SearchResults.Articles = SearchResultsArticles;
SearchResults.Pages = SearchResultsPages;
SearchResults.Products = SearchResultsProducts;
SearchResults.Empty = SearchResultsEmpty;

// ─── Products ────────────────────────────────────────────────────────────────

function SearchResultsProducts({
  term,
  products,
}: PartialSearchResult<'products'>) {
  if (!products?.nodes.length) {
    return null;
  }

  return (
    <section>
      <Pagination connection={products}>
        {({nodes, isLoading, NextLink, PreviousLink}) => (
          <div>
            {/* Load previous */}
            <div className="flex justify-center mb-6">
              <PreviousLink className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-stone-300 text-stone-600 text-sm font-medium hover:border-[#2092bb] hover:text-[#2092bb] transition">
                {isLoading ? (
                  <span className="animate-pulse">Loading…</span>
                ) : (
                  <>
                    <span>↑</span> Load previous
                  </>
                )}
              </PreviousLink>
            </div>

            {/* Product grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {nodes.map((product) => (
                <SearchProductCard key={product.id} product={product} term={term} />
              ))}
            </div>

            {/* Load more */}
            <div className="flex justify-center mt-8">
              <NextLink className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#2092bb] text-white text-sm font-semibold hover:bg-[#1a7aa0] transition shadow-sm">
                {isLoading ? (
                  <span className="animate-pulse">Loading…</span>
                ) : (
                  <>
                    Load more <span>↓</span>
                  </>
                )}
              </NextLink>
            </div>
          </div>
        )}
      </Pagination>
    </section>
  );
}

// ─── Product Card ─────────────────────────────────────────────────────────────

function SearchProductCard({product, term}: {product: any; term: string}) {
  const [showTooltip, setShowTooltip] = useState(false);

  const productUrl = urlWithTrackingParams({
    baseUrl: `/products/${product.handle}`,
    trackingParams: product.trackingParameters,
    term,
  });

  const variant = product?.selectedOrFirstAvailableVariant;
  const price = variant?.price;
  const image = variant?.image;

  // Weight calculation — same logic as popular-products.tsx
  const variantWeight = variant?.weight;
  const weightUnit = variant?.weightUnit;
  let weightInKg = 0;
  if (variantWeight && weightUnit) {
    if (weightUnit === 'KILOGRAMS') weightInKg = variantWeight;
    else if (weightUnit === 'GRAMS') weightInKg = variantWeight / 1000;
    else if (weightUnit === 'POUNDS') weightInKg = variantWeight * 0.453592;
    else if (weightUnit === 'OUNCES') weightInKg = variantWeight * 0.0283495;
  }
  const isOverWeightLimit = weightInKg > 22;

  return (
    <div className="group rounded-xl border border-stone-200 bg-white overflow-visible hover:shadow-lg hover:border-stone-300 transition-all duration-200">
      {/* Image */}
      <Link to={productUrl} prefetch="intent">
        <div className="aspect-square bg-stone-50 overflow-hidden rounded-t-xl">
          {image ? (
            <Image
              data={image}
              alt={product.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <svg
                className="w-12 h-12 text-stone-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}
        </div>
      </Link>

      {/* Details */}
      <div className="p-3 md:p-4">
        <Link to={productUrl} prefetch="intent">
          <p className="text-sm font-medium text-stone-800 leading-snug line-clamp-2 mb-1.5 group-hover:text-[#2092bb] transition-colors">
            {product.title}
          </p>
        </Link>

        {/* Price row + weight warning */}
        <div className="flex items-center gap-2">
          {price && (
            <p className="text-sm font-semibold text-emerald-700">
              <Money data={price} />
            </p>
          )}

          {isOverWeightLimit && (
            <div
              className="relative ml-auto"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              onClick={() => setShowTooltip(!showTooltip)}
            >
              <span className="text-amber-600 cursor-help text-lg">⚠️</span>

              {showTooltip && (
                <>
                  {/* Desktop tooltip */}
                  <div className="hidden md:block absolute bottom-full right-0 mb-2 w-48 bg-amber-50 border border-amber-200 rounded-md p-3 shadow-lg z-50">
                    <div className="text-xs text-amber-800">
                      <strong className="block mb-1 underline decoration-amber-600">Shipping Notice</strong>
                <p><strong className="block mb-1">Local delivery available within 100km of Katandra West only.</strong></p>
                <p>This item exceeds Aus Post's 22kg limit, or restricted via Aus Post rules.</p> 
                <p>Outside this range will require you to arrange a courier.</p>
                    </div>
                  </div>

                  {/* Mobile tooltip */}
                  <div className="md:hidden fixed left-1/2 -translate-x-1/2 bottom-20 w-[85vw] max-w-sm bg-amber-50 border border-amber-200 rounded-md p-3 shadow-lg z-50">
                    <div className="text-xs text-amber-800">
                      <strong className="block mb-1 underline decoration-amber-600">Shipping Notice</strong>
                <p><strong className="block mb-1">Local delivery available within 100km of Katandra West only.</strong></p>
                <p>This item exceeds Aus Post's 22kg limit, or restricted via Aus Post rules.</p> 
                <p>Outside this range will require you to arrange a courier.</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Articles ─────────────────────────────────────────────────────────────────

function SearchResultsArticles({
  term,
  articles,
}: PartialSearchResult<'articles'>) {
  if (!articles?.nodes.length) {
    return null;
  }

  return (
    <section className="mt-10">
      <h2 className="text-lg font-semibold text-stone-700 mb-3 pb-2 border-b border-stone-200">
        Articles
      </h2>
      <div className="flex flex-col gap-2">
        {articles.nodes.map((article) => {
          const articleUrl = urlWithTrackingParams({
            baseUrl: `/blogs/${article.handle}`,
            trackingParams: article.trackingParameters,
            term,
          });

          return (
            <Link
              key={article.id}
              prefetch="intent"
              to={articleUrl}
              className="flex items-center gap-2 px-4 py-3 rounded-lg bg-white border border-stone-200 hover:border-[#2092bb] hover:text-[#2092bb] text-stone-700 text-sm font-medium transition"
            >
              <svg
                className="w-4 h-4 flex-shrink-0 text-stone-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              {article.title}
            </Link>
          );
        })}
      </div>
    </section>
  );
}

// ─── Pages ────────────────────────────────────────────────────────────────────

function SearchResultsPages({term, pages}: PartialSearchResult<'pages'>) {
  if (!pages?.nodes.length) {
    return null;
  }

  return (
    <section className="mt-10">
      <h2 className="text-lg font-semibold text-stone-700 mb-3 pb-2 border-b border-stone-200">
        Pages
      </h2>
      <div className="flex flex-col gap-2">
        {pages.nodes.map((page) => {
          const pageUrl = urlWithTrackingParams({
            baseUrl: `/pages/${page.handle}`,
            trackingParams: page.trackingParameters,
            term,
          });

          return (
            <Link
              key={page.id}
              prefetch="intent"
              to={pageUrl}
              className="flex items-center gap-2 px-4 py-3 rounded-lg bg-white border border-stone-200 hover:border-[#2092bb] hover:text-[#2092bb] text-stone-700 text-sm font-medium transition"
            >
              <svg
                className="w-4 h-4 flex-shrink-0 text-stone-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                />
              </svg>
              {page.title}
            </Link>
          );
        })}
      </div>
    </section>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function SearchResultsEmpty() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center mb-4">
        <svg
          className="w-8 h-8 text-stone-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 100-15 7.5 7.5 0 000 15z"
          />
        </svg>
      </div>
      <p className="text-stone-700 font-semibold text-lg mb-1">No results found</p>
      <p className="text-stone-500 text-sm">
        Try a different search term or browse our categories.
      </p>
    </div>
  );
}