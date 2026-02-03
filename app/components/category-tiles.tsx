import {Link} from "react-router"
import { ArrowRight } from "lucide-react"

const categories = [
  {
    title: "Horses",
    description: "Complete range of horse feed, supplements & care",
    image: "./images/horseeating.webp",
    href: "https://valleyfeeds.com.au/collections/horses",
  },
  {
    title: "Dogs",
    description: "Premium dog food & health products",
    image: "./images/dogandsheep.webp",
    href: "https://valleyfeeds.com.au/collections/dogs",
  },
  {
    title: "Cats",
    description: "Quality cat food & essentials",
    image: "./images/cat.webp",
    href: "https://valleyfeeds.com.au/collections/cats",
  },
  {
    title: "Bird and Poultry",
    description: "Specialized feeds for all your birds",
    image: "./images/chooks.webp",
    href: "https://valleyfeeds.com.au/collections/bird-and-poultry",
  },
  {
    title: "Livestock",
    description: "Cattle, sheep & livestock nutrition",
    image: "./images/cattle.webp",
    href: "https://valleyfeeds.com.au/collections/livestock",
  },
  {
    title: "Farm Supplies",
    description: "Fencing, chemicals & farm essentials",
    image: "./images/farmsupplies.webp",
    href: "https://valleyfeeds.com.au/collections/farm-supplies",
  },
]

export function CategoryTiles() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-white to-stone-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#24282E] mb-4">Shop by Your Needs</h2>
          <p className="text-lg text-stone-600 max-w-2xl mx-auto text-pretty">
            Find exactly what you need for your animals and property
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <Link
              key={category.title}
              to={category.href}
              className="group relative overflow-hidden rounded-xl aspect-[4/3] block shadow-lg hover:shadow-2xl transition-all duration-300 animate-in fade-in slide-in-from-bottom"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <img
                src={
                  category.image || `/placeholder.svg?height=400&width=600&query=${encodeURIComponent(category.title)}`
                }
                alt={category.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#24282E]/95 via-[#24282E]/60 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-end p-6">
                <h3 className="text-2xl font-bold text-white mb-2 group-hover:translate-x-1 transition-transform duration-300">
                  {category.title}
                </h3>
                <p className="text-stone-100 text-sm mb-3">{category.description}</p>
                <div className="flex items-center text-[#1E91BA] font-semibold text-sm group-hover:gap-2 gap-1 transition-all duration-300">
                  <span>Shop Now</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
