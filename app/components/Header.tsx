import {Suspense, useState, useEffect, useRef} from 'react';
import {Await, NavLink, useAsyncValue, Link, useLocation} from 'react-router';
import {
  type CartViewPayload,
  useAnalytics,
  useOptimisticCart,
} from '@shopify/hydrogen';
import type {HeaderQuery, CartApiQueryFragment} from 'storefrontapi.generated';
import {useAside} from '~/components/Aside';
import {ChevronDown, Menu, X, ShoppingCart, User, Search} from 'lucide-react';

// Use the actual menu item type from Shopify
type ShopifyMenuItem = NonNullable<HeaderQuery['menu']>['items'][0];
type HeaderProps = {
  header: HeaderQuery;
  cart: CartApiQueryFragment | null;
  isLoggedIn: boolean;
  publicStoreDomain: string;
};

// ─── Predictive Search Hook ───────────────────────────────────────────────────
function usePredictiveSearch(query: string) {
  const [results, setResults] = useState<
    {id: string; title: string; url: string; image?: string}[]
  >([]);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }
    const controller = new AbortController();
    fetch(`/api/predictive-search?q=${encodeURIComponent(query)}`, {
      signal: controller.signal,
    })
      .then((r) => r.json() as Promise<{products?: Array<{id: string; title: string; url: string; image?: string}>}>)
      .then((data) => {
        setResults(data.products ?? []);
      })
      .catch(() => {});
    return () => controller.abort();
  }, [query]);

  return results;
}

// ─── Search Form ──────────────────────────────────────────────────────────────
function SearchForm({onClose}: {onClose?: () => void}) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const results = usePredictiveSearch(query);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  useEffect(() => {
    if (results.length > 0 && query.length > 1) setOpen(true);
    else setOpen(false);
  }, [results, query]);

  return (
    <div ref={wrapperRef} className="relative w-full">
      <form
        action="/search"
        method="get"
        onSubmit={() => {
          setOpen(false);
          onClose?.();
        }}
      >
        <div className="flex rounded-full overflow-hidden shadow-lg bg-white">
          <input
            type="search"
            name="q"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => query.length > 1 && setOpen(true)}
            placeholder="   Search products, feed, supplies..."
            className="w-full px-5 py-2.5 text-sm text-gray-900 focus:outline-none"
            autoComplete="off"
          />
          <button
            type="submit"
            aria-label="Search"
            className="flex items-center justify-center px-4 bg-[#2092bb] hover:bg-[#1a7aa0] transition flex-shrink-0"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 100-15 7.5 7.5 0 000 15z"
              />
            </svg>
          </button>
        </div>

        {/* Autocomplete results */}
        {open && results.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
            {results.map((product) => (
              <a
                key={product.id}
                href={product.url}
                className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition text-left"
                onClick={() => {
                  setOpen(false);
                  onClose?.();
                }}
              >
                {product.image && (
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-10 h-10 object-cover rounded-md flex-shrink-0"
                  />
                )}
                <span className="text-sm text-gray-800 truncate">{product.title}</span>
              </a>
            ))}
            <a
              href={`/search?q=${encodeURIComponent(query)}`}
              className="block px-4 py-2.5 text-sm text-[#2092bb] font-medium hover:bg-blue-50 border-t border-gray-100 transition"
              onClick={() => {
                setOpen(false);
                onClose?.();
              }}
            >
              See all results for "{query}" →
            </a>
          </div>
        )}
      </form>
    </div>
  );
}

// ─── Header ───────────────────────────────────────────────────────────────────
export function Header({
  header,
  isLoggedIn,
  cart,
  publicStoreDomain,
}: HeaderProps) {
  const {menu} = header;
  const location = useLocation();
  const isStorePage = location.pathname.startsWith('/store');

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [shopMenuOpen, setShopMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<ShopifyMenuItem | null>(null);

  // Find the "Shop" menu item
  const shopMenu = menu?.items.find((item) => item.title === 'Shop');
  const shopCategories = shopMenu?.items ?? [];

  const getLinkHref = (url: string | null | undefined): string => {
    if (!url) return '/';
    try {
      const urlObj = new URL(url);
      return urlObj.pathname;
    } catch {
      return url;
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[#24282E] text-white shadow-lg">
      <div className="max-w-[88rem] mx-auto px-4 sm:px-6 lg:px-6">
        <div className="flex items-center justify-between h-16 gap-4">

          {/* Logo */}
          <Link
            to="/"
            className="flex-shrink-0"
            reloadDocument={location.pathname.startsWith('/collections')}
          >
            <img
              src="/images/vfg-logo-v2-cmyk-blue.webp"
              alt="Valley Feeds & General"
              className="h-12 w-auto px-4"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {isStorePage ? (
              <>
                <a
                  href="/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 hover:bg-white/10 rounded-lg transition-colors font-medium"
                >
                  Valley Feeds Online
                </a>
                <a
                  href="https://www.foodbooking.com/ordering/restaurant/menu?company_uid=09c3dc3b-90e9-49db-840d-0eadc91eabf4&restaurant_uid=c4138f05-8354-4a9f-b0b0-f02fe8f1fea7&facebook=true"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 hover:bg-white/10 rounded-lg transition-colors font-medium"
                >
                  Food Orders
                </a>
                <a
                  href="https://www.foodbooking.com/ordering/restaurant/menu?company_uid=09c3dc3b-90e9-49db-840d-0eadc91eabf4&restaurant_uid=c4138f05-8354-4a9f-b0b0-f02fe8f1fea7&facebook=true#primary-school-lunch"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 hover:bg-white/10 rounded-lg transition-colors font-medium"
                >
                  School Lunches
                </a>
                <Link
                  to="/store#post-office"
                  className="px-4 py-2 hover:bg-white/10 rounded-lg transition-colors font-medium"
                >
                  Post Office
                </Link>
                <a
                  href="tel:0358294205"
                  className="px-4 py-2 hover:bg-white/10 rounded-lg transition-colors font-medium flex items-center gap-2"
                >
                  📞 03 5829 4205
                </a>
              </>
            ) : (
              <>
                {/* Shop Dropdown */}
                <div
                  className="relative"
                  onMouseEnter={() => setShopMenuOpen(true)}
                  onMouseLeave={() => {
                    setShopMenuOpen(false);
                    setActiveCategory(null);
                  }}
                >
                  <button
                    type="button"
                    className="px-4 py-2 hover:bg-white/10 rounded-lg transition-colors font-medium flex items-center gap-1"
                  >
                    Shop
                    <ChevronDown className="w-4 h-4" />
                  </button>

                  {shopMenuOpen && shopCategories.length > 0 && (
                    <div className="absolute left-0 top-full flex bg-white text-stone-900 rounded-lg shadow-xl">
                      <div className="w-64 py-2">
                        {shopCategories.map((category) => {
                          const categoryWithItems = category as ShopifyMenuItem;
                          return (
                            <Link
                              key={category.id}
                              to={getLinkHref(category.url)}
                              onMouseEnter={() => setActiveCategory(categoryWithItems)}
                              onClick={() => {
                                setShopMenuOpen(false);
                                setActiveCategory(null);
                              }}
                              className={`block px-4 py-2 flex items-center justify-between transition-colors
                                ${activeCategory?.id === category.id ? 'bg-stone-100' : 'hover:bg-stone-50'}`}
                            >
                              <span>{category.title}</span>
                              {categoryWithItems.items && categoryWithItems.items.length > 0 && (
                                <ChevronDown className="w-4 h-4 -rotate-90 opacity-50" />
                              )}
                            </Link>
                          );
                        })}
                      </div>
                      {(activeCategory?.items?.length ?? 0) > 0 && (
                        <div className="w-64 border-l border-stone-200 py-2">
                          {activeCategory!.items.map((sub) => (
                            <Link
                              key={sub.id}
                              to={getLinkHref(sub.url)}
                              onClick={() => {
                                setShopMenuOpen(false);
                                setActiveCategory(null);
                              }}
                              className="block px-4 py-2 text-sm hover:bg-stone-100 transition-colors"
                            >
                              {sub.title}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <Link
                  to="/pages/delivery"
                  className="px-4 py-2 hover:bg-white/10 rounded-lg transition-colors font-medium"
                >
                  Delivery
                </Link>
                <Link
                  to="/store"
                  className="px-4 py-2 hover:bg-white/10 rounded-lg transition-colors font-medium"
                >
                  Katandra West Store
                </Link>
                <button
                  onClick={() => {
                    const footer = document.querySelector('footer');
                    footer?.scrollIntoView({behavior: 'smooth'});
                  }}
                  className="px-4 py-2 hover:bg-white/10 rounded-lg transition-colors font-medium"
                >
                  Contact
                </button>
              </>
            )}
          </nav>

          {/* ── Desktop Search (Valley Feeds only) ── */}
          {!isStorePage && (
            <div className="hidden lg:block w-80 xl:w-96">
              <SearchForm />
            </div>
          )}

          {/* ── Right Side: Mobile search icon + hamburger + Account/Cart ── */}
          <div className="flex items-center gap-2 ml-auto lg:ml-0">

            {/* Mobile search icon (Valley Feeds only) */}
            {!isStorePage && (
              <button
                onClick={() => {
                  setMobileSearchOpen(!mobileSearchOpen);
                  setMobileMenuOpen(false);
                }}
                className="lg:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
                aria-label="Toggle search"
              >
                {mobileSearchOpen ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
              </button>
            )}

            {/* Desktop Account & Cart (Valley Feeds only) */}
            {!isStorePage && (
              <div className="hidden lg:flex items-center gap-2">
                <NavLink
                  to="/account"
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors flex items-center gap-2"
                >
                  <User className="w-5 h-5" />
                  <Suspense fallback="Account">
                    <Await resolve={isLoggedIn} errorElement="Sign in">
                      {(isLoggedIn) => (
                        <span className="text-sm">{isLoggedIn ? 'Account' : 'Sign in'}</span>
                      )}
                    </Await>
                  </Suspense>
                </NavLink>
                <CartToggle cart={cart} />
              </div>
            )}

            {/* Hamburger */}
            <button
              onClick={() => {
                setMobileMenuOpen(!mobileMenuOpen);
                setMobileSearchOpen(false);
              }}
              className="lg:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* ── Mobile Search Bar (drops below header row) ── */}
        {mobileSearchOpen && !isStorePage && (
          <div className="lg:hidden px-2 pb-3 pt-1">
            <SearchForm onClose={() => setMobileSearchOpen(false)} />
          </div>
        )}

        {/* ── Mobile Menu ── */}
        {mobileMenuOpen && (
          <div className="lg:hidden pb-4 border-t border-white/10 pt-4 mt-2">
            <nav className="flex flex-col gap-2">
              {isStorePage ? (
                <>
                  <a
                    href="https://www.foodbooking.com/ordering/restaurant/menu?company_uid=09c3dc3b-90e9-49db-840d-0eadc91eabf4&restaurant_uid=c4138f05-8354-4a9f-b0b0-f02fe8f1fea7&facebook=true"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 hover:bg-white/10 rounded-lg transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Online Orders
                  </a>
                  <a
                    href="https://www.foodbooking.com/ordering/restaurant/menu?company_uid=09c3dc3b-90e9-49db-840d-0eadc91eabf4&restaurant_uid=c4138f05-8354-4a9f-b0b0-f02fe8f1fea7&facebook=true#primary-school-lunch"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 hover:bg-white/10 rounded-lg transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    School Lunches
                  </a>
                  <Link
                    to="/store#post-office"
                    className="px-4 py-2 hover:bg-white/10 rounded-lg transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Post Office
                  </Link>
                  <a
                    href="tel:0358283431"
                    className="px-4 py-2 hover:bg-white/10 rounded-lg transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    📞 03 5828 3431
                  </a>
                </>
              ) : (
                <>
                  {shopCategories.map((category) => (
                    <Link
                      key={category.id}
                      to={getLinkHref(category.url)}
                      className="px-4 py-2 hover:bg-white/10 rounded-lg transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {category.title}
                    </Link>
                  ))}
                  <Link
                    to="/pages/delivery"
                    className="px-4 py-2 hover:bg-white/10 rounded-lg transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Delivery
                  </Link>
                  <Link
                    to="/store"
                    className="px-4 py-2 hover:bg-white/10 rounded-lg transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Katandra West Store
                  </Link>
                  <button
                    onClick={() => {
                      const footer = document.querySelector('footer');
                      footer?.scrollIntoView({behavior: 'smooth'});
                      setMobileMenuOpen(false);
                    }}
                    className="px-4 py-2 hover:bg-white/10 rounded-lg transition-colors text-left"
                  >
                    Contact
                  </button>
                  <a
                    href="tel:0418278542"
                    className="px-4 py-2 hover:bg-white/10 rounded-lg transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    📞 0418 278 542
                  </a>

                  {/* Mobile Account & Cart */}
                  <div className="border-t border-white/10 mt-2 pt-2 flex flex-col gap-2">
                    <NavLink
                      to="/account"
                      className="px-4 py-2 hover:bg-white/10 rounded-lg transition-colors flex items-center gap-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <User className="w-5 h-5" />
                      <Suspense fallback="Account">
                        <Await resolve={isLoggedIn} errorElement="Sign in">
                          {(isLoggedIn) => (isLoggedIn ? 'Account' : 'Sign in')}
                        </Await>
                      </Suspense>
                    </NavLink>
                    <div onClick={() => setMobileMenuOpen(false)}>
                      <CartToggle cart={cart} />
                    </div>
                  </div>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

// ─── Cart ─────────────────────────────────────────────────────────────────────
function CartBadge({count}: {count: number | null}) {
  const {open} = useAside();
  const {publish, shop, cart, prevCart} = useAnalytics();

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        open('cart');
        publish('cart_viewed', {
          cart,
          prevCart,
          shop,
          url: window.location.href || '',
        } as CartViewPayload);
      }}
      className="p-2 hover:bg-white/10 rounded-lg transition-colors flex items-center gap-2"
    >
      <ShoppingCart className="w-5 h-5" />
      {count !== null && count > 0 && (
        <span className="bg-[#1E91BA] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
          {count}
        </span>
      )}
    </button>
  );
}

function CartToggle({cart}: Pick<HeaderProps, 'cart'>) {
  return (
    <Suspense fallback={<CartBadge count={null} />}>
      <Await resolve={cart}>
        <CartBanner />
      </Await>
    </Suspense>
  );
}

function CartBanner() {
  const originalCart = useAsyncValue() as CartApiQueryFragment | null;
  return <CartBadge count={originalCart?.totalQuantity ?? 0} />;
}
