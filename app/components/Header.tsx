import {Suspense, useState} from 'react';
import {Await, NavLink, useAsyncValue, Link, useLocation} from 'react-router';
import {
  type CartViewPayload,
  useAnalytics,
  useOptimisticCart,
} from '@shopify/hydrogen';
import type {HeaderQuery, CartApiQueryFragment} from 'storefrontapi.generated';
import {useAside} from '~/components/Aside';
import {ChevronDown, Menu, X, ShoppingCart, User} from 'lucide-react';

// Use the actual menu item type from Shopify
type ShopifyMenuItem = NonNullable<HeaderQuery['menu']>['items'][0];
type HeaderProps = {
  header: HeaderQuery;
  cart: CartApiQueryFragment | null;
  isLoggedIn: boolean;
  publicStoreDomain: string;
};

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
  const [shopMenuOpen, setShopMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<ShopifyMenuItem | null>(null);

  // Find the "Shop" menu item
  const shopMenu = menu?.items.find(item => item.title === "Shop");
  const shopCategories = shopMenu?.items ?? [];

  // Helper to strip domain from URLs
 // Add this helper function at the top of your Header component, before the return statement
const getLinkHref = (url: string) => {
  try {
    const urlObj = new URL(url);
    // Extract the pathname from the full Shopify URL
    // e.g., "https://valleyfeeds.com.au/collections/horses" -> "/collections/horses"
    return urlObj.pathname;
  } catch {
    // If it's already a relative path, return as-is
    return url;
  }
};

  return (
    <header className="sticky top-0 z-50 w-full bg-[#24282E] text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <img 
              src="/images/vfg-logo-v2-cmyk-blue.webp" 
              alt="Valley Feeds & General"
              className="h-12 w-auto px-4"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 flex-1">
            {isStorePage ? (
              /* STORE PAGE NAVIGATION */
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
              /* VALLEY FEEDS NAVIGATION */
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
                      {/* Left Column - Categories */}
                      <div className="w-64 py-2">
                        {shopCategories.map(category => {
                          const categoryWithItems = category as ShopifyMenuItem;
                          return (
                            <Link
                              key={category.id}
                              to={getLinkHref(category.url)}
                              onMouseEnter={() => setActiveCategory(categoryWithItems)}
                              className={`block px-4 py-2 flex items-center justify-between transition-colors
                                ${activeCategory?.id === category.id
                                  ? "bg-stone-100"
                                  : "hover:bg-stone-50"}
                              `}
                            >
                              <span>{category.title}</span>
                              {categoryWithItems.items && categoryWithItems.items.length > 0 && (
                                <ChevronDown className="w-4 h-4 -rotate-90 opacity-50" />
                              )}
                            </Link>
                          );
                        })}
                      </div>

                      {/* Right Column - Subcategories */}
                      {(activeCategory?.items?.length ?? 0) > 0 && (
                        <div className="w-64 border-l border-stone-200 py-2">
                          {activeCategory!.items.map(sub => (
                            <Link
                              key={sub.id}
                              to={getLinkHref(sub.url)}
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

                {/* Delivery Link */}
                <a 
                  href="https://valleyfeeds.com.au/pages/delivery"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 hover:bg-white/10 rounded-lg transition-colors font-medium"
                >
                  Delivery
                </a>

                {/* Katandra West General Store */}
                <Link
                  to="/store"
                  className="px-4 py-2 hover:bg-white/10 rounded-lg transition-colors font-medium"
                >
                  Katandra West Store
                </Link>

                {/* Contact Link - Scroll to footer */}
                <button
                  onClick={() => {
                    const footer = document.querySelector('footer');
                    footer?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-4 py-2 hover:bg-white/10 rounded-lg transition-colors font-medium"
                >
                  Contact
                </button>

                {/* Phone Number */}
                <a 
                  href="tel:0418278542"
                  className="px-4 py-2 hover:bg-white/10 rounded-lg transition-colors font-medium flex items-center gap-2"
                >
                  📞 0418 278 542
                </a>
              </>
            )}
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 hover:bg-white/10 rounded-lg transition-colors ml-auto"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Right Side - Account & Cart (Only show on Valley Feeds pages) */}
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
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden pb-4 border-t border-white/10 pt-4 mt-2">
            <nav className="flex flex-col gap-2">
              {isStorePage ? (
                /* STORE PAGE MOBILE MENU */
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
                /* VALLEY FEEDS MOBILE MENU */
                <>
                  {/* Mobile Shop - Top Level Categories Only */}
                  {shopCategories.map(category => (
                    <Link
                      key={category.id}
                      to={getLinkHref(category.url)}
                      className="px-4 py-2 hover:bg-white/10 rounded-lg transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {category.title}
                    </Link>
                  ))}

                  <a 
                    href="https://valleyfeeds.com.au/pages/delivery"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 hover:bg-white/10 rounded-lg transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Delivery
                  </a>

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
                      footer?.scrollIntoView({ behavior: 'smooth' });
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

                  {/* Mobile Account & Cart (Only on Valley Feeds pages) */}
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
  const cart = originalCart;
  return <CartBadge count={cart?.totalQuantity ?? 0} />;
}