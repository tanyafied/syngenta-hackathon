export default function Analytics() {

  return (

    <section className="py-24 px-6 bg-[#f7faf7]">

      <div className="max-w-7xl mx-auto">

        {/* HEADER */}

        <div className="text-center mb-16">

          <h2 className="text-5xl font-bold text-green-900">
            Agricultural Intelligence Insights
          </h2>

          <p className="text-gray-600 mt-4 text-lg">

            Insights generated from farming datasets,
            weather patterns, cultivation trends,
            and regional market analysis.

          </p>

        </div>

        {/* TOP STATS */}

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">

          <div className="glass rounded-[2rem] p-8 shadow-xl">

            <p className="text-gray-500 mb-3">
              Farmers Analyzed
            </p>

            <h3 className="text-5xl font-black text-green-900">
              12K+
            </h3>

            <p className="text-green-700 mt-4 font-semibold">
              Active regional profiles
            </p>

          </div>

          <div className="glass rounded-[2rem] p-8 shadow-xl">

            <p className="text-gray-500 mb-3">
              Avg Profit Increase
            </p>

            <h3 className="text-5xl font-black text-green-900">
              +18%
            </h3>

            <p className="text-green-700 mt-4 font-semibold">
              Smart cultivation planning
            </p>

          </div>

          <div className="glass rounded-[2rem] p-8 shadow-xl">

            <p className="text-gray-500 mb-3">
              Rainfall Prediction Accuracy
            </p>

            <h3 className="text-5xl font-black text-green-900">
              92%
            </h3>

            <p className="text-green-700 mt-4 font-semibold">
              AI-assisted forecasting
            </p>

          </div>

          <div className="glass rounded-[2rem] p-8 shadow-xl">

            <p className="text-gray-500 mb-3">
              Disease Risk Alerts
            </p>

            <h3 className="text-5xl font-black text-green-900">
              4.2K
            </h3>

            <p className="text-green-700 mt-4 font-semibold">
              Early warnings delivered
            </p>

          </div>

        </div>

        {/* INSIGHT GRID */}

        <div className="grid lg:grid-cols-2 gap-10">

          {/* LEFT */}

          <div className="glass rounded-[2rem] p-10 shadow-xl">

            <h3 className="text-3xl font-bold text-green-900 mb-8">
              Regional Crop Intelligence
            </h3>

            <div className="space-y-6">

              <div className="flex justify-between items-center">

                <div>

                  <h4 className="font-bold text-lg text-green-900">
                    Odisha
                  </h4>

                  <p className="text-gray-500">
                    Rice cultivation demand rising
                  </p>

                </div>

                <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full font-bold">
                  +24%
                </span>

              </div>

              <div className="flex justify-between items-center">

                <div>

                  <h4 className="font-bold text-lg text-green-900">
                    Punjab
                  </h4>

                  <p className="text-gray-500">
                    Wheat market stable
                  </p>

                </div>

                <span className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full font-bold">
                  Stable
                </span>

              </div>

              <div className="flex justify-between items-center">

                <div>

                  <h4 className="font-bold text-lg text-green-900">
                    Karnataka
                  </h4>

                  <p className="text-gray-500">
                    Maize profitability increasing
                  </p>

                </div>

                <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full font-bold">
                  +18%
                </span>

              </div>

              <div className="flex justify-between items-center">

                <div>

                  <h4 className="font-bold text-lg text-green-900">
                    Maharashtra
                  </h4>

                  <p className="text-gray-500">
                    Rainfall fluctuations detected
                  </p>

                </div>

                <span className="bg-red-100 text-red-700 px-4 py-2 rounded-full font-bold">
                  Alert
                </span>

              </div>

            </div>

          </div>

          {/* RIGHT */}

          <div className="rounded-[2rem] p-10 shadow-xl bg-green-950 text-white">

            <h3 className="text-3xl font-bold mb-8">
              AI-Based Smart Predictions
            </h3>

            <div className="space-y-6">

              <div className="bg-white/10 rounded-2xl p-6">

                <h4 className="text-yellow-400 font-bold text-xl mb-3">
                  🌧 Rainfall Forecast
                </h4>

                <p className="text-green-100">

                  Heavy rainfall expected within
                  next 48 hours across eastern regions.

                </p>

              </div>

              <div className="bg-white/10 rounded-2xl p-6">

                <h4 className="text-yellow-400 font-bold text-xl mb-3">
                  🦠 Disease Risk Detection
                </h4>

                <p className="text-green-100">

                  High humidity conditions may
                  increase fungus growth risk in rice crops.

                </p>

              </div>

              <div className="bg-white/10 rounded-2xl p-6">

                <h4 className="text-yellow-400 font-bold text-xl mb-3">
                  💰 Market Prediction
                </h4>

                <p className="text-green-100">

                  Rice prices expected to increase
                  by 12% during upcoming harvest cycle.

                </p>

              </div>

            </div>

          </div>

        </div>

      </div>

    </section>

  );

}