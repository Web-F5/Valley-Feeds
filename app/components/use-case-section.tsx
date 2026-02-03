import {Link} from "react-router";

const useCases = [
  {
    title: "Cattle Farmers",
    description: "Complete nutrition for beef and dairy operations",
    image: "./images/placeholder.svg?height=300&width=400",
    href: "/collections/cattle",
  },
  {
    title: "Sheep Producers",
    description: "Feed and supplements for wool and meat sheep",
    image: "./images/placeholder.svg?height=300&width=400",
    href: "/collections/sheep",
  },
  {
    title: "Horse Owners",
    description: "Performance and leisure horse nutrition",
    image: "./images/HygainAllrounderValleyFeedsGeneral.png?height=300&width=400",
    href: "/collections/horses",
  },
  {
    title: "Poultry Keepers",
    description: "Layers, broilers, and backyard flocks",
    image: "./images/placeholder.svg?height=300&width=400",
    href: "/collections/poultry",
  },
  {
    title: "Hobby Farmers",
    description: "Everything for smaller mixed operations",
    image: "./images/placeholder.svg?height=300&width=400",
    href: "/collections/hobby-farm",
  },
  {
    title: "Pet Owners",
    description: "Premium dog and cat nutrition",
    image: "./images/HyproSuperviteHappyDog20kgValleyFeedsGeneral.png?height=300&width=400",
    href: "/collections/pets",
  },
]

export function UseCaseSection() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-4">Shop by Your Needs</h2>
          <p className="text-lg text-stone-600 max-w-2xl mx-auto text-pretty">
            Find products tailored to your specific livestock and property type
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {useCases.map((useCase) => (
            <Link
              key={useCase.title}
              to={useCase.href}
              className="group bg-stone-50 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="aspect-video overflow-hidden">
                <img
                  src={useCase.image || "/placeholder.svg"}
                  alt={useCase.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
              <div className="p-5">
                <h3 className="text-xl font-bold text-stone-900 mb-2">{useCase.title}</h3>
                <p className="text-stone-600">{useCase.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
