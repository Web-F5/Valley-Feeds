import {Await, Link} from 'react-router';
import {Suspense, useId} from 'react';
import type {
  CartApiQueryFragment,
  FooterQuery,
  HeaderQuery,
} from 'storefrontapi.generated';
import {useRouteLoaderData} from 'react-router';
import type {RootLoader} from '~/root';
import {Aside} from '~/components/Aside';
import {Footer} from '~/components/Footer';
import {Header} from '~/components/Header';
import {CartMain} from '~/components/CartMain';
import {
  SEARCH_ENDPOINT,
  SearchFormPredictive,
} from '~/components/SearchFormPredictive';
import {SearchResultsPredictive} from '~/components/SearchResultsPredictive';

interface PageLayoutProps {
  footer: Promise<FooterQuery | null>;
  header: HeaderQuery;
  isLoggedIn: Promise<boolean>;
  publicStoreDomain: string;
  children?: React.ReactNode;
}

export function PageLayout({
  children = null,
  footer,
  header,
  isLoggedIn,
  publicStoreDomain,
}: PageLayoutProps) {
  // ✅ Get cart data directly from root loader - this updates automatically
  const rootData = useRouteLoaderData<RootLoader>('root');
  const cart = rootData?.cart ?? null;

  return (
    <Aside.Provider>
      {/* ✅ Now CartAside gets fresh cart data on every revalidation */}
      <CartAside cart={cart} />
      <SearchAside />
      <Suspense fallback={null}>
        {/* Only await isLoggedIn since cart is already resolved */}
        <Await resolve={isLoggedIn}>
          {(resolvedIsLoggedIn) =>
            header && (
              <Header
                header={header}
                cart={cart} // ✅ Use cart directly - it's already resolved
                isLoggedIn={resolvedIsLoggedIn}
                publicStoreDomain={publicStoreDomain}
              />
            )
          }
        </Await>
      </Suspense>
      <main>{children}</main>
      
    </Aside.Provider>
  );
}

import type {CartMainProps} from '~/components/CartMain';

function CartAside({cart}: {cart: CartMainProps['cart']}) {
  return (
    <Aside type="cart" heading="Cart">
      <CartMain 
        layout="aside" 
        cart={cart} 
        key={cart?.id + (cart?.totalQuantity?.toString() || '0')} 
      />
    </Aside>
  );
}

function SearchAside() {
  const queriesDatalistId = useId();
  return (
    <Aside type="search" heading="SEARCH">
      <div className="predictive-search">
        <br />
        <SearchFormPredictive>
          {({fetchResults, goToSearch, inputRef}) => (
            <>
              <input
                name="q"
                onChange={fetchResults}
                onFocus={fetchResults}
                placeholder="Search"
                ref={inputRef}
                type="search"
                list={queriesDatalistId}
              />
              &nbsp;
              <button onClick={goToSearch}>Search</button>
            </>
          )}
        </SearchFormPredictive>

        <SearchResultsPredictive>
          {({items, total, term, state, closeSearch}) => {
            const {articles, collections, pages, products, queries} = items;

            if (state === 'loading' && term.current) {
              return <div>Loading...</div>;
            }

            if (!total) {
              return <SearchResultsPredictive.Empty term={term} />;
            }

            return (
              <>
                <SearchResultsPredictive.Queries
                  queries={queries}
                  queriesDatalistId={queriesDatalistId}
                />
                <SearchResultsPredictive.Products
                  products={products}
                  closeSearch={closeSearch}
                  term={term}
                />
                <SearchResultsPredictive.Collections
                  collections={collections}
                  closeSearch={closeSearch}
                  term={term}
                />
                <SearchResultsPredictive.Pages
                  pages={pages}
                  closeSearch={closeSearch}
                  term={term}
                />
                <SearchResultsPredictive.Articles
                  articles={articles}
                  closeSearch={closeSearch}
                  term={term}
                />
                {term.current && total ? (
                  <Link
                    onClick={closeSearch}
                    to={`${SEARCH_ENDPOINT}?q=${term.current}`}
                  >
                    <p>
                      View all results for <q>{term.current}</q>
                      &nbsp; →
                    </p>
                  </Link>
                ) : null}
              </>
            );
          }}
        </SearchResultsPredictive>
      </div>
    </Aside>
  );
}

