// app/components/School-lunches.tsx
export function SchoolLunches() {
  return (
    <div 
      className="relative bg-[#f15d55] text-white py-16"
      style={{
        backgroundColor: '#f15d55',
        backgroundSize: 'cover',
      }}
    >
      {/* Top fade */}
      <div className="hidden md:block absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-black to-transparent" />   
      
     
      {/* Right-aligned column on desktop, centered on mobile */}
    <div className="flex justify-start md:justify-center px-4 sm:px-6 lg:px-8">
  
    {/* Two-column grid – stacks on mobile */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 items-center">
      
      {/* Left: Image column */}
      <div className="relative overflow-hidden items-start rounded-xl">
        <img
          src="/images/school-lunchessm.webp"
          alt="Katandra West Primary School Lunches"
          className=" h-auto object-cover md:aspect-square rounded-xl"
          loading="lazy"
        />
        {/* Optional subtle overlay/gradient if you want text on image later */}
        {/* <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-xl"></div> */}
      </div>
      <div
          className="
          bg-gray-900/70          /* semi-transparent dark grey — adjust opacity with /60, /70, /80 etc. */
          rounded-2xl             /* modern larger rounded corners — try rounded-xl or rounded-3xl too */
          p-8 md:p-7 lg:p-9     /* generous padding inside the box */
          shadow-2xl              /* optional: deeper modern shadow for depth */
          border border-gray-700/50  /* subtle border — optional but looks nice */
          max-w-2xl               /* keep your original max width */
          text-center md:text-left 
          animate-in fade-in slide-in-from-right duration-700 delay-300
        "
        >
      {/* Right: Content column – centered on mobile, right-aligned on desktop if preferred */}
      <div className="flex flex-col items-center md:items-center text-center md:text-left">
        <h2 className="flex justify-center text-4xl md:text-4xl lg:text-4xl font-bold mb-6 text-white leading-tight">
          Primary School Lunch Orders
        </h2>

        {/* Button and instructions */}
        <div className="flex flex-col items-center py-3 gap-6">
          <a
            href="https://www.foodbooking.com/ordering/restaurant/menu?company_uid=09c3dc3b-90e9-49db-840d-0eadc91eabf4&restaurant_uid=c4138f05-8354-4a9f-b0b0-f02fe8f1fea7&facebook=true#mi24048010"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#1e92bd] text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-[#0d7da6] transition-colors shadow-md hover:shadow-lg"
          >
            🥙 Order School Lunches
          </a>

          <p className="text-lg md:text-xl text-white/95 leading-relaxed max-w-md">
            When the order window opens,<br />
            scroll down to see school lunches.
          </p>
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