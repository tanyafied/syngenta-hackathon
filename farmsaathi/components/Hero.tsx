"use client";

export default function Hero() {
  return (
    <section className="min-h-screen bg-gradient-to-br from-green-950 via-green-900 to-green-800 text-white px-6 pt-32">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        {/* LEFT */}
        <div>
          <div className="inline-block bg-green-700/40 px-5 py-2 rounded-full mb-6">
            🌾 Smart Farming Intelligence Platform
          </div>

          <h1 className="text-6xl font-black leading-tight mb-8">
            Know What To
            <span className="text-yellow-400"> Grow</span>,
            <br />
            When To Sell,
            <br />
            And How Much
            <span className="text-green-300"> Profit</span>
            You Can Make.
          </h1>

          <p className="text-xl text-green-100 mb-10 leading-relaxed">
            AgriConnect helps farmers with weather insights, crop recommendations,
            fertilizer suggestions, and profit prediction based on their region.
          </p>

          <div className="flex flex-wrap gap-5">
            <a href="#register">
              <button className="bg-yellow-500 hover:bg-yellow-600 text-green-950 px-8 py-4 rounded-2xl font-black text-lg shadow-lg transition">
                Get Started Now
              </button>
            </a>
            <a href="#weather">
              <button className="border-2 border-white/40 hover:border-white text-white px-8 py-4 rounded-2xl font-bold text-lg transition">
                View Live Alerts
              </button>
            </a>
          </div>
        </div>

        {/* RIGHT */}
        <div className="bg-white/5 rounded-[3rem] p-8 border border-white/10 shadow-2xl backdrop-blur-sm">
          <div className="border-b border-white/10 pb-6 mb-6">
            <h3 className="text-2xl font-bold mb-2">Live Regional Telemetry</h3>
            <p className="text-green-200 text-sm">Real-time parameters for connected farm clusters</p>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div className="bg-white/10 p-5 rounded-2xl">
              <p className="text-green-200 mb-2">Temperature</p>
              <h2 className="text-4xl font-bold">31°C</h2>
            </div>

            <div className="bg-white/10 p-5 rounded-2xl">
              <p className="text-green-200 mb-2">Rainfall</p>
              <h2 className="text-4xl font-bold">High</h2>
            </div>

            <div className="bg-white/10 p-5 rounded-2xl">
              <p className="text-green-200 mb-2">Best Crop</p>
              <h2 className="text-3xl font-bold text-yellow-400">Maize</h2>
            </div>

            <div className="bg-white/10 p-5 rounded-2xl">
              <p className="text-green-200 mb-2">Expected Profit</p>
              <h2 className="text-3xl font-bold text-green-400">₹45K</h2>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}