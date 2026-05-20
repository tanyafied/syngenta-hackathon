export default function Weather() {

  return (

    <section
      id="weather"
      className="py-24 px-6 bg-[#f4f8f4]"
    >

      <div className="max-w-7xl mx-auto">

        {/* HEADER */}

        <div className="text-center mb-16">

          <h2 className="text-5xl font-bold text-green-950">
            Personalized Farm Intelligence
          </h2>

          <p className="text-gray-600 mt-4 text-lg">

            Real-time weather analysis,
            crop predictions, and smart agricultural alerts
            based on your farm location.

          </p>

        </div>

        {/* MAIN GRID */}

        <div className="grid lg:grid-cols-3 gap-8">

          {/* WEATHER CARD */}

          <div className="bg-green-900/90 rounded-[2rem] p-8 shadow-xl text-white border border-green-700">

            <div className="flex justify-between items-center mb-8">

              <div>

                <p className="text-green-100">
                  Current Weather
                </p>

                <h3 className="text-3xl font-bold text-white">
                  Brahmapur
                </h3>

              </div>

              <div className="text-6xl">
                🌦
              </div>

            </div>

            <div className="space-y-5">

              <div className="flex justify-between">

                <span className="text-green-100">
                  Temperature
                </span>

                <span className="font-bold text-white">
                  31°C
                </span>

              </div>

              <div className="flex justify-between">

                <span className="text-green-100">
                  Humidity
                </span>

                <span className="font-bold text-white">
                  82%
                </span>

              </div>

              <div className="flex justify-between">

                <span className="text-green-100">
                  Rainfall Chance
                </span>

                <span className="font-bold text-white">
                  90%
                </span>

              </div>

              <div className="flex justify-between">

                <span className="text-green-100">
                  Wind Speed
                </span>

                <span className="font-bold text-white">
                  14 km/h
                </span>

              </div>

            </div>

          </div>

          {/* CROP INSIGHTS */}

          <div className="bg-gradient-to-br from-green-900 to-green-800 rounded-[2rem] p-8 shadow-xl text-white border border-green-700">

            <h3 className="text-3xl font-bold mb-8">
              Smart Crop Recommendation
            </h3>

            <div className="space-y-6">

              <div>

                <p className="text-green-200 mb-2">
                  Recommended Crop
                </p>

                <h2 className="text-5xl font-black text-yellow-400">
                  Rice
                </h2>

              </div>

              <div>

                <p className="text-green-200 mb-2">
                  Expected Yield
                </p>

                <h2 className="text-3xl font-bold">
                  4.5 Tons/Acre
                </h2>

              </div>

              <div>

                <p className="text-green-200 mb-2">
                  Estimated Profit
                </p>

                <h2 className="text-3xl font-bold">
                  ₹45,000
                </h2>

              </div>

              <div className="bg-yellow-400 text-green-950 rounded-2xl p-5 font-bold">

                Best selling period:
                Next 3 Weeks

              </div>

            </div>

          </div>

          {/* ALERTS */}

          <div className="bg-green-900/90 rounded-[2rem] p-8 shadow-xl text-white border border-green-700">

            <h3 className="text-3xl font-bold text-white mb-8">
              Smart Alerts
            </h3>

            <div className="space-y-5">

              <div className="bg-red-50 border border-red-100 rounded-2xl p-5">

                <h4 className="font-bold text-red-700 mb-2">
                  🚨 Fungus Risk Alert
                </h4>

                <p className="text-gray-600 text-sm">

                  High soil moisture due to expected rainfall
                  may increase fungus growth risk.

                </p>

              </div>

              <div className="bg-yellow-50 border border-yellow-100 rounded-2xl p-5">

                <h4 className="font-bold text-yellow-700 mb-2">
                  🌧 Rainfall Warning
                </h4>

                <p className="text-gray-600 text-sm">

                  90% rainfall probability detected for tonight.

                </p>

              </div>

              <div className="bg-green-50 border border-green-100 rounded-2xl p-5">

                <h4 className="font-bold text-green-700 mb-2">
                  🧪 Fertilizer Suggestion
                </h4>

                <p className="text-gray-600 text-sm">

                  Recommended:
                  Syngenta CropBoost NPK
                  before next irrigation cycle.

                </p>

              </div>

            </div>

          </div>

        </div>

      </div>

    </section>

  );

}