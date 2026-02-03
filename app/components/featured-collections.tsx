import {Link} from "react-router"
import { Button } from "~/components/ui/button"

const collections = [
  {
    name: "Premium Cattle Feed",
    description: "High-energy blends for optimal growth",
    image: "./images/cattle-feed-bag-premium-quality.jpg",
    href: "/collections/cattle-feed",
  },
  {
    name: "Sheep Nutrition",
    description: "Complete nutrition for all life stages",
    image: "./images/sheep-feed-pellets-nutrition.jpg",
    href: "/collections/sheep-feed",
  },
  {
    name: "Horse Feed Range",
    description: "Performance and maintenance feeds",
    image: "./images/HygainAllrounderValleyFeedsGeneral.png",
    href: "/collections/horse-feed",
  },
  {
    name: "Poultry Supplies",
    description: "Layer feeds and supplements",
    image: "./images/chicken-poultry-feed-bag.jpg",
    href: "/collections/poultry",
  },
]

export function FeaturedCollections() {
  return (
    <section className="py-16 md:py-24 bg-stone-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-4">Featured Collections</h2>
          <p className="text-lg text-stone-600 max-w-2xl mx-auto text-pretty">Browse our most popular ranges</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {collections.map((collection) => (
            <div
              key={collection.name}
              className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <Link to={collection.href}>
                <img
                  src={collection.image || "/placeholder.svg"}
                  alt={collection.name}
                  className="w-full aspect-square object-cover"
                  loading="lazy"
                />
                <div className="p-4">
                  <h3 className="font-bold text-stone-900 mb-1">{collection.name}</h3>
                  <p className="text-sm text-stone-600 mb-4">{collection.description}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-emerald-700 text-emerald-700 hover:bg-emerald-50 bg-transparent"
                  >
                    View Collection
                  </Button>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
