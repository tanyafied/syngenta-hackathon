export default function Analytics() {
  return (
    <section id="analytics" className="py-24 px-6 bg-[#f7faf7]">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-green-900">
            Agricultural Intelligence Insights
          </h2>
          <p className="text-gray-600 mt-4 text-lg">
            Insights generated from farming datasets, weather patterns, cultivation trends, and regional market analysis.
          </p>
        </div>

        {/* TOP STATS */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <div className="glass rounded-[2rem] p-8 shadow-xl bg-white border border-green-100">
            <p className="text-gray-500 mb-3 font-medium">Farmers Analyzed</p>
            <h3 className="text-5xl font-black text-green-900">12K+</h3>
            <p className="text-green-700 mt-4 font-semibold text-sm">Active regional profiles</p>
          </div>

          <div className="glass rounded-[2rem] p-8 shadow-xl bg-white border border-green-100">
            <p className="text-gray-500 mb-3 font-medium">Accuracy Rating</p>
            <h3 className="text-5xl font-black text-green-900">94%</h3>
            <p className="text-green-700 mt-4 font-semibold text-sm">Validated model inferences</p>
          </div>

          <div className="glass rounded-[2rem] p-8 shadow-xl bg-white border border-green-100">
            <p className="text-gray-500 mb-3 font-medium">Market Mandis</p>
            <h3 className="text-5xl font-black text-green-900">45+</h3>
            <p className="text-green-700 mt-4 font-semibold text-sm">Connected commercial grids</p>
          </div>

          <div className="glass rounded-[2rem] p-8 shadow-xl bg-white border border-green-100">
            <p className="text-gray-500 mb-3 font-medium">Profit Increase</p>
            <h3 className="text-5xl font-black text-green-900">+18%</h3>
            <p className="text-green-700 mt-4 font-semibold text-sm">Average yield return margin</p>
          </div>
        </div>

        {/* PREDICTIVE REPORT CARD BULLETINS */}
        <div className="bg-gradient-to-br from-green-900 to-green-800 rounded-[3rem] p-10 text-white shadow-2xl">
          <h3 className="text-3xl font-bold mb-8">AI-Based Smart Predictions</h3>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white/10 rounded-2xl p-6 border border-white/5">
              <h4 className="text-yellow-400 font-bold text-xl mb-3">🌧 Rainfall Forecast</h4>
              <p className="text-green-100 text-sm leading-relaxed">
                Heavy rainfall expected within next 48 hours across eastern regions. Recommend temporary harvesting offsets.
              </p>
            </div>

            <div className="bg-white/10 rounded-2xl p-6 border border-white/5">
              <h4 className="text-yellow-400 font-bold text-xl mb-3">🦠 Disease Risk Detection</h4>
              <p className="text-green-100 text-sm leading-relaxed">
                High humidity conditions may increase fungus growth risk in rice crops. Track foliage signatures closely.
              </p>
            </div>

            <div className="bg-white/10 rounded-2xl p-6 border border-white/5">
              <h4 className="text-yellow-400 font-bold text-xl mb-3">💰 Market Prediction</h4>
              <p className="text-green-100 text-sm leading-relaxed">
                Cereal prices expected to increase by 12% during upcoming harvest cycle. Optimize storage setups.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}