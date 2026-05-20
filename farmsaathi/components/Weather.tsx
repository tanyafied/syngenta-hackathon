"use client";

interface WeatherProps {
  activeLocation?: string;
  temperature?: number;
  humidity?: number;
}

export default function Weather({ 
  activeLocation = "Chennai", 
  temperature = 32.4, 
  humidity = 78 
}: WeatherProps) {
  
  return (
    <section id="weather" className="py-24 px-6 bg-[#f4f8f4] scroll-mt-20">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-green-950">
            Personalized Farm Intelligence
          </h2>
          <p className="text-gray-600 mt-4 text-lg">
            Real-time weather analysis, crop predictions, and smart agricultural alerts based on your active farm location.
          </p>
        </div>

        {/* METRICS DISPATCH PANELS */}
        <div className="grid lg:grid-cols-3 gap-8">

          {/* WEATHER METRIC CARD */}
          <div className="bg-green-900/90 rounded-[2rem] p-8 shadow-xl text-white border border-green-700">
            <div className="flex justify-between items-center mb-8">
              <div>
                <p className="text-green-100">Current Weather</p>
                <h3 className="text-3xl font-bold text-white">
                  {activeLocation}
                </h3>
              </div>
              <div className="text-5xl">☀️</div>
            </div>

            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-green-800 pb-4">
                <span className="text-green-200">Temperature</span>
                <span className="text-2xl font-bold">{temperature.toFixed(1)}°C</span>
              </div>
              <div className="flex justify-between items-center border-b border-green-800 pb-4">
                <span className="text-green-200">Humidity</span>
                <span className="text-2xl font-bold">{humidity}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-green-200">Condition</span>
                <span className="text-xl font-bold text-yellow-400">Optimal Wind Array</span>
              </div>
            </div>
          </div>

          {/* ANALYSIS PREDICTION INSIGHT */}
          <div className="bg-white rounded-[2rem] p-8 shadow-xl border border-green-100">
            <h3 className="text-3xl font-bold text-green-950 mb-6">Crop Focus</h3>
            <p className="text-gray-600 mb-8">
              Based on the geographic parameters calculated for <strong className="text-green-900">{activeLocation}</strong>, overall soil stability matrices look healthy.
            </p>
            <div className="bg-green-50 rounded-2xl p-6 text-center">
              <p className="text-green-700 font-semibold uppercase text-xs tracking-wider mb-2">Highly Recommended</p>
              <p className="text-4xl font-black text-green-900">Paddy / Maize</p>
            </div>
          </div>

          {/* INTELLIGENT ALERTS SUB-SECTION */}
          <div className="bg-green-950 rounded-[2rem] p-8 shadow-xl border border-green-800">
            <h3 className="text-3xl font-bold text-white mb-8">Smart Alerts</h3>
            <div className="space-y-5">
              
              <div className="bg-red-50 border border-red-100 rounded-2xl p-5">
                <h4 className="font-bold text-red-700 mb-2">🚨 Humidity Warning</h4>
                <p className="text-gray-600 text-sm">
                  Relative moisture matrix matching active historical configurations mapped for {activeLocation}.
                </p>
              </div>

              <div className="bg-yellow-50 border border-yellow-100 rounded-2xl p-5">
                <h4 className="font-bold text-yellow-700 mb-2">🌧️ Precipitation Window</h4>
                <p className="text-gray-600 text-sm">
                  Localized showers expected across the regional sector bounds tonight.
                </p>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}