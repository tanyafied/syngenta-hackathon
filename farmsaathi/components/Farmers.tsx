"use client";

import { useEffect, useState } from "react";

export default function Farmers() {
  const [farmers, setFarmers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8080/api/v1/farmers")
      .then((res) => {
        if (!res.ok) throw new Error("Backend orchestration node offline");
        return res.json();
      })
      .then((data) => {
        setFarmers(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading farmers list:", err);
        setLoading(false);
      });
  }, []);

  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-green-900">
            Registered Farmer Intelligence
          </h2>
          <p className="text-gray-600 mt-4 text-lg">
            Live farmer profiles generated from agricultural datasets, machine learning models, and regional farming trends.
          </p>
        </div>

        <div className="mb-12">
          <input
            type="text"
            placeholder="Search profiles by state name (e.g., Uttar Pradesh)..."
            className="w-full p-5 rounded-2xl border border-green-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-600 text-green-900"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {loading && (
          <div className="text-center py-12 text-gray-500 font-medium animate-pulse text-lg">
            🔄 Executing relational lookups and running ML pipeline inferences...
          </div>
        )}

        {!loading && farmers.length === 0 && (
          <div className="text-center py-12 text-red-500 font-medium">
            ⚠️ No operational records retrieved. Verify database state.
          </div>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {farmers
            .filter((farmer: any) =>
              farmer.state?.toLowerCase().includes(search.toLowerCase())
            )
            .map((farmer: any, index) => (
              <div
                key={index}
                className="glass rounded-[2rem] p-8 shadow-xl border border-green-50 bg-gradient-to-br from-white to-green-50/20 hover:shadow-2xl transition duration-300"
              >
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">
                      Farmer Profile Handle
                    </p>
                    <h3 className="text-2xl font-bold text-green-900">
                      #{farmer.grower_id}
                    </h3>
                  </div>
                  <div className="text-5xl bg-white p-3 rounded-2xl shadow-inner border border-green-100">
                    🌾
                  </div>
                </div>

                <div className="space-y-4 border-b border-gray-100 pb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 font-medium text-sm">Regional State</span>
                    <span className="font-bold text-green-900 text-sm">{farmer.state}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 font-medium text-sm">Preferred Language</span>
                    <span className="font-bold text-green-900 text-sm">{farmer.language}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 font-medium text-sm">Current Crop Type</span>
                    <span className="font-bold text-green-900 text-sm">{farmer.grower_crop_calendar}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 font-medium text-sm">Persona Grouping</span>
                    <span className="font-bold text-blue-700 text-sm px-2.5 py-0.5 bg-blue-50 rounded-full">
                      {farmer.persona || "Traditionalist"}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 font-medium text-sm">AI Input Match</span>
                    <span className="font-bold text-yellow-600 bg-yellow-50 px-3 py-1 rounded-xl text-sm border border-yellow-200">
                      {farmer.recommended_product || "Tilt 250 EC"}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 font-medium text-sm">Conversion Target</span>
                    <span className="font-bold text-green-700 text-sm">
                      {farmer.conversion_probability}% Prob.
                    </span>
                  </div>
                </div>

                <div className="mt-6 space-y-2">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Mandi Marketplace Link</p>
                  <div className="flex justify-between text-xs bg-white p-3 rounded-xl border border-gray-100 shadow-inner">
                    <div>
                      <p className="text-gray-400">Current Base Rate</p>
                      <p className="font-bold text-gray-700">{farmer.mandi_context?.market_rate}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-green-600 font-medium">Premium Yield Rate</p>
                      <p className="font-bold text-green-700">{farmer.mandi_context?.premium_rate}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-100 rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">🌤️</span>
                    <h4 className="font-bold text-yellow-800 text-sm">
                      Climate Risk Index ({farmer.temperature}°C)
                    </h4>
                  </div>
                  <p className="text-gray-600 text-xs leading-relaxed">
                    Local ambient atmospheric moisture is tracking around {farmer.humidity}%. Crop development thresholds indicate optimal spraying parameters.
                  </p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
}