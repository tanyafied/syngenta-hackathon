"use client";

import { useState } from "react";

const ML_API = process.env.NEXT_PUBLIC_ML_API_URL || "http://localhost:5000";

const LANGUAGES = ["Hindi", "Marathi", "Punjabi", "Gujarati", "Bengali", "Kannada"];

const LANGUAGE_STATES: Record<string, string> = {
  Hindi:   "Uttar Pradesh",
  Marathi: "Maharashtra",
  Punjabi: "Punjab",
  Gujarati:"Gujarat",
  Bengali: "West Bengal",
  Kannada: "Karnataka",
};

const LANGUAGE_DISTRICTS: Record<string, string> = {
  Hindi:   "Kanpur Nagar",
  Marathi: "Nashik",
  Punjabi: "Ludhiana",
  Gujarati:"Ahmedabad",
  Bengali: "Patna",
  Kannada: "Nagpur",
};

const LANGUAGE_FLAGS: Record<string, string> = {
  Hindi:   "🇮🇳",
  Marathi: "🟠",
  Punjabi: "🌾",
  Gujarati:"🦁",
  Bengali: "🐯",
  Kannada: "🌻",
};

export default function LanguageSupport() {
  const [language, setLanguage]     = useState("Hindi");
  const [channel, setChannel]       = useState("WhatsApp");
  const [message, setMessage]       = useState("");
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState("");
  const [generated, setGenerated]   = useState(false);

  const generateMessage = async () => {
    setLoading(true);
    setError("");
    setMessage("");
    setGenerated(false);

    try {
      const res = await fetch(`${ML_API}/generate/full_campaign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          grower_id:   "GRW_DEMO",
          state:       LANGUAGE_STATES[language] || "Uttar Pradesh",
          district:    LANGUAGE_DISTRICTS[language] || "Kanpur Nagar",
          language:    language,
          device_type: "smartphone",
          grower_age:  42,
          grower_farm_size: 3.0,
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
          channel: channel,
          message_sent_date: new Date().toISOString().split("T")[0],
        }),
      });

      const json = await res.json();
      const content = json?.generated_content?.primary?.content;

      if (content) {
        setMessage(content);
        setGenerated(true);
      } else {
        setError("Message generation failed. Check if Gemini API key is set.");
      }
    } catch (e) {
      setError("Could not connect to ML server. Make sure api.py is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-24 px-6 bg-[#f7faf7]">
      <div className="max-w-7xl mx-auto">

        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-green-900">
            Multilingual AI Messaging
          </h2>
          <p className="text-gray-600 mt-4 text-lg">
            Generate personalized crop protection messages in any Indian language —
            powered by AI, tailored to each farmer.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

          {/* LEFT — Generator */}
          <div className="glass rounded-[2rem] p-8 shadow-xl">

            <h3 className="text-3xl font-bold text-green-900 mb-6">
              Generate Farmer Message
            </h3>

            {/* Language selector */}
            <div className="mb-4">
              <label className="text-sm text-gray-500 mb-2 block">
                Select Language
              </label>
              <div className="grid grid-cols-3 gap-2">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang}
                    onClick={() => { setLanguage(lang); setGenerated(false); setMessage(""); }}
                    className={`p-3 rounded-xl border text-sm font-medium transition ${
                      language === lang
                        ? "bg-green-700 text-white border-green-700"
                        : "bg-white text-green-900 border-green-200 hover:border-green-400"
                    }`}
                  >
                    {LANGUAGE_FLAGS[lang]} {lang}
                  </button>
                ))}
              </div>
            </div>

            {/* Channel selector */}
            <div className="mb-6">
              <label className="text-sm text-gray-500 mb-2 block">
                Select Channel
              </label>
              <div className="grid grid-cols-2 gap-2">
                {["WhatsApp", "SMS", "Voice", "Retailer Visit"].map((ch) => (
                  <button
                    key={ch}
                    onClick={() => { setChannel(ch); setGenerated(false); setMessage(""); }}
                    className={`p-3 rounded-xl border text-sm font-medium transition ${
                      channel === ch
                        ? "bg-green-700 text-white border-green-700"
                        : "bg-white text-green-900 border-green-200 hover:border-green-400"
                    }`}
                  >
                    {ch === "WhatsApp" && "💬 "}
                    {ch === "SMS" && "📱 "}
                    {ch === "Voice" && "📞 "}
                    {ch === "Retailer Visit" && "🏪 "}
                    {ch}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={generateMessage}
              disabled={loading}
              className="w-full bg-green-700 hover:bg-green-800 disabled:bg-green-400 text-white py-4 rounded-2xl font-bold transition text-lg"
            >
              {loading ? "✨ Generating..." : "✨ Generate Message"}
            </button>

            {error && (
              <div className="mt-4 bg-red-50 border border-red-200 rounded-xl p-4 text-red-600 text-sm">
                ⚠️ {error}
              </div>
            )}
          </div>

          {/* RIGHT — Output */}
          <div className="glass rounded-[2rem] p-8 shadow-xl">

            <h3 className="text-3xl font-bold text-green-900 mb-6">
              Generated Message
            </h3>

            {/* WhatsApp style preview */}
            <div className="bg-[#075e54] rounded-2xl p-4 min-h-[280px] flex flex-col">

              <div className="flex items-center gap-3 mb-4 pb-3 border-b border-white/20">
                <div className="w-10 h-10 bg-green-300 rounded-full flex items-center justify-center text-xl">
                  🌾
                </div>
                <div>
                  <p className="text-white font-bold text-sm">FarmSaathi</p>
                  <p className="text-green-300 text-xs">Syngenta Crop Protection</p>
                </div>
              </div>

              <div className="flex-1 flex items-center justify-center">
                {loading && (
                  <div className="text-center text-white/70">
                    <div className="text-4xl mb-3">✨</div>
                    <p>Generating {language} message...</p>
                  </div>
                )}

                {!loading && !generated && !error && (
                  <div className="text-center text-white/50">
                    <div className="text-4xl mb-3">💬</div>
                    <p>Select language & channel,<br />then click Generate</p>
                  </div>
                )}

                {generated && message && (
                  <div className="bg-white rounded-2xl rounded-tl-none p-4 text-green-900 w-full shadow-lg">
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {message}
                    </p>
                    <p className="text-xs text-gray-400 mt-2 text-right">
                      {new Date().toLocaleTimeString()} ✓✓
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Channel info */}
            {generated && (
              <div className="mt-4 bg-green-50 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500">Generated for</p>
                  <p className="font-bold text-green-900">
                    {LANGUAGE_FLAGS[language]} {language} · {channel}
                  </p>
                </div>
                <button
                  onClick={() => navigator.clipboard?.writeText(message)}
                  className="text-sm text-green-700 border border-green-300 px-3 py-1 rounded-lg hover:bg-green-100 transition"
                >
                  Copy
                </button>
              </div>
            )}

            {/* Offline support info */}
            <div className="mt-6 space-y-3">
              {[
                { icon: "📞", title: "Voice Call Alerts", desc: "Automated farming updates for feature phone users" },
                { icon: "📡", title: "Low-Network Ready", desc: "Designed for rural areas with limited connectivity" },
              ].map((item, i) => (
                <div key={i} className="bg-white rounded-2xl p-4 border border-green-100 flex gap-3">
                  <span className="text-2xl">{item.icon}</span>
                  <div>
                    <p className="font-bold text-green-800 text-sm">{item.title}</p>
                    <p className="text-gray-500 text-xs mt-1">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}