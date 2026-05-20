"use client";

import { useState } from "react";

export default function Register() {

  const [location, setLocation] = useState("Detect My Location");
  const [showInsights, setShowInsights] = useState(false);

  const detectLocation = () => {

    navigator.geolocation.getCurrentPosition((position) => {

      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      setLocation(`Lat: ${lat.toFixed(2)}, Lon: ${lon.toFixed(2)}`);

    });

  };

  return (

    <section
      id="register"
      className="py-24 px-6 bg-[#F5F5DC]"
    >

      <div className="max-w-7xl mx-auto">

        {/* TITLE */}

        <div className="text-center mb-16">

          <h2 className="text-5xl font-black text-green-950 mb-4">
            Register Your Farm
          </h2>

          <p className="text-xl text-green-900">

            Enable location-based crop recommendations,
            weather intelligence, fertilizer suggestions,
            and profit prediction.

          </p>

        </div>

        {/* MAIN GRID */}

        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* LEFT CARD */}

          <div className="bg-white rounded-[3rem] p-10 shadow-2xl border border-green-100">

            <div className="space-y-6">

              <input
                type="text"
                placeholder="Farmer Name"
                className="w-full p-5 rounded-2xl border border-green-200 bg-[#f8fff8] text-green-950 text-lg font-medium placeholder:text-gray-500"
              />

              <input
                type="text"
                placeholder="Phone Number"
                className="w-full p-5 rounded-2xl border border-green-200 bg-[#f8fff8] text-green-950 text-lg font-medium placeholder:text-gray-500"
              />

              <select
                className="w-full p-5 rounded-2xl border border-green-200 bg-[#f8fff8] text-green-950 text-lg font-medium"
              >

                <option>Select Language</option>
                <option>English</option>
                <option>Hindi</option>
                <option>Odia</option>
                <option>Bengali</option>
                <option>Tamil</option>

              </select>

              <input
                type="text"
                placeholder="Farm Size (in acres)"
                className="w-full p-5 rounded-2xl border border-green-200 bg-[#f8fff8] text-green-950 text-lg font-medium placeholder:text-gray-500"
              />

              <select
                className="w-full p-5 rounded-2xl border border-green-200 bg-[#f8fff8] text-green-950 text-lg font-medium"
              >

                <option>Select Soil Type</option>
                <option>Clay Soil</option>
                <option>Loamy Soil</option>
                <option>Sandy Soil</option>

              </select>

              {/* LOCATION BUTTON */}

              <button
                onClick={detectLocation}
                className="w-full bg-green-800 hover:bg-green-900 text-white py-5 rounded-2xl font-bold text-lg transition"
              >

                📍 {location}

              </button>

              {/* GENERATE BUTTON */}

              <button
                onClick={() => setShowInsights(true)}
                className="w-full bg-yellow-400 hover:bg-yellow-300 text-green-950 py-5 rounded-2xl font-black text-lg transition"
              >

                Generate Smart Farming Insights

              </button>

            </div>

          </div>

          {/* RIGHT CARD */}

          <div className="bg-gradient-to-br from-green-900 to-green-800 rounded-[3rem] p-10 shadow-2xl text-white">

            <h3 className="text-4xl font-black mb-10">
              What You’ll Get
            </h3>

            <div className="space-y-8 text-lg">

              <div className="flex gap-4">

                <span className="text-yellow-400 text-3xl">
                  🌦
                </span>

                <p className="text-green-100 font-medium">
                  Real-time weather tracking for your farm location.
                </p>

              </div>

              <div className="flex gap-4">

                <span className="text-yellow-400 text-3xl">
                  🌱
                </span>

                <p className="text-green-100 font-medium">
                  Best crop recommendations based on weather and soil.
                </p>

              </div>

              <div className="flex gap-4">

                <span className="text-yellow-400 text-3xl">
                  💰
                </span>

                <p className="text-green-100 font-medium">
                  Estimated profit predictions and market trends.
                </p>

              </div>

              <div className="flex gap-4">

                <span className="text-yellow-400 text-3xl">
                  🧪
                </span>

                <p className="text-green-100 font-medium">
                  Personalized fertilizer recommendations from FarmSaathi.
                </p>

              </div>

              <div className="flex gap-4">

                <span className="text-yellow-400 text-3xl">
                  🚨
                </span>

                <p className="text-green-100 font-medium">
                  Smart alerts for rainfall, pests,
                  fungus risks, and crop disease warnings.
                </p>

              </div>

            </div>

          </div>

        </div>

        {/* GENERATED INSIGHTS */}

        {showInsights && (

          <div className="mt-20 rounded-[3rem] p-10 shadow-2xl bg-gradient-to-br from-green-900 to-green-800 text-white">

            <div className="flex flex-col lg:flex-row gap-10">

              {/* LEFT */}

              <div className="flex-1">

                <p className="text-green-200 mb-3">
                  Personalized Farm Report
                </p>

                <h2 className="text-5xl font-black mb-10">
                  Smart Farming Insights Generated
                </h2>

                <div className="space-y-6 text-lg">

                  <div className="flex gap-4">

                    <span className="text-yellow-400 text-2xl">
                      🌾
                    </span>

                    <p>
                      Recommended Crop:
                      <strong> Rice</strong>
                    </p>

                  </div>

                  <div className="flex gap-4">

                    <span className="text-yellow-400 text-2xl">
                      💰
                    </span>

                    <p>
                      Estimated Profit:
                      <strong> ₹45,000 per acre</strong>
                    </p>

                  </div>

                  <div className="flex gap-4">

                    <span className="text-yellow-400 text-2xl">
                      🧪
                    </span>

                    <p>
                      Recommended Fertilizer:
                      <strong> FarmSaathi CropBoost NPK</strong>
                    </p>

                  </div>

                  <div className="flex gap-4">

                    <span className="text-yellow-400 text-2xl">
                      📈
                    </span>

                    <p>
                      Market Demand:
                      <strong> High</strong>
                    </p>

                  </div>

                  <div className="flex gap-4">

                    <span className="text-yellow-400 text-2xl">
                      📅
                    </span>

                    <p>
                      Best Selling Period:
                      <strong> Next 3 Weeks</strong>
                    </p>

                  </div>

                </div>

              </div>

              {/* RIGHT */}

              <div className="flex-1">

                <div className="bg-white/10 rounded-[2rem] p-8">

                  <h3 className="text-3xl font-bold mb-8">
                    Smart Alerts
                  </h3>

                  <div className="space-y-5">

                    <div className="bg-red-500/20 border border-red-300/20 rounded-2xl p-5">

                      <h4 className="font-bold text-red-200 mb-2">
                        🚨 Fungus Risk Detected
                      </h4>

                      <p className="text-green-100">

                        High moisture conditions may
                        increase fungus growth within 48 hours.

                      </p>

                    </div>

                    <div className="bg-yellow-500/20 border border-yellow-300/20 rounded-2xl p-5">

                      <h4 className="font-bold text-yellow-200 mb-2">
                        🌧 Heavy Rainfall Alert
                      </h4>

                      <p className="text-green-100">

                        90% rainfall probability expected tonight.

                      </p>

                    </div>

                    <div className="bg-green-500/20 border border-green-300/20 rounded-2xl p-5">

                      <h4 className="font-bold text-green-200 mb-2">
                        🚜 Cultivation Suggestion
                      </h4>

                      <p className="text-green-100">

                        Begin irrigation cycle before
                        upcoming rainfall window.

                      </p>

                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>

        )}

      </div>

    </section>

  );

}