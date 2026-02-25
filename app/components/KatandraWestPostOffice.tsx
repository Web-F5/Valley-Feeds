// app/components/KatandraWestPostOffice.tsx
export function KatandraWestPostOffice() {
  return (
    <section className="bg-gray-700 py-12 relative">
      
      
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
      
          {/* Header Card */}
          <div className="bg-slate-200 rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-start gap-6">

             {/* Post Office Icon */}
            <div className="flex-shrink-0 w-42 h-42 flex items-center justify-center">
            <img 
                src="/images/post-office.svg" 
                alt="Post Office" 
                className="w-42 h-42"
            />
            </div>

              {/* Main Info */}
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-2">Katandra West LPO</h2>
                <p className="text-gray-700 mb-4">1 Queen Street, KATANDRA WEST, VIC, 3634</p>

                {/* Contact Details */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-600" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path fill="currentColor" d="M15.558 15.43l-1.813 2.539-.762-.234a8.822 8.822 0 01-3.976-2.585l-.594-.802c-1.176-1.992-1.403-4.076-1.434-5.14l-.02-.666 2.564-1.445c.733-.411 1.073-1.343.81-2.215L8.864 0l-3.69 1.14C2.252 1.794 2.007 5.024 2 8.002a17.911 17.911 0 003.038 9.924l.082.107c2.114 2.808 4.973 4.77 8.05 5.518.785.189 1.866.449 2.956.449 1.833 0 2.972-.743 3.585-2.337l1.85-4.002-3.945-2.655c-.688-.46-1.553-.283-2.058.425z"/>
                    </svg>
                    <a href="tel:0358283431" className="text-blue-600 hover:underline">
                      (03) 5828 3431
                    </a>
                  </div>

                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-600" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path fill="currentColor" d="M14 3H7v6h10V6h-3V3zm5 6h2.5c1.378 0 2.5 1.122 2.5 2.5V23H0V11.5C0 10.122 1.122 9 2.5 9H5V1h10.414l.293.293 3 3 .293.293V9zm-3.033 9c-.42 0-.759-.32-.759-.715V16.08c0-.937-2.428-1.223-3.208-1.223-.78 0-3.208.286-3.208 1.223v1.205c0 .395-.34.715-.759.715H5.758C5.34 18 5 17.68 5 17.285v-2.142c0-.95.758-1.227.758-1.227C7.413 13.333 10.13 13 12 13c1.87 0 4.587.333 6.242.916 0 0 .758.311.758 1.227v2.142c0 .395-.339.715-.758.715h-2.275z"/>
                    </svg>
                    <span className="text-gray-700">(03) 5828 3219</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Google Map Card */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
            <div className="w-full h-[400px]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3146.8247193847653!2d145.5569893!3d-36.2268599!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6b2760bdef511d51%3A0xea204115cdbe78bc!2s1%20Queen%20St%2C%20Katandra%20West%20VIC%203634!5e0!3m2!1sen!2sau!4v1738236000000!5m2!1sen!2sau"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Katandra West Post Office Location"
              />
            </div>
          </div>

          {/* Opening Hours */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <button 
              type="button"
              className="w-full flex items-center justify-between text-left"
            >
              <div className="grid grid-cols-2 gap-x-12 gap-y-2 max-w-xl mx-auto">
                <span className="text-green-700 font-semibold font-medium text-right">Open now</span>
                <span className="text-gray-600 ml-3">7:30am - 7:30pm</span>
              </div>
              <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path fill="currentColor" d="M13.434 18.44a2.065 2.065 0 01-1.435.56 2.068 2.068 0 01-1.435-.56l-.712-.679c-.015-.011-.019-.03-.033-.044L.592 8.951a1.848 1.848 0 010-2.711l.71-.68a2.098 2.098 0 012.856 0L12 13.01l7.843-7.45a2.096 2.096 0 012.854 0l.712.68c.79.747.79 1.961 0 2.71l-9.23 8.767c-.013.016-.018.033-.03.044l-.714.68z"/>
              </svg>
            </button>

            {/* Opening Hours Details */}
            <div className="flex mt-4 pt-4 border-t justify-center border-gray-200">
              <dl className="grid grid-cols-2 gap-x-12 gap-y-2 max-w-xl mx-auto">
                
                  <dt className="text-gray-700 font-medium text-right">Sunday</dt>
                  <dd className="text-gray-600">8:00am - 7:30pm</dd>
                
                  <dt className="text-gray-700 font-medium text-right">Monday</dt>
                  <dd className="text-gray-600">7:30am - 7:30pm</dd>
                
                  <dt className="text-gray-700 font-medium text-right">Tuesday</dt>
                  <dd className="text-gray-600">7:30am - 7:30pm</dd>
                
                  <dt className="text-gray-700 font-medium text-right">Wednesday</dt>
                  <dd className="text-gray-600">7:30am - 7:30pm</dd>
                
                  <dt className="text-gray-700 font-medium text-right">Thursday</dt>
                  <dd className="text-gray-600">7:30am - 5:30pm</dd>

                  <dt className="text-gray-700 font-medium text-right">Friday</dt>
                  <dd className="text-gray-600">7:30am - 7:30pm</dd>
                
                  <dt className="text-gray-700 font-medium text-right">Saturday</dt>
                  <dd className="text-gray-600">8:00am - 7:30pm</dd>
              </dl>
            </div>
          </div>

          {/* Directions Button */}
          <div className="text-center">
            <a 
              href="https://www.google.com/maps/dir//1+Queen+St,+Katandra+West+VIC+3634/@-37.019789,145.1486213,15z"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path fill="currentColor" d="M13.52.63a2.148 2.148 0 00-3.04 0L.63 10.48a2.148 2.148 0 000 3.04l9.85 9.85c.84.84 2.2.84 3.04 0l9.85-9.85c.84-.84.84-2.2 0-3.04L13.52.63zM14 7v3H8a1 1 0 00-1 1v5h2v-4h5v3l4-4-4-4z"/>
              </svg>
              Get Directions
            </a>
          </div>

        </div>
      </div>
    </section>
  );
}