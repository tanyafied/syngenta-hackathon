"use client";

import { useEffect, useState } from "react";

const alerts = [
  "🌧️ Heavy rainfall expected in Odisha tomorrow.",
  "🧪 Fertilizer recommendation updated for rice farmers.",
  "🚜 New trusted dealer added near Bhubaneswar.",
  "📈 Farmer engagement increased by 18% this week.",
  "🌱 Ideal sowing conditions detected this week.",
];

export default function LiveAlerts() {

  const [currentAlert, setCurrentAlert] = useState(0);

  useEffect(() => {

    const interval = setInterval(() => {
      setCurrentAlert((prev) => (prev + 1) % alerts.length);
    }, 3000);

    return () => clearInterval(interval);

  }, []);

  return (
    <section className="py-20 px-6 bg-gradient-to-r from-green-900 to-green-700 text-white overflow-hidden">

      <div className="max-w-7xl mx-auto">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">

          {/* LEFT */}

          <div>

            <h2 className="text-5xl font-bold leading-tight">
              Real-Time Agricultural Intelligence
            </h2>

            <p className="mt-6 text-green-100 text-lg">
              Live farming insights, personalized alerts,
              and smart recommendations for every farmer.
            </p>

            <div className="grid grid-cols-2 gap-6 mt-10">

              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
                <h3 className="text-4xl font-bold">
                  12K+
                </h3>

                <p className="text-green-100 mt-2">
                  Farmers Supported
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
                <h3 className="text-4xl font-bold">
                  89%
                </h3>

                <p className="text-green-100 mt-2">
                  Campaign Reach
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
                <h3 className="text-4xl font-bold">
                  2.1K
                </h3>

                <p className="text-green-100 mt-2">
                  Dealers Connected
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
                <h3 className="text-4xl font-bold">
                  95%
                </h3>

                <p className="text-green-100 mt-2">
                  Farmer Satisfaction
                </p>
              </div>

            </div>

          </div>

          {/* RIGHT */}

          <div className="glass rounded-[2rem] p-8 shadow-2xl bg-white/10 backdrop-blur-xl border border-white/20">

            <p className="text-yellow-300 font-bold mb-6">
              LIVE ALERTS
            </p>

            <div className="bg-white rounded-2xl p-8 text-green-900 min-h-[180px] flex items-center justify-center text-center shadow-xl">

              <h3 className="text-2xl font-bold leading-relaxed">
                {alerts[currentAlert]}
              </h3>

            </div>

            <button className="mt-8 w-full bg-yellow-500 hover:bg-yellow-600 text-green-900 py-4 rounded-2xl font-bold transition-all">
              View Detailed Insights
            </button>

          </div>

        </div>

      </div>

    </section>
  );
}