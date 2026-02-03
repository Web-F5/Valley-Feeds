
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
    <section className="relative z-0 min-h-[600px] md:h-[700px] overflow-hidden">
      {/* Background images */}
      <div className="absolute inset-0">
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
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent" />

      {/* Content Layer */}
<div className="relative z-10 flex h-full items-center justify-center">
  <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

    {/* Center stack */}
    <div className="flex flex-col items-center text-left gap-8">
      
      {/* Logo + Search wrapper */}
      <div className="flex flex-col md:flex-row items-center gap-6 w-full justify-center -mt-40">

        {/* Search */}
        <form
          action="/search"
          method="get"
          className="relative w-full max-w-md"
          style={{maxWidth: '26rem'}}
          onSubmit={() => setOpen(false)}
        >
          <div className="flex rounded-full overflow-hidden shadow-lg bg-white">
            <input
              type="search"
              name="q"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => query.length > 1 && setOpen(true)}
              placeholder="&nbsp;&nbsp;&nbsp;&nbsp;Search products, feed, supplies…"
              className="w-full px-5 py-3 text-sm text-gray-900 focus:outline-none"
              autoComplete="off"
            />

            <button
              type="submit"
              aria-label="Search"
              className="flex items-center justify-center px-5 bg-[#2092bb] hover:bg-[#1a7aa0] transition"
            >
              {/* Magnifying glass */}
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

          {/* Autocomplete */}
          {open && results.length > 0 && (
            <ul className="absolute z-50 mt-2 w-full bg-white rounded-xl shadow-xl overflow-hidden border">
              {results.slice(0, 6).map((product) => (
                <li key={product.id}>
                  <a
                    href={product.url}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 transition"
                    onClick={() => setOpen(false)}
                  >
                    {product.image && (
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-10 h-10 object-cover rounded"
                      />
                    )}  
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {product.title}
                      </p>
                      <p className="text-xs text-gray-500">View product</p>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          )}

          {open && query.length > 1 && results.length === 0 && (
            <div className="absolute z-50 mt-2 w-full bg-white rounded-xl shadow-xl border px-4 py-3 text-sm text-gray-500">
              No results found
            </div>
          )}
        </form>
        {/* Logo */}
        <img
          src="./images/vfg-logo-v2-cmyk-blue.webp"
          alt="Valley Feeds"
          className="w-56 md:w-64"
        />
      </div>

      {/* Hero text */}
      <div className="max-w-2xl animate-in fade-in slide-in-from-left duration-700 delay-300">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight drop-shadow-lg">
          Quality Stock Feed & Supplies for Your Farm
        </h1>
        <p className="text-lg md:text-xl text-white/95 mb-8 leading-relaxed drop-shadow-md">
          Trusted by local farmers for generations. Expert advice, reliable supply,
          and everything you need for your livestock, pets, and property.
        </p>
      </div>
    </div>
  </div>
</div>

      {/* Bottom fade */}
      <div className="hidden md:block absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
    </section>
  )
}