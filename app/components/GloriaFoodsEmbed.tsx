// app/components/GloriaFoodsEmbed.tsx
export function GloriaFoodsEmbed() {
  return (
    <div className="container mx-auto px-6 py-12">
      <h2 className="text-3xl font-bold mb-6">Order Online</h2>
      
      {/* iframe container with responsive sizing */}
      <div className="relative w-full" style={{paddingBottom: '100%'}}>
        <iframe
          src="https://www.foodbooking.com/ordering/restaurant/menu?company_uid=09c3dc3b-90e9-49db-840d-0eadc91eabf4&restaurant_uid=c4138f05-8354-4a9f-b0b0-f02fe8f1fea7&facebook=true#mi24048007"
          className="absolute top-0 left-0 w-full h-full border-0 rounded-lg shadow-lg"
          title="Gloria Foods Menu"
          allow="payment"
        />
      </div>
      
      {/* Fallback link */}
      <p className="mt-4 text-center text-sm text-gray-600">
        Having trouble? <a 
          href="https://www.foodbooking.com/ordering/restaurant/menu?company_uid=09c3dc3b-90e9-49db-840d-0eadc91eabf4&restaurant_uid=c4138f05-8354-4a9f-b0b0-f02fe8f1fea7&facebook=true"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          Open menu in new window
        </a>
      </p>
    </div>
  );
}