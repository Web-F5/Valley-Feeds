// app/components/gloriaFoodsHero.tsx
export function GloriaFoodsHero() {
  return (
    <div 
      className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16"
      style={{
        backgroundImage: 'url(/images/hamburger.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Top fade */}
      <div className="hidden md:block absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-black to-transparent" />
      
      <div className="flex justify-center md:justify-center  px-4 sm:px-6 lg:px-8">
      {/* Two-column grid – stacks on mobile */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 items-center">
      <div 
        className="
          bg-gray-900/70          /* semi-transparent dark grey — adjust opacity with /60, /70, /80 etc. */
          rounded-2xl             /* modern larger rounded corners — try rounded-xl or rounded-3xl too */
          p-8 md:p-10 lg:p-12     /* generous padding inside the box */
          shadow-2xl              /* optional: deeper modern shadow for depth */
          border border-gray-700/50  /* subtle border — optional but looks nice */
          max-w-2xl               /* keep your original max width */
          text-center md:text-left 
          animate-in fade-in slide-in-from-right duration-700 delay-300
        "
      >
      {/* Content (needs to be relative to appear above overlay) */}
      <div className="relative container mx-auto px-6">
        <h1 className="text-4xl font-bold mb-4">Place Your Food Order</h1>
        <div className="max-w-xl pt-5 text-center">
        <p className="text-xl text-center mt-4">Hamburgers, Chips, Drinks & More</p>
        </div>
        {/* Big CTA Buttons */}
        <div className="flex flex-wrap text-center justify-center py-5 gap-4">
          
          <a href="https://www.foodbooking.com/ordering/restaurant/menu?company_uid=09c3dc3b-90e9-49db-840d-0eadc91eabf4&restaurant_uid=c4138f05-8354-4a9f-b0b0-f02fe8f1fea7&facebook=true"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#1e92bd] text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-[#0d7da6] transition-colors"
          >
            🍔 Order Food Online
          </a>
             </div>
        </div>
      </div>
    </div>
  </div>
      {/* Bottom fade */}
      <div className="hidden md:block absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black to-transparent" />
    </div>
  );
}