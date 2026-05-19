export default function Products() {

  return (

    <section className="py-24 px-6 bg-white">

      <div className="max-w-7xl mx-auto">

        {/* HEADER */}

        <div className="text-center mb-16">

          <h2 className="text-5xl font-bold text-green-900">
            AI-Recommended Farm Inputs
          </h2>

          <p className="text-gray-600 mt-4 text-lg">

            Personalized fertilizer and crop protection
            recommendations based on weather,
            soil conditions, and crop type.

          </p>

        </div>

        {/* PRODUCT GRID */}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

          {/* PRODUCT 1 */}

          <div className="glass rounded-[2rem] overflow-hidden shadow-xl">

            <div className="h-52 bg-gradient-to-br from-green-700 to-green-500 flex items-center justify-center text-7xl">

              🌱

            </div>

            <div className="p-8">

              <div className="flex justify-between items-center mb-4">

                <h3 className="text-3xl font-bold text-green-900">
                  CropBoost NPK
                </h3>

                <span className="bg-green-100 text-green-800 px-4 py-1 rounded-full text-sm font-bold">

                  Recommended

                </span>

              </div>

              <p className="text-gray-600 leading-relaxed mb-6">

                Ideal for rice cultivation during
                high-moisture conditions.
                Improves root strength and crop growth.

              </p>

              <div className="space-y-3 mb-8">

                <div className="flex justify-between">

                  <span className="text-gray-500">
                    Best For
                  </span>

                  <span className="font-bold text-green-900">
                    Rice
                  </span>

                </div>

                <div className="flex justify-between">

                  <span className="text-gray-500">
                    Soil Type
                  </span>

                  <span className="font-bold text-green-900">
                    Clay Soil
                  </span>

                </div>

                <div className="flex justify-between">

                  <span className="text-gray-500">
                    Usage Timing
                  </span>

                  <span className="font-bold text-green-900">
                    Before Rainfall
                  </span>

                </div>

              </div>

              <button className="w-full bg-green-800 hover:bg-green-900 text-white py-4 rounded-2xl font-bold transition">

                View Recommendation

              </button>

            </div>

          </div>

          {/* PRODUCT 2 */}

          <div className="glass rounded-[2rem] overflow-hidden shadow-xl">

            <div className="h-52 bg-gradient-to-br from-yellow-500 to-orange-400 flex items-center justify-center text-7xl">

              🧪

            </div>

            <div className="p-8">

              <div className="flex justify-between items-center mb-4">

                <h3 className="text-3xl font-bold text-green-900">
                  FungusShield Pro
                </h3>

                <span className="bg-yellow-100 text-yellow-700 px-4 py-1 rounded-full text-sm font-bold">

                  Weather Alert

                </span>

              </div>

              <p className="text-gray-600 leading-relaxed mb-6">

                Recommended due to high humidity
                and expected rainfall conditions.
                Protects crops from fungal infections.

              </p>

              <div className="space-y-3 mb-8">

                <div className="flex justify-between">

                  <span className="text-gray-500">
                    Risk Level
                  </span>

                  <span className="font-bold text-red-600">
                    High
                  </span>

                </div>

                <div className="flex justify-between">

                  <span className="text-gray-500">
                    Humidity
                  </span>

                  <span className="font-bold text-green-900">
                    82%
                  </span>

                </div>

                <div className="flex justify-between">

                  <span className="text-gray-500">
                    Action Time
                  </span>

                  <span className="font-bold text-green-900">
                    Within 24 Hours
                  </span>

                </div>

              </div>

              <button className="w-full bg-yellow-500 hover:bg-yellow-600 text-green-950 py-4 rounded-2xl font-bold transition">

                Prevent Crop Damage

              </button>

            </div>

          </div>

          {/* PRODUCT 3 */}

          <div className="glass rounded-[2rem] overflow-hidden shadow-xl">

            <div className="h-52 bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-7xl">

              🚜

            </div>

            <div className="p-8">

              <div className="flex justify-between items-center mb-4">

                <h3 className="text-3xl font-bold text-green-900">
                  YieldMax Booster
                </h3>

                <span className="bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-sm font-bold">

                  Profit Optimized

                </span>

              </div>

              <p className="text-gray-600 leading-relaxed mb-6">

                Improves crop productivity and
                increases expected market yield
                before harvest season.

              </p>

              <div className="space-y-3 mb-8">

                <div className="flex justify-between">

                  <span className="text-gray-500">
                    Expected Profit Boost
                  </span>

                  <span className="font-bold text-green-700">
                    +18%
                  </span>

                </div>

                <div className="flex justify-between">

                  <span className="text-gray-500">
                    Crop Type
                  </span>

                  <span className="font-bold text-green-900">
                    Maize
                  </span>

                </div>

                <div className="flex justify-between">

                  <span className="text-gray-500">
                    Best Season
                  </span>

                  <span className="font-bold text-green-900">
                    Monsoon
                  </span>

                </div>

              </div>

              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-bold transition">

                Increase Yield

              </button>

            </div>

          </div>

        </div>

      </div>

    </section>

  );

}