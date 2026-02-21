import { Button } from "~/components/ui/button"
import { ArrowRight } from "lucide-react"
import { useEffect, useRef, useState } from "react"

type Product = {
  id: string;
  title: string;
  url: string;
  image?: string;
};

export function HeroSection() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<Product[]>([]);
  const [open, setOpen] = useState(false)

  const fetchResults = async () => {
    if (!query) return;

    try {
      const res = await fetch(`/api/predictive-search?q=${encodeURIComponent(query)}`);
      const data = (await res.json()) as { products: Product[] };
      setResults(data.products || []);
      setOpen(true);
    } catch (e) {
      console.error('Predictive search failed', e);
    }
  };

  useEffect(() => {
    if (!query || query.length < 2) {
      setResults([])
      setOpen(false)
      return
    }

    const timeout = setTimeout(fetchResults, 250)
    return () => clearTimeout(timeout)
  }, [query])

  return (
<section className="relative z-0 min-h-[600px] md:h-[700px]">
  {/* Background images */}
  <div className="absolute inset-0 z-0">
    <picture>
      <source
        media="(max-width: 767px)"
        srcSet="./images/australian-rural-farm-landscape-cattle-grazing-mob.webp"
      />
      <img
        src="/images/australian-rural-farm-landscape-cattle-grazing-gre.jpg"
        alt="Valley Feeds - Rural farm landscape"
        className="w-full h-full object-cover"
        loading="eager"
      />
    </picture>
  </div>

  {/* Overlay */}
  <div className="absolute inset-0 z-1 bg-gradient-to-r from-black/60 via-black/40 to-transparent" />

  {/* Content Layer */}
  <div className="relative z-10 flex min-h-[600px] md:min-h-[700px] items-center">
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

      {/* Center stack */}
      <div className="flex flex-col items-center text-center gap-6 md:gap-8">
        
        {/* Logo (shows first on mobile) */}
        <img
          src="./images/vfg-logo-v2-cmyk-blue.webp"
          alt="Valley Feeds"
          className="w-48 md:w-64"
        />

        {/* Search */}
        <form
          action="/search"
          method="get"
          className="relative w-full md:w-96 z-20"
          onSubmit={() => setOpen(false)}
        >
          <div className="flex rounded-full overflow-hidden shadow-lg bg-white">
            <input
              type="search"
              name="q"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => query.length > 1 && setOpen(true)}
              placeholder="&nbsp;&nbsp;&nbsp;Search products, feed, supplies..."
              className="w-full px-5 py-3 text-sm text-gray-900 focus:outline-none"
              autoComplete="off"
            />

            <button
              type="submit"
              aria-label="Search"
              className="flex items-center justify-center px-5 bg-[#2092bb] hover:bg-[#1a7aa0] transition flex-shrink-0"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-white"
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
     <a key={product.id}
        href={product.url}
        className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition text-left"
        onClick={() => setOpen(false)}
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
    
    <a href={`/search?q=${encodeURIComponent(query)}`}
      className="block px-4 py-2.5 text-sm text-[#2092bb] font-medium hover:bg-blue-50 border-t border-gray-100 transition"
      onClick={() => setOpen(false)}
    >
      See all results for "{query}" →
    </a>
  </div>
)}
        </form>

        {/* Hero text */}
        <div className="max-w-2xl">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 md:mb-6 leading-tight drop-shadow-lg">
            Quality Stock Feed & Supplies for Your Farm
          </h1>
          <p className="text-base md:text-xl text-white/95 mb-6 md:mb-8 leading-relaxed drop-shadow-md">
            Trusted by local farmers for generations. Expert advice, reliable supply,
            and everything you need for your livestock, pets, and property.
          </p>
        </div>
      </div>
    </div>
  </div>
</section>
  )
}