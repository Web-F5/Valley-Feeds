import { Button } from "~/components/ui/button"

export function FinalCTA() {
  return (
    <section className="py-16 md:py-24 bg-emerald-800 text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Visit Us In Store or Browse Online</h2>
        <p className="text-lg text-emerald-50 mb-8 text-pretty leading-relaxed">
          Located in the heart of the valley. Expert advice, quality products, and service you can trust. Open Monday to
          Saturday.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button size="lg" className="bg-white text-emerald-800 hover:bg-stone-100 px-8 h-12">
            Browse All Products
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-2 border-white text-white hover:bg-white/10 px-8 h-12 bg-transparent"
          >
            Contact Us
          </Button>
        </div>

        <div className="mt-12 pt-8 border-t border-emerald-700">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
            <div>
              <h3 className="font-bold mb-2">Visit Our Store</h3>
              <p className="text-emerald-100 text-sm">
                123 Valley Road
                <br />
                Smithville NSW 2345
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-2">Opening Hours</h3>
              <p className="text-emerald-100 text-sm">
                Mon-Fri: 7am - 5pm
                <br />
                Saturday: 8am - 2pm
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-2">Get In Touch</h3>
              <p className="text-emerald-100 text-sm">
                Phone: (02) 1234 5678
                <br />
                Email: info@valleyfeeds.com.au
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
