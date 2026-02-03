export function TrustSection() {
  const features = [
    {
      title: "Locally Owned & Operated",
      description: "Serving the Greater Shepparton community for over 50 years",
    },
    {
      title: "Expert Advice",
      description: "Our team understands local conditions and livestock needs",
    },
    {
      title: "Reliable Supply",
      description: "Consistent stock levels and regular deliveries available",
    },
    {
      title: "Competitive Pricing",
      description: "Fair prices for bulk orders and regular customers",
    },
  ]

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-4">Why Choose Valley Feeds</h2>
          <p className="text-lg text-stone-600 max-w-2xl mx-auto text-pretty">
            Your trusted partner for quality farm supplies and expert rural service
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => (
            <div key={feature.title} className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 mb-4">
                <svg className="w-8 h-8 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-stone-900 mb-2">{feature.title}</h3>
              <p className="text-stone-600 text-pretty">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
