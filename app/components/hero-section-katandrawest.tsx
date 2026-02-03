
import { Button } from "~/components/ui/button"
import { ArrowRight } from "lucide-react"
import { useEffect, useRef, useState } from "react"

type Product = {
  id: string;
  title: string;
  url: string;
  image?: string;
};

export function HeroSectionKatandraWest() {
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
        srcSet="/images/mainimageGeneralStore.jpg"
      />
      <img
        src="/images/mainimageGeneralStore.jpg"
        alt="Valley Feeds - Rural farm landscape"
        className="w-full h-full object-cover"
        loading="eager"
      />
    </picture>
  </div>
 {/* Right side fade overlay for text readability */}
  <div className="hidden md:block absolute top-0 right-0 bottom-0 w-1/2 bg-gradient-to-l from-black/80 to-transparent" />
  <div className="relative z-10 flex h-full items-center justify-end">
  <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    {/* Right-aligned column on desktop, centered on mobile */}
    <div className="flex justify-center md:justify-end">
      
      {/* ← Add this wrapper div for the semi-transparent box */}
      <div 
        className="
          bg-gray-900/70          /* semi-transparent dark grey — adjust opacity with /60, /70, /80 etc. */
          rounded-2xl             /* modern larger rounded corners — try rounded-xl or rounded-3xl too */
          p-8 md:p-10 lg:p-12     /* generous padding inside the box */
          shadow-2xl              /* optional: deeper modern shadow for depth */
          border border-gray-700/50  /* subtle border — optional but looks nice */
          max-w-2xl               /* keep your original max width */
          text-center md:text-right 
          animate-in fade-in slide-in-from-right duration-700 delay-300
        "
      >
        {/* Heading */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight drop-shadow-lg">
          <p className="text-2xl md:text-3xl lg:text-4xl">Katandra West</p>
          <p className="text-2xl md:text-3xl lg:text-4xl">General Store</p>
        </h1>
        
        {/* Description */}
        <div className="text-lg md:text-xl text-white/95 leading-relaxed drop-shadow-md mt-8 md:mt-10">
          <h2 className="text-xl md:text-2xl font-semibold mb-6 md:mb-8">
            Visit us in-store for:
          </h2>
          <div className="text-left mt-4">
            <ul className="list-disc font-semibold md:pl-6 pl-5 list-outside text-left space-y-1.5">
              <li>Takeaway Food and Drinks</li>
              <li>Ice Creams</li>
              <li>Post Office Services</li>
              <li>Groceries and Food Staples</li>
              <li>Petrol</li>
              <li>School Lunch Orders</li>
              <li>Rural Merchandise and Stockfeed</li>
            </ul>
          </div>
        </div>
      </div>
      
    </div>
  </div>
</div>

  {/* Bottom fade */}
  <div className="hidden md:block absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent" />
</section>
  )
}