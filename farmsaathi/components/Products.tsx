"use client";

export default function Products() {
  return (
    // 💡 Added syngenta-products anchor point and scroll margin offsets
    <section id="syngenta-products" className="py-24 px-6 bg-white scroll-mt-24">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="text-center mb-16">
          <span className="text-sm font-bold text-green-700 uppercase tracking-widest bg-green-50 px-4 py-1.5 rounded-full">
            Syngenta Portfolio Collaboration
          </span>
          <h2 className="text-5xl font-bold text-green-900 mt-4">
            AI-Recommended Farm Inputs
          </h2>
          <p className="text-gray-600 mt-4 text-lg max-w-2xl mx-auto">
            Personalized crop protection, biostimulants, and crop nutrition recommendations tailored to your active regional weather data profiles.
          </p>
        </div>

        {/* PRODUCT GRID */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

          {/* PRODUCT 1 — SYNGENTA VIRTAKO */}
          <div className="glass bg-[#fbfdfb] border border-green-900/5 rounded-[2rem] overflow-hidden shadow-xl hover:shadow-2xl transition duration-300">
            <div className="h-52 bg-gradient-to-br from-green-700 to-emerald-500 flex items-center justify-center text-7xl select-none">
              🌱
            </div>
            <div className="p-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-black text-green-950">
                  Syngenta Virtako
                </h3>
                <span className="bg-green-100 text-green-800 px-4 py-1 rounded-full text-sm font-bold">
                  Recommended
                </span>
              </div>
              <p className="text-gray-600 leading-relaxed mb-6 h-20">
                Advanced lepidopteran crop protection. Ideal for controlling stem borer anomalies inside coastal crop sectors.
              </p>
              
              <div className="space-y-3 mb-8 border-t border-b border-gray-100 py-4">
                <div className="flex justify-between">
                  <span className="text-gray-500">Best For</span>
                  <span className="font-bold text-green-900">Rice / Paddy</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Soil Application</span>
                  <span className="font-bold text-green-900">Clay & Loam</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Usage Window</span>
                  <span className="font-bold text-green-900">Tillering Stage</span>
                </div>
              </div>

              <button className="w-full bg-green-800 hover:bg-green-900 text-white py-4 rounded-2xl font-bold transition shadow-md active:scale-[0.98]">
                View Application Guide
              </button>
            </div>
          </div>

          {/* PRODUCT 2 — SYNGENTA AMISTAR TOP */}
          <div className="glass bg-[#fbfdfb] border border-green-900/5 rounded-[2rem] overflow-hidden shadow-xl hover:shadow-2xl transition duration-300">
            <div className="h-52 bg-gradient-to-br from-yellow-500 to-orange-400 flex items-center justify-center text-7xl select-none">
              🧪
            </div>
            <div className="p-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-black text-green-950">
                  Amistar Top
                </h3>
                <span className="bg-yellow-100 text-yellow-800 px-4 py-1 rounded-full text-sm font-bold">
                  Humidity Alert
                </span>
              </div>
              <p className="text-gray-600 leading-relaxed mb-6 h-20">
                Broad-spectrum preventative fungicide shield protecting crop leaf integrity during high humidity indices.
              </p>

              <div className="space-y-3 mb-8 border-t border-b border-gray-100 py-4">
                <div className="flex justify-between">
                  <span className="text-gray-500">Target Risk</span>
                  <span className="font-bold text-red-600">Blast & Blight</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Active Moisture</span>
                  <span className="font-bold text-green-900">&gt; 78% Threshold</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Response Action</span>
                  <span className="font-bold text-green-900">Immediate Spray</span>
                </div>
              </div>

              <button className="w-full bg-yellow-500 hover:bg-yellow-600 text-green-950 py-4 rounded-2xl font-bold transition shadow-md active:scale-[0.98]">
                Deploy Crop Shield
              </button>
            </div>
          </div>

          {/* PRODUCT 3 — SYNGENTA QUANTIS */}
          <div className="glass bg-[#fbfdfb] border border-green-900/5 rounded-[2rem] overflow-hidden shadow-xl hover:shadow-2xl transition duration-300">
            <div className="h-52 bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-7xl select-none">
              🚜
            </div>
            <div className="p-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-black text-green-950">
                  Syngenta Quantis
                </h3>
                <span className="bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-sm font-bold">
                  Yield Booster
                </span>
              </div>
              <p className="text-gray-600 leading-relaxed mb-6 h-20">
                Premium anti-stress biostimulant formulation optimizing photosynthetic responses during heat waves.
              </p>

              <div className="space-y-3 mb-8 border-t border-b border-gray-100 py-4">
                <div className="flex justify-between">
                  <span className="text-gray-500">Performance Yield</span>
                  <span className="font-bold text-green-700">+15% Average Boost</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Stress Resilience</span>
                  <span className="font-bold text-green-900">Thermal / Drought</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Best Optimization</span>
                  <span className="font-bold text-green-900">Flowering Phase</span>
                </div>
              </div>

              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-bold transition shadow-md active:scale-[0.98]">
                Optimize Crop Yield
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}