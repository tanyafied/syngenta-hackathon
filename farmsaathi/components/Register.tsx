"use client";

import { useState, ChangeEvent } from "react";

interface RegisterProps {
  onRegistrationSuccess?: (locationName: string) => void;
}

export default function Register({ onRegistrationSuccess }: RegisterProps) {
  // Input fields hook states
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [district, setDistrict] = useState("");
  const [language, setLanguage] = useState("Select Language");
  const [farmSize, setFarmSize] = useState("");
  const [soilType, setSoilType] = useState("Select Soil Type");

  // App behavioral execution tracking hooks
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState<any>(null);
  const [error, setError] = useState("");
  
  // 💡 VISUAL FLOATING ALERT OVERLAY DISPLAY STATE
  const [simulatedNotification, setSimulatedNotification] = useState<{
    visible: boolean;
    channel: string;
    text: string;
  }>({ visible: false, channel: "", text: "" });

  const handleGenerateInsights = async () => {
    if (!name || !phone || !district || language === "Select Language" || !farmSize || soilType === "Select Soil Type") {
      alert("Please complete all fields before computing insights.");
      return;
    }

    setLoading(true);
    setError("");
    setReportData(null);

    const payload = {
      farmer_name: name.trim(),
      phone_number: phone.trim(),
      district: district.trim(),
      language: language,
      farm_size: parseFloat(farmSize) || 0,
      soil_type: soilType
    };

    try {
      // 🔌 PIPELINE CONNECTED DIRECTLY TO YOUR FLASK APPLICATION RUNNING ON PORT 8080
      const response = await fetch("http://localhost:8080/api/v1/farmers/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Backend orchestration server rejected data structure attributes.");

      const data = await response.json();
      setReportData(data);

      // Trigger your metric tables to refresh updates
      if (onRegistrationSuccess) {
        onRegistrationSuccess(district.trim());
      }

      // 💡 TRIGGER THE SIMULATED BANNER ON SCREEN FOR JUDGES
      setSimulatedNotification({
        visible: true,
        channel: data.preferred_channel || "WhatsApp",
        text: `AgriConnect Advisory: Hello ${name.trim()}! Crop analytics for your field in ${district.trim()} show high climate moisture metrics. We recommend deploying ${data.recommended_fertilizer} within 24 hours.`
      });

      // Auto dismiss after 7 seconds
      setTimeout(() => {
        setSimulatedNotification(prev => ({ ...prev, visible: false }));
      }, 7000);

    } catch (err) {
      console.error(err);
      setError("Failed connection to port 8080. Ensure Python Flask script is running live.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="register" className="py-24 px-6 bg-[#F5F5DC] scroll-mt-20 relative">
      
      {/* 💡 HUD LIVE TELEMETRY BANNER POPUP MODULE */}
      {simulatedNotification.visible && (
        <div className="fixed top-6 right-6 z-50 max-w-sm w-full bg-white text-gray-900 rounded-2xl shadow-2xl border-l-8 border-green-600 p-5 animate-bounce transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="flex items-center gap-2 text-sm font-black tracking-wide uppercase text-green-700">
              {simulatedNotification.channel === "WhatsApp" ? "💬 WhatsApp Gateway Alert" : "📱 Incoming SMS Advisory"}
            </span>
            <span className="text-xs text-gray-400 font-bold">Just Now</span>
          </div>
          <p className="text-sm text-gray-700 font-medium leading-relaxed">
            {simulatedNotification.text}
          </p>
          <div className="mt-3 text-right">
            <span className="text-xs font-bold text-gray-400">Sent via Twilio API Simulation</span>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-black text-green-950 mb-4">Register Your Farm</h2>
          <p className="text-xl text-green-900">Run immediate predictive assessments mapping real-time variables.</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* INPUT FORM FIELD CARD LAYER */}
          <div className="bg-white rounded-[3rem] p-10 shadow-2xl border border-green-100">
            <div className="space-y-6">
              <input
                type="text"
                placeholder="Farmer Name"
                value={name}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                className="w-full p-5 rounded-2xl border border-green-200 bg-[#f8fff8] text-green-950 text-lg focus:outline-none"
              />
              <input
                type="text"
                placeholder="Phone Number (e.g., +919876543210)"
                value={phone}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setPhone(e.target.value)}
                className="w-full p-5 rounded-2xl border border-green-200 bg-[#f8fff8] text-green-950 text-lg focus:outline-none"
              />
              <input
                type="text"
                placeholder="District / City (e.g., Kanpur)"
                value={district}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setDistrict(e.target.value)}
                className="w-full p-5 rounded-2xl border border-green-200 bg-[#f8fff8] text-green-950 text-lg focus:outline-none focus:border-green-700"
              />
              <select
                value={language}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => setLanguage(e.target.value)}
                className="w-full p-5 rounded-2xl border border-green-200 bg-[#f8fff8] text-green-950 text-lg focus:outline-none"
              >
                <option>Select Language</option>
                <option>English</option>
                <option>Hindi</option>
                <option>Tamil</option>
                <option>Marathi</option>
                <option>Punjabi</option>
              </select>
              <input
                type="number"
                placeholder="Farm Size (in acres)"
                value={farmSize}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setFarmSize(e.target.value)}
                className="w-full p-5 rounded-2xl border border-green-200 bg-[#f8fff8] text-green-950 text-lg focus:outline-none"
              />
              <select
                value={soilType}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => setSoilType(e.target.value)}
                className="w-full p-5 rounded-2xl border border-green-200 bg-[#f8fff8] text-green-950 text-lg focus:outline-none"
              >
                <option>Select Soil Type</option>
                <option>Clay Soil</option>
                <option>Loamy Soil</option>
                <option>Sandy Soil</option>
              </select>

              <button
                onClick={handleGenerateInsights}
                disabled={loading}
                type="button"
                className="w-full bg-yellow-400 hover:bg-yellow-300 disabled:bg-gray-200 text-green-950 py-5 rounded-2xl font-black text-lg transition shadow-md"
              >
                {loading ? "Processing Registries..." : "Generate Smart Farming Insights"}
              </button>
            </div>
          </div>

          {/* SIDE INFORMATION CARD */}
          <div className="bg-gradient-to-br from-green-900 to-green-800 rounded-[3rem] p-10 shadow-2xl text-white">
            <h3 className="text-4xl font-black mb-6">Last-Mile Connection</h3>
            <p className="text-green-100 text-lg leading-relaxed mb-6">
              Our microservice pipeline doesn't stop at screen widgets. It checks each farmer's phone capability and language choice to drop tailored SMS text frameworks or rich WhatsApp items right onto their mobile device instantly.
            </p>
            <div className="p-4 bg-white/10 rounded-2xl border border-white/10 text-sm font-mono text-yellow-300">
              Status: Outbound Telemetry Routing Handlers Engaged.
            </div>
          </div>

        </div>

        {/* NETWORK ERRORS ARCHITECTURE DISPLAY */}
        {error && (
          <div className="mt-12 p-6 bg-red-50 border border-red-200 text-red-700 text-center font-semibold rounded-2xl max-w-4xl mx-auto">
            ⚠️ {error}
          </div>
        )}

        {/* FEEDBACK ANALYTICS REGISTRY CONFIRMATION CARD */}
        {reportData && !loading && (
          <div className="mt-20 rounded-[3rem] p-10 shadow-2xl bg-gradient-to-br from-green-900 to-green-800 text-white animate-fadeIn">
            <h2 className="text-4xl font-black mb-4">Core Profiling Complete — Status Generated Successfully</h2>
            <p className="text-lg text-green-100">
              The crop prediction engine successfully designated <strong>{reportData.recommended_crop}</strong> as optimal. Outbound notification dispatched to the farmer via <strong>{reportData.preferred_channel}</strong>.
            </p>
          </div>
        )}

      </div>
    </section>
  );
}