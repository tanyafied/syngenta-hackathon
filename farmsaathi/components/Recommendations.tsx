"use client";

import { useEffect, useState } from "react";

const ML_API = process.env.NEXT_PUBLIC_ML_API_URL || "http://localhost:5000";

// Sample farmer profile — in real app this comes from registration/login
const SAMPLE_FARMER = {
  grower_id: "GRW_00001",
  state: "Uttar Pradesh",
  district: "Kanpur Nagar",
  language: "Hindi",
  device_type: "smartphone",
  grower_age: 45,
  grower_farm_size: 3.5,
  product_scan: false,
  offline_campaign_attended: true,
  grower_crop_calendar: {
    crop: "wheat",
    sowing: { start: "2025-11-01" },
    harvest: { start: "2026-03-20" },
    stages: [
      { stage: "tillering", approx: "2026-01-15" },
      { stage: "flowering", approx: "2026-02-20" },
    ],
  },
  campaign_crop: "wheat",
  message_sent_date: new Date().toISOString().split("T")[0],
};

export default function Recommendations() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchRecommendation = async () => {
      try {
        const res = await fetch(`${ML_API}/predict/full`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(SAMPLE_FARMER),
        });
        const json = await res.json();
        setData(json);
      } catch (e) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchRecommendation();
  }, []);

  const product = data?.predictions?.product;
  const channel = data?.predictions?.channel;
  const conversion = data?.predictions?.conversion;
  const segment = data?.segment;
  const weather = data?.weather;
  const timing = data?.predictions?.timing;

  const tierColor: Record<string, string> = {
    top: "bg-green-100 text-green-800",
    mid: "bg-yellow-100 text-yellow-700",
    low: "bg-red-100 text-red-700",
  };

  const channelIcon: Record<string, string> = {
    WhatsApp: "💬",
    SMS: "📱",
    Voice: "📞",
    "Retailer Visit": "🏪",
  };

  return (
    <section className="py-24 px-6 bg-gradient-to-b from-green-50 to-white">
      <div className="max-w-7xl mx-auto">

        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-green-900">
            Personalized Farmer Guidance
          </h2>
          <p className="text-gray-600 mt-4 text-lg">
            Real-time crop support powered by AI — based on your crop,
            location, and live weather conditions.
          </p>
        </div>

        {loading && (
          <div className="text-center text-green-700 text-xl py-20">
            🌾 Loading your personalized recommendations...
          </div>
        )}

        {error && (
          <div className="text-center text-red-500 text-lg py-20">
            ⚠️ Could not connect to ML server. Make sure api.py is running.
          </div>
        )}

        {data && !loading && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

            {/* LEFT — Product Recommendation */}
            <div className="glass rounded-[2rem] p-8 shadow-xl">

              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <div>
                  <p className="text-gray-500">Farmer Persona</p>
                  <h3 className="text-2xl font-bold text-green-900">
                    {segment?.persona || "Farmer"}
                  </h3>
                </div>
                <span className={`px-4 py-2 rounded-full font-bold text-sm ${tierColor[conversion?.conversion_tier] || "bg-gray-100 text-gray-700"}`}>
                  {conversion?.conversion_tier?.toUpperCase()} PRIORITY
                </span>
              </div>

              {/* Product */}
              <div className="bg-green-50 rounded-2xl p-5 mb-4">
                <p className="text-gray-500 text-sm mb-1">🌿 Recommended Product</p>
                <p className="text-2xl font-bold text-green-900">
                  {product?.recommended_product || "—"}
                </p>
                <p className="text-sm text-green-700 mt-1">
                  Confidence: {((product?.confidence || 0) * 100).toFixed(0)}%
                </p>
              </div>

              {/* Top 3 products */}
              {product?.top_3_products?.length > 0 && (
                <div className="space-y-2 mb-4">
                  <p className="text-gray-500 text-sm font-medium">Also recommended:</p>
                  {product.top_3_products.slice(1).map((p: any, i: number) => (
                    <div key={i} className="flex justify-between items-center bg-white rounded-xl px-4 py-2 border border-green-100">
                      <span className="text-green-900 font-medium">{p.product}</span>
                      <span className="text-gray-500 text-sm">{(p.score * 100).toFixed(0)}%</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Channel */}
              <div className="bg-white rounded-2xl p-4 border border-green-100">
                <p className="text-gray-500 text-sm mb-1">Best Channel to Reach</p>
                <p className="text-xl font-bold text-green-900">
                  {channelIcon[channel?.recommended_channel] || "📢"}{" "}
                  {channel?.recommended_channel || "WhatsApp"}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Fallback: {channel?.fallback_channel}
                </p>
              </div>

              {/* Conversion score */}
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-500">Conversion Probability</span>
                  <span className="font-bold text-green-800">
                    {conversion?.priority_score?.toFixed(1)}/100
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3">
                  <div
                    className="bg-green-600 h-3 rounded-full transition-all duration-700"
                    style={{ width: `${Math.min(conversion?.priority_score || 0, 100)}%` }}
                  />
                </div>
              </div>

              <button className="mt-8 bg-green-700 hover:bg-green-800 text-white px-6 py-3 rounded-xl transition w-full font-bold">
                View Full Guidance
              </button>
            </div>

            {/* RIGHT — Weather + Timing */}
            <div className="glass rounded-[2rem] p-8 shadow-xl">

              {/* Weather */}
              <div className="mb-6">
                <p className="text-gray-500 text-sm mb-3">📍 Live Conditions — {SAMPLE_FARMER.district}</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 rounded-2xl p-4 text-center">
                    <p className="text-3xl font-bold text-blue-800">
                      {weather?.temperature?.toFixed(1)}°C
                    </p>
                    <p className="text-blue-600 text-sm mt-1">Temperature</p>
                  </div>
                  <div className="bg-cyan-50 rounded-2xl p-4 text-center">
                    <p className="text-3xl font-bold text-cyan-800">
                      {weather?.humidity?.toFixed(0)}%
                    </p>
                    <p className="text-cyan-600 text-sm mt-1">Humidity</p>
                  </div>
                </div>

                {/* Alerts */}
                <div className="mt-4 space-y-2">
                  {weather?.disease_alert && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-2">
                      <span>🚨</span>
                      <p className="text-red-700 text-sm font-medium">
                        High disease pressure detected! Apply fungicide soon.
                      </p>
                    </div>
                  )}
                  {weather?.is_raining && (
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 flex items-center gap-2">
                      <span>🌧️</span>
                      <p className="text-blue-700 text-sm font-medium">
                        Currently raining — farmer is likely at home and reachable.
                      </p>
                    </div>
                  )}
                  {!weather?.disease_alert && !weather?.is_raining && (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-3 flex items-center gap-2">
                      <span>✅</span>
                      <p className="text-green-700 text-sm font-medium">
                        Normal conditions — good time for campaign outreach.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Timing */}
              <div className="bg-yellow-50 rounded-2xl p-5 border border-yellow-100">
                <p className="font-bold text-yellow-800 mb-3">⏰ Campaign Timing</p>
                <div className="space-y-2 text-sm text-gray-700">
                  <p>📅 Best window: <strong>{timing?.recommended_window}</strong></p>
                  <p>📆 Best day: <strong>{timing?.best_send_day}</strong></p>
                  <p>
                    {timing?.is_optimal_timing
                      ? "✅ Now is optimal timing for this farmer"
                      : "⚠️ Not the ideal timing window — consider scheduling"}
                  </p>
                  {timing?.harvest_urgency && (
                    <p className="text-red-600 font-bold">
                      🔴 Harvest approaching — act immediately!
                    </p>
                  )}
                </div>
              </div>

              {/* Nearest dealer placeholder */}
              <div className="mt-4 bg-white rounded-2xl p-5 border border-green-100">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-gray-500 text-sm">Trusted Nearby Dealer</p>
                    <p className="text-xl font-bold text-green-900">GreenGrow Agro Center</p>
                  </div>
                  <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full font-bold text-sm">
                    4.8 ★
                  </span>
                </div>
                <div className="flex gap-3 mt-4">
                  <button className="bg-yellow-500 hover:bg-yellow-600 text-green-900 px-4 py-2 rounded-xl font-bold transition text-sm">
                    Contact Dealer
                  </button>
                  <button className="border border-green-700 text-green-700 px-4 py-2 rounded-xl hover:bg-green-50 transition text-sm">
                    Get Directions
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}
      </div>
    </section>
  );
}
