"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronDown, Menu, Phone, X } from "lucide-react"
import { Button } from "@/components/ui/button"

type MenuItem = {
  title: string
  url: string
  items?: MenuItem[]
}

export function SiteHeader({ menu }: { menu: MenuItem[] }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-[#24282E] text-white">
      <nav className="hidden lg:flex gap-4">
        {menu.map(item => (
          <div key={item.title} className="relative group">
            <Link href={item.url} className="px-4 py-2 hover:bg-white/10 rounded">
              {item.title}
            </Link>

            {item.items && item.items.length > 0 && (
              <div className="absolute top-full left-0 bg-white text-black rounded shadow-lg opacity-0 group-hover:opacity-100 transition">
                {item.items.map(sub => (
                  <Link
                    key={sub.title}
                    href={sub.url}
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    {sub.title}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </header>
  )
}