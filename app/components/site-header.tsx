import { useState } from "react"
import {Link} from "react-router"
import { Button } from "~/components/ui/button"
import { ChevronDown, Menu, Phone, X } from "lucide-react"

type MenuItem = {
  title: string
  url: string
  items: MenuItem[]
}

type ShopCategory = {
  title: string
  url: string
}


export function SiteHeader({ menu }: { menu: MenuItem[] }) {

  // state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [shopMenuOpen, setShopMenuOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState<MenuItem | null>(null)

   // menu data
  const shopMenu = menu.find(item => item.title === "Shop")
  const shopCategories = shopMenu?.items ?? []



  const USE_ABSOLUTE_URLS = true

  const getLinkHref = (url: string) =>
    USE_ABSOLUTE_URLS ? url : url.replace(/^https?:\/\/[^/]+/, "")
  
  return (
    <header className="relative sticky top-0 z-50 w-full bg-[#24282E] text-white shadow-lg">
 
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            <Link 
              to="/" 
              className="px-4 py-2 hover:bg-white/10 rounded-lg transition-colors font-medium">
              Home
            </Link>

          {/* SHOP NAV ITEM */}
          <div
            className="relative"
            onMouseEnter={() => setShopMenuOpen(true)}
            onMouseLeave={() => {
              setShopMenuOpen(false)
              setActiveCategory(null)
            }}
          >
            <button
              type="button"
              className="px-4 py-2 hover:bg-white/10 rounded-lg transition-colors font-medium flex items-center gap-1"
            >
              Shop
              <ChevronDown className="w-4 h-4" />
            </button>  

            {shopMenuOpen && (
            <div className="absolute left-0 top-full flex bg-white text-stone-900 rounded-lg shadow-xl">
          
              {/* LEFT COLUMN — Categories */}
              <div className="w-64 py-2">
                {shopCategories.map(category => (
                  <Link
                    key={category.title}
                    to={getLinkHref(category.url)}
                    onMouseEnter={() => setActiveCategory(category)}
                    className={`px-4 py-2 flex items-center justify-between
                      ${activeCategory?.title === category.title
                        ? "bg-stone-100"
                        : "hover:bg-stone-50"}
                    `}
                  >
                    <span>{category.title}</span>

                    {(category.items?.length ?? 0) > 0 && (
                      <ChevronDown className="w-4 h-4 -rotate-90 opacity-50" />
                    )}
                  </Link>
                ))}
              </div>
                            
              {/* RIGHT COLUMN — Subcategories */}
              {(activeCategory?.items?.length ?? 0) > 0 && (
                <div className="w-64 border-l border-stone-200 py-2">
                  {activeCategory!.items!.map(sub => (
                    <Link
                      key={sub.url}
                      to={getLinkHref(sub.url)}
                      className="block px-4 py-2 text-sm text-black hover:bg-stone-100"
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
              to="https://valleyfeeds.com.au/pages/delivery-information"
              className="px-4 py-2 hover:bg-white/10 rounded-lg transition-colors font-medium"
            >
              Delivery Information
            </Link>
            <Link to="https://valleyfeeds.com.au/pages/contact" className="px-4 py-2 hover:bg-white/10 rounded-lg transition-colors font-medium">
              Contact
            </Link>
            <Link
              to="https://www.facebook.com/p/Katandra-West-General-Store-and-Post-Office-61581784793345/"
              className="px-4 py-2 hover:bg-white/10 rounded-lg transition-colors font-medium"
            >
              Katandra West General Store
            </Link>
          </nav>
           
          {/* Call Button */}
          <Button
            asChild
            className="bg-[#1E91BA] hover:bg-[#1E91BA]/90 text-white font-semibold shadow-lg hover:shadow-xl transition-all"
          >
            <a href="tel:0418278542" className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              <span className="hidden sm:inline">0418 278 542</span>
            </a>
          </Button>
        </div>
         
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden pb-4 animate-in slide-in-from-top duration-200">
            <nav className="flex flex-col gap-2">
              <Link
                to="/"
                className="px-4 py-2 hover:bg-white/10 rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>



              {/* Mobile Shop Categories (TOP LEVEL ONLY) */}
              {shopCategories.map(category => (
                <Link
                  key={category.title}
                  to={getLinkHref(category.url)}
                  className="px-4 py-2 hover:bg-white/10 rounded-lg transition-colors font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {category.title}
                </Link>
              ))}



              <Link
                to="https://valleyfeeds.com.au/pages/delivery"
                className="px-4 py-2 hover:bg-white/10 rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Delivery Information
              </Link>
              <Link
                to="https://valleyfeeds.com.au/pages/contact"
                className="px-4 py-2 hover:bg-white/10 rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </Link>
              <Link
                to="https://www.gloriafood.com/ordering/restaurant/menu?restaurant_uid=c4138f05-8354-4a9f-b0b0-f02fe8f1fea7"
                className="px-4 py-2 hover:bg-white/10 rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Take Away Food
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
