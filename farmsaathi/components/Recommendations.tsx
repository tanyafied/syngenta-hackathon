export default function Recommendations() {
  return (
    <section className="py-24 px-6 bg-gradient-to-b from-green-50 to-white">

      <div className="max-w-7xl mx-auto">

        <div className="text-center mb-16">

          <h2 className="text-5xl font-bold text-green-900">
            Personalized Farmer Guidance
          </h2>

          <p className="text-gray-600 mt-4 text-lg">
            Real-time crop support based on weather,
            location, and regional farming patterns.
          </p>

        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

          {/* LEFT CARD */}

          <div className="glass rounded-[2rem] p-8 shadow-xl">

            <div className="flex justify-between items-center mb-6">

              <div>
                <p className="text-gray-500">
                  Recommended Crop
                </p>

                <h3 className="text-3xl font-bold text-green-900">
                  Rice
                </h3>
              </div>

              <span className="bg-green-100 text-green-800 px-4 py-2 rounded-full font-bold">
                High Yield
              </span>

            </div>

            <div className="space-y-4 text-gray-700">

              <p>
                🌧️ Rainfall expected in next 5 days.
              </p>

              <p>
                🌱 Soil moisture ideal for sowing.
              </p>

              <p>
                🧪 Recommended Fertilizer:
                <strong> Syngenta NPK Plus</strong>
              </p>

              <p>
                📍 Best sowing period:
                <strong> This Week</strong>
              </p>

            </div>

            <button className="mt-8 bg-green-700 hover:bg-green-800 text-white px-6 py-3 rounded-xl transition">
              View Full Guidance
            </button>

          </div>

          {/* RIGHT CARD */}

          <div className="glass rounded-[2rem] p-8 shadow-xl">

            <div className="flex justify-between items-center mb-6">

              <div>
                <p className="text-gray-500">
                  Trusted Nearby Dealer
                </p>

                <h3 className="text-3xl font-bold text-green-900">
                  GreenGrow Agro Center
                </h3>
              </div>

              <span className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full font-bold">
                4.8 ★
              </span>

            </div>

            <div className="space-y-4 text-gray-700">

              <p>
                📍 Distance:
                <strong> 3.2 km away</strong>
              </p>

              <p>
                🚜 Available Products:
                <strong> Fertilizers, Pesticides</strong>
              </p>

              <p>
                📞 Offline support available through call service.
              </p>

              <p>
                🌐 Language Support:
                <strong> Odia, Hindi, English</strong>
              </p>

            </div>

            <div className="flex gap-4 mt-8">

              <button className="bg-yellow-500 hover:bg-yellow-600 text-green-900 px-6 py-3 rounded-xl font-bold transition">
                Contact Dealer
              </button>

              <button className="border border-green-700 text-green-700 px-6 py-3 rounded-xl hover:bg-green-50 transition">
                Get Directions
              </button>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}