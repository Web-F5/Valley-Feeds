import { useState, useEffect } from "react";
import reviewsData from '~/data/reviews.json';

type Review = {
    text: string;
    name: string;
  };

export function Reviews() {
  const [open, setOpen] = useState(false);
  const [reviews] = useState<Review[]>(reviewsData);

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(true)}
        className="
            fixed 
            right-0 
            top-3/4 
            -translate-y-3/4 
            rotate-[-90deg]
            origin-bottom-right
            bg-yellow-400 
            text-black 
            font-bold 
            py-2 
            px-4 
            rounded-t-lg 
            shadow-lg 
            z-50
        "
        >
        ⭐ 5.0 ({reviews.length} reviews)
    </button>

      {/* Pop-up overlay */}
      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative">
            <button
              onClick={() => setOpen(false)}
              className="absolute top-2 right-2 text-gray-500 font-bold text-xl"
            >
              ×
            </button>
            <h2 className="text-xl font-semibold mb-2">
              Let our customers speak for us
            </h2>
            <div className="text-yellow-400 text-2xl mb-4">⭐⭐⭐⭐⭐ 5.0</div>
            <ul className="space-y-6 mb-4 max-h-60 overflow-y-auto">
            {reviews.map((review, i) => (
                <li key={i} className="text-gray-700">
                <p className="mb-2">“{review.text}”</p>
                <p className="text-sm text-gray-500 text-right">
                    — {review.name}
                </p>
                </li>
            ))}
            </ul>
            <button className="bg-yellow-400 text-black font-bold py-2 px-4 rounded-lg">
              Write a Review
            </button>
          </div>
        </div>
      )}
    </>
  );
}