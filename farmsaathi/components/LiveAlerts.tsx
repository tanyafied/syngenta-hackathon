"use client";

import { useEffect, useState } from "react";

const ML_API = process.env.NEXT_PUBLIC_ML_API_URL || "http://localhost:5000";

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
    sowing:  { start: "2025-11-01" },
    harvest: { start: "2026-03-20" },
    stages: [
      { stage: "tillering", approx: "2026-01-15" },
      { stage: "flowering", approx: "2026-02-20" },
    ],
  },
  campaign_crop: "wheat",
  message_sent_date: new Date().toISOString().split("T")[0],
};

export default function LiveAlerts() {
  const [mlData, setMlData]           = useState<any>(null);
  const [currentAlert, setCurrentAlert] = useState(0);
  const [loading, setLoading]         = useState(true);

  // Fetch ML data once
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res  = await fetch(`${ML_API}/predict/full`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(SAMPLE_FARMER),
        });
        const json = await res.json();
        setMlData(json);
      } catch {
        // fallback to static alerts
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Build dynamic alerts from ML data
  const buildAlerts = () => {
    if (!mlData) return [
      "🌧️ Heavy rainfall expected tomorrow — delay pesticide spraying.",
      "🌱 Ideal sowing conditions detected this week.",
      "📈 Farmer engagement increased by 18% this week.",
    ];

    const alerts = [];
    const weather  = mlData.weather;
    const pred     = mlData.predictions;
    const segment  = mlData.segment;

    if (weather?.disease_alert) {
      alerts.push(`🚨 High disease pressure in ${SAMPLE_FARMER.district} — apply ${pred?.product?.recommended_product} now!`);
    }
    if (weather?.is_raining) {
      alerts.push("🌧️ Currently raining — farmers are home and highly reachable right now.");
    }
    if (pred?.timing?.harvest_urgency) {
      alerts.push("⏰ Harvest approaching! Critical protection window — act immediately.");
    }
    if (pred?.conversion?.conversion_tier === "top") {
      alerts.push(`🎯 High-value farmer segment detected: ${segment?.persona}`);
    }
    if (weather?.temperature > 38) {
      alerts.push(`🌡️ Extreme heat ${weather.temperature}°C — heat stress risk for crops.`);
    }
    alerts.push(`💬 Best channel to reach farmers now: ${pred?.channel?.recommended_channel}`);
    alerts.push(`🌿 Top recommended product: ${pred?.product?.recommended_product}`);

    return alerts.length > 0 ? alerts : ["✅ Conditions normal — good time for outreach."];
  };

  const alerts = buildAlerts();

  // Rotate alerts
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAlert((prev) => (prev + 1) % alerts.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [alerts.length]);

  const weather  = mlData?.weather;
  const pred     = mlData?.predictions;

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
              Live farming insights powered by ML — personalized alerts
              and smart recommendations for every farmer.
            </p>

            <div className="grid grid-cols-2 gap-6 mt-10">

              {/* Live weather temp */}
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
                <h3 className="text-4xl font-bold">
                  {loading ? "..." : weather?.temperature
                    ? `${weather.temperature.toFixed(0)}°C`
                    : "—"}
                </h3>
                <p className="text-green-100 mt-2">
                  Live Temp · {SAMPLE_FARMER.district}
                </p>
              </div>

              {/* Conversion score */}
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
                <h3 className="text-4xl font-bold">
                  {loading ? "..." : pred?.conversion?.priority_score?.toFixed(0) ?? "—"}
                </h3>
                <p className="text-green-100 mt-2">
                  Conversion Score
                </p>
              </div>

              {/* Disease alert */}
              <div className={`backdrop-blur-lg rounded-2xl p-6 ${weather?.disease_alert ? "bg-red-500/30" : "bg-white/10"}`}>
                <h3 className="text-4xl font-bold">
                  {loading ? "..." : weather?.disease_alert ? "🚨" : "✅"}
                </h3>
                <p className="text-green-100 mt-2">
                  {weather?.disease_alert ? "Disease Alert" : "Crop Healthy"}
                </p>
              </div>

              {/* Humidity */}
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
                <h3 className="text-4xl font-bold">
                  {loading ? "..." : weather?.humidity
                    ? `${weather.humidity.toFixed(0)}%`
                    : "—"}
                </h3>
                <p className="text-green-100 mt-2">
                  Live Humidity
                </p>
              </div>

            </div>
          </div>

          {/* RIGHT */}
          <div className="glass rounded-[2rem] p-8 shadow-2xl bg-white/10 backdrop-blur-xl border border-white/20">

            <div className="flex items-center justify-between mb-6">
              <p className="text-yellow-300 font-bold">
                🔴 LIVE ALERTS
              </p>
              {!loading && (
                <span className="text-xs text-green-200 bg-white/10 px-3 py-1 rounded-full">
                  AI-Powered · {new Date().toLocaleTimeString()}
                </span>
              )}
            </div>

            <div className="bg-white rounded-2xl p-8 text-green-900 min-h-[160px] flex items-center justify-center text-center shadow-xl">
              {loading ? (
                <p className="text-gray-400 text-lg">Loading live data...</p>
              ) : (
                <h3 className="text-xl font-bold leading-relaxed">
                  {alerts[currentAlert]}
                </h3>
              )}
            </div>

            {/* Alert dots */}
            <div className="flex justify-center gap-2 mt-4">
              {alerts.map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i === currentAlert ? "bg-yellow-400 w-4" : "bg-white/30"
                  }`}
                />
              ))}
            </div>

            {/* Farmer segment */}
            {mlData?.segment && (
              <div className="mt-4 bg-white/10 rounded-xl p-3 text-center">
                <p className="text-green-200 text-xs">Active Farmer Persona</p>
                <p className="text-white font-bold text-sm mt-1">
                  {mlData.segment.persona}
                </p>
              </div>
            )}

            <button className="mt-6 w-full bg-yellow-500 hover:bg-yellow-600 text-green-900 py-4 rounded-2xl font-bold transition-all">
              View Detailed Insights
            </button>

          </div>
        </div>
      </div>
    </section>
  );
}