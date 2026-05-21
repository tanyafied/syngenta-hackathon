"use client";

import { useEffect, useState } from "react";

const BACKEND_API = "http://localhost:8080/api/v1/farmers";

interface RecommendationsProps {
  activeLocation: string;
}

export default function Recommendations({ activeLocation }: RecommendationsProps) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchLatestFarmerData = async () => {
      setLoading(true);
      setError(false);
      
      try {
        const res = await fetch(BACKEND_API, {
          method: "GET",
          headers: { "Content-Type": "application/json" }
        });
        
        if (!res.ok) throw new Error("Data orchestration bridge connection failed.");
        const json = await res.json();
        
        if (json && json.length > 0) {
          setData(json[0]); 
        } else {
          setData(null);
        }
      } catch (e) {
        console.error("Recommendations Pipeline Error:", e);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestFarmerData();
  }, [activeLocation]);

  const persona = data?.persona || "Digital-Savvy Large Farmer";
  const recommendedProduct = data?.recommended_product || "Syngenta Virtako + Amistar Top";
  const modelConfidence = data?.confidence || 92;
  const recommendedChannel = data?.recommended_channel || "WhatsApp";
  const temperature = data?.temperature || 34.2;
  const humidity = data?.humidity || 45.0;

  return (
    <section className="py-24 px-6 bg-gradient-to-b from-green-50 to-white">
      <div className="max-w-7xl mx-auto">

        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-green-900">
            Personalized Farmer Guidance
          </h2>
          <p className="text-gray-600 mt-4 text-lg">
            Real-time crop support powered by AI — based on your crop, location, and live weather conditions.
          </p>
        </div>

        {loading && (
          <div className="text-center text-green-700 text-xl py-20 animate-pulse">
            🌾 Syncing live farm intelligence for {activeLocation}...
          </div>
        )}

        {error && (
          <div className="text-center text-red-500 text-lg py-20 bg-red-50 rounded-2xl border border-red-100 max-w-2xl mx-auto">
            ⚠️ Could not load database records. Verify your Flask app is executing on port 8080.
          </div>
        )}

        {!loading && !data && !error && (
          <div className="text-center text-gray-500 text-lg py-12">
            No recent farm registrations detected. Use the registration module above to stream insights.
          </div>
        )}

        {data && !loading && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

            <div className="bg-white rounded-[2rem] p-8 shadow-xl border border-green-100">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <p className="text-gray-500 text-sm">Farmer Profile Persona</p>
                  <h3 className="text-2xl font-bold text-green-900">
                    {persona}
                  </h3>
                </div>
                <span className="px-4 py-2 rounded-full font-bold text-xs bg-green-100 text-green-800">
                  HIGH PRIORITY
                </span>
              </div>

              <div className="bg-green-50 rounded-2xl p-6 mb-4">
                <p className="text-gray-500 text-sm mb-1">🌿 Recommended Input Shield</p>
                <p className="text-2xl font-bold text-green-900">
                  {recommendedProduct}
                </p>
                <p className="text-sm text-green-700 mt-2 font-medium">
                  Model Confidence: {modelConfidence}%
                </p>
              </div>

              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                <p className="text-gray-500 text-sm mb-1">Target Contact Medium</p>
                <p className="text-xl font-bold text-green-950">
                  💬 {recommendedChannel}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-[2rem] p-8 shadow-xl border border-green-100">
              <div className="mb-6">
                <p className="text-gray-500 text-sm mb-4">📍 Live Environment Telemetry — {data.district || activeLocation}</p>
                <div className="grid grid-cols-2 gap-4">
                  
                  <div className="bg-blue-50 rounded-2xl p-5 text-center">
                    <p className="text-4xl font-black text-blue-900">
                      {temperature.toFixed(1)}°C
                    </p>
                    <p className="text-blue-600 text-sm mt-2 font-medium">Ambient Temperature</p>
                  </div>
                  
                  <div className="bg-cyan-50 rounded-2xl p-5 text-center">
                    <p className="text-4xl font-black text-cyan-900">
                      {humidity.toFixed(0)}%
                    </p>
                    <p className="text-cyan-600 text-sm mt-2 font-medium">Relative Humidity</p>
                  </div>

                </div>
              </div>

              <div className="bg-yellow-50 rounded-2xl p-5 border border-yellow-100">
                <p className="font-bold text-yellow-800 mb-1">⏰ Advisory Outreach Window</p>
                <p className="text-sm text-gray-700 leading-relaxed">
                  Atmospheric indicators in <strong>{data.district || activeLocation}</strong> are optimal for scheduling local campaign distributions via <strong>{recommendedChannel}</strong> templates.
                </p>
              </div>
            </div>

          </div>
        )}
      </div>
    </section>
  );
}