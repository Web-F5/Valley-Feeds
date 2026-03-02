import { useState, useEffect, useRef } from "react"
import {Link} from 'react-router';
import { Button } from "~/components/ui/button"

export default function MonthlySpecialsTickerClient({ products }: any) {
        
    if (!products?.length) {
        
        return null
    }

    const [mounted, setMounted] = useState(false)
    const [index, setIndex] = useState(0)
    const [direction, setDirection] = useState<"left" | "right">("right")
    const total = products.length
    
    const product = products[index]
   
    
    if (!product) {
        
        return null
    }

    const touchStartX = useRef<number | null>(null)
    const touchEndX = useRef<number | null>(null)

    // Mount check
    useEffect(() => {
        
        setMounted(true)
       
    }, [])

    const handleTouchStart = (e: React.TouchEvent) => {
        
        touchStartX.current = e.targetTouches[0].clientX
    }

    const handleTouchMove = (e: React.TouchEvent) => {
        touchEndX.current = e.targetTouches[0].clientX
    }

    const handleTouchEnd = () => {
        
        if (!touchStartX.current || !touchEndX.current) return

        const distance = touchStartX.current - touchEndX.current

        if (distance > 50) {
            
            next()
        }
        if (distance < -50) {
            
            prev()
        }

        touchStartX.current = null
        touchEndX.current = null
    }
    
    const next = () => {
        
        const newIndex = (index + 1) % total
        
        setDirection("right")
        setIndex(newIndex)
    }
    
    const prev = () => {
        
        const newIndex = (index - 1 + total) % total
        
        setDirection("left")
        setIndex(newIndex)
    }

    const price = Number(product.priceRange?.minVariantPrice?.amount || 0)
    
    const compareAt = Number(
        product.compareAtPriceRange?.minVariantPrice?.amount || 
        product.variants?.edges?.[0]?.node?.compareAtPrice?.amount || 0
    )

    const discount =
        compareAt && compareAt > price
            ? Math.round(((compareAt - price) / compareAt) * 100)
            : null

    // Auto-advance ticker
    useEffect(() => {
        
        if (!mounted) {
            
            return
        }
        
        const interval = setInterval(() => {
            
            setDirection("right")
            setIndex((prevIndex) => {
                const newIndex = (prevIndex + 1) % total
                
                return newIndex
            })
        }, 5000)
        
        return () => {
            
            clearInterval(interval)
        }
    }, [mounted, total])

    return (
        <>
            {/* DESKTOP TICKER */}
            <section className="bg-[#ef5824] hidden sm:block relative z-20 !p-0" style={{height: '40px'}}>
                <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
                    <button
                        onClick={(e) => {
                            
                            e.preventDefault()
                            prev()
                        }}
                        className="text-white text-2xl font-bold px-3 hover:opacity-80 transition-opacity cursor-pointer"
                        aria-label="Previous product"
                        type="button"
                    >
                        ‹
                    </button>

                    <div className="relative overflow-hidden flex-1 h-8">
                        <div
                            key={`ticker-${index}`}
                            className={`
                                absolute inset-0 flex items-center justify-center gap-4
                                transition-transform duration-300 ease-in-out
                                ${direction === "right" ? "animate-slide-left" : "animate-slide-right"}
                            `}
                        >
                            <h3 className="text-white font-semibold">
                                {discount && `Sale ${discount}% off! `}{product.title}
                            </h3>

                            <Link to={`/products/${product.handle}`}>
                                <Button
                                    size="sm"
                                    className="bg-[#2092bb] hover:bg-[#1a7aa0] text-white"
                                >
                                    View Product
                                </Button>
                            </Link>
                        </div>
                    </div>

                    <button
                        onClick={(e) => {
                            
                            e.preventDefault()
                            next()
                        }}
                        className="text-white text-2xl font-bold px-3 hover:opacity-80 transition-opacity cursor-pointer"
                        aria-label="Next product"
                        type="button"
                    >
                        ›
                    </button>
                </div>
            </section>

            {/* MOBILE TICKER */}
            <section
                className="bg-[#ef5824] py-3 sm:hidden relative z-20"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                <div className="max-w-7xl mx-auto px-4">
                    <Link
                        to={`/products/${product.handle}`}
                        className="
                            block
                            text-white text-lg font-bold text-center
                            leading-snug
                            min-h-[3.5rem]
                            flex items-center justify-center
                            select-none
                        "
                    >
                        {discount && `SALE! ${discount}% off! `}{product.title}
                    </Link>
                </div>
            </section>
        </>
    )
}