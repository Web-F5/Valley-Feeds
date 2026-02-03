import {Link} from "react-router"
import { MapPin, Phone, Mail } from "lucide-react"

export function SiteFooter() {
  return (
    <footer className="bg-[#24282E] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="font-bold text-lg mb-4">Valley Feeds & General</h3>
            <p className="text-stone-300 text-sm leading-relaxed mb-4">
              Your trusted local supplier of quality stock feed, pet supplies, and farm essentials.
            </p>
            <img
              src="./images/vfg-logo-v2-cmyk-blue.webp"
              alt="Valley Feeds Group"
              className="h-12 w-auto opacity-90"
              loading="lazy"
            />
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/shop" className="text-stone-300 hover:text-[#1E91BA] transition-colors text-sm">
                  Product Categories
                </Link>
              </li>
              <li>
                <Link
                  to="/delivery-information"
                  className="text-stone-300 hover:text-[#1E91BA] transition-colors text-sm"
                >
                  Shipping/Delivery Information
                </Link>
              </li>
              <li>
                <Link to="/refund-policy" className="text-stone-300 hover:text-[#1E91BA] transition-colors text-sm">
                  Refund Policy
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="text-stone-300 hover:text-[#1E91BA] transition-colors text-sm">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/terms-of-service"
                  className="text-stone-300 hover:text-[#1E91BA] transition-colors text-sm"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Shop Categories */}
          <div>
            <h3 className="font-bold text-lg mb-4">Shop</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/shop/horses" className="text-stone-300 hover:text-[#1E91BA] transition-colors text-sm">
                  Horses
                </Link>
              </li>
              <li>
                <Link to="/shop/dogs" className="text-stone-300 hover:text-[#1E91BA] transition-colors text-sm">
                  Dogs
                </Link>
              </li>
              <li>
                <Link to="/shop/cats" className="text-stone-300 hover:text-[#1E91BA] transition-colors text-sm">
                  Cats
                </Link>
              </li>
              <li>
                <Link
                  to="/shop/bird-poultry"
                  className="text-stone-300 hover:text-[#1E91BA] transition-colors text-sm"
                >
                  Bird and Poultry
                </Link>
              </li>
              <li>
                <Link to="/shop/livestock" className="text-stone-300 hover:text-[#1E91BA] transition-colors text-sm">
                  Livestock
                </Link>
              </li>
              <li>
                <Link
                  to="/shop/farm-supplies"
                  className="text-stone-300 hover:text-[#1E91BA] transition-colors text-sm"
                >
                  Farm Supplies
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-bold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <MapPin className="w-5 h-5 text-[#1E91BA] flex-shrink-0 mt-0.5" />
                <span className="text-stone-300 text-sm">1 Queen St, Katandra West VIC 3634, Australia</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-5 h-5 text-[#1E91BA] flex-shrink-0" />
                <a href="tel:0418278542" className="text-stone-300 hover:text-[#1E91BA] transition-colors text-sm">
                  0418 278 542
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-[#1E91BA] flex-shrink-0" />
                <a
                  href="mailto:info@valleyfeeds.com.au"
                  className="text-stone-300 hover:text-[#1E91BA] transition-colors text-sm"
                >
                  info@valleyfeeds.com.au
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-stone-700 mt-8 pt-8 text-center text-stone-400 text-sm">
          <p>&copy; {new Date().getFullYear()} Valley Feeds & General. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
