"use client";

import { useState } from "react";

const BACKEND_API = "http://localhost:8080";
const LANGUAGES = ["Hindi", "Marathi", "Punjabi", "Gujarati", "Bengali", "Kannada"];

const LANGUAGE_FLAGS: Record<string, string> = {
  Hindi:   "🇮🇳",
  Marathi: "🟠",
  Punjabi: "🌾",
  Gujarati:"🦁",
  Bengali: "🐯",
  Kannada: "🌻",
};

export default function LanguageSupport() {
  const [language, setLanguage] = useState("Hindi");
  const [channel, setChannel] = useState("WhatsApp");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [generated, setGenerated] = useState(false);

  const generateMessage = async () => {
    setLoading(true);
    setError("");
    setMessage("");
    setGenerated(false);

    const cropMappings: Record<string, string> = {
      Hindi: "गेहूं (Wheat)",
      Marathi: "गहू (Wheat)",
      Punjabi: "ਕਣਕ (Wheat)",
      default: "Wheat"
    };

    const targetCrop = cropMappings[language] || cropMappings["default"];
    const targetProduct = language === "Hindi" ? "Tilt 250 EC" : "Topik 15 WP";
    const targetRate = language === "Hindi" ? "₹2455/quintal" : "₹5850/quintal";

    try {
      const res = await fetch(`${BACKEND_API}/api/v1/farmers/generate-message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language: language,
          crop: targetCrop,
          recommended_product: targetProduct,
          premium_rate: targetRate
        }),
      });

      if (!res.ok) throw new Error("Backend generation engine failure state");
      const json = await res.json();
      
      if (json.status === "success" && json.message) {
        setMessage(json.message);
        setGenerated(true);
      } else {
        setError("Could not parse generated content template array keys.");
      }
    } catch (e) {
      setError("Communication mismatch. Verify python server.py is running on port 8080.");
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
            Generate personalized crop protection messages in any Indian language — powered by AI, tailored to each farmer.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="bg-white rounded-[2rem] p-8 shadow-xl border border-gray-100">
            <h3 className="text-3xl font-bold text-green-900 mb-6">
              Generate Farmer Message
            </h3>

            <div className="mb-4">
              <label className="text-sm text-gray-400 font-semibold mb-2 block uppercase tracking-wide">
                Select Native Dialect
              </label>
              <div className="grid grid-cols-3 gap-2">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang}
                    onClick={() => { setLanguage(lang); setGenerated(false); setMessage(""); }}
                    className={`p-3 rounded-xl border text-sm font-bold transition duration-200 ${
                      language === lang
                        ? "bg-green-700 text-white border-green-700 shadow-md"
                        : "bg-white text-green-900 border-green-100 hover:border-green-400 hover:bg-green-700/5"
                    }`}
                  >
                    {LANGUAGE_FLAGS[lang]} {lang}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="text-sm text-gray-400 font-semibold mb-2 block uppercase tracking-wide">
                Target Marketing Channel
              </label>
              <div className="grid grid-cols-2 gap-2">
                {["WhatsApp", "SMS", "Voice", "Retailer Visit"].map((ch) => (
                  <button
                    key={ch}
                    onClick={() => { setChannel(ch); setGenerated(false); setMessage(""); }}
                    className={`p-3 rounded-xl border text-sm font-bold transition duration-200 ${
                      channel === ch
                        ? "bg-green-700 text-white border-green-700 shadow-md"
                        : "bg-white text-green-900 border-green-100 hover:border-green-400 hover:bg-green-700/5"
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
              className="w-full bg-green-700 hover:bg-green-800 disabled:bg-green-400 text-white py-4 rounded-2xl font-bold transition shadow-lg text-lg"
            >
              {loading ? "✨ Processing Translation Matrices..." : "✨ Generate Campaign Notification"}
            </button>

            {error && (
              <div className="mt-4 bg-red-50 border border-red-200 rounded-xl p-4 text-red-600 text-sm font-medium">
                ⚠️ {error}
              </div>
            )}
          </div>

          <div className="bg-white rounded-[2rem] p-8 shadow-xl border border-gray-100">
            <h3 className="text-3xl font-bold text-green-900 mb-6">
              Live Mockup Dispatch View
            </h3>

            <div className="bg-[#e5ddd5] rounded-2xl p-4 min-h-[280px] flex flex-col border border-gray-200 shadow-inner">
              <div className="bg-[#075e54] -mx-4 -mt-4 rounded-t-2xl p-3 flex items-center gap-3 shadow-md">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-xl shadow-sm">
                  🌾
                </div>
                <div>
                  <p className="text-white font-bold text-sm">AgriConnect Node Manager</p>
                  <p className="text-green-200 text-xs">Campaign Core Engine</p>
                </div>
              </div>

              <div className="flex-1 flex items-center justify-center mt-4">
                {loading && (
                  <div className="text-center text-gray-600 font-medium">
                    <div className="text-4xl mb-3 animate-spin">⏳</div>
                    <p>Compiling structured regional context values...</p>
                  </div>
                )}

                {!loading && !generated && !error && (
                  <div className="text-center text-gray-400 font-medium">
                    <div className="text-4xl mb-3">💬</div>
                    <p>Select target constraints,<br />then trigger message generation.</p>
                  </div>
                )}

                {generated && message && (
                  <div className="bg-white rounded-2xl rounded-tl-none p-4 text-green-900 w-full shadow-md border border-gray-100 relative">
                    <p className="text-sm leading-relaxed whitespace-pre-wrap font-medium">
                      {message}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-2 text-right">
                      {new Date().toLocaleTimeString()} ✓✓
                    </p>
                  </div>
                )}
              </div>
            </div>

            {generated && (
              <div className="mt-4 bg-green-50 rounded-xl p-4 flex items-center justify-between border border-green-100">
                <div>
                  <p className="text-[10px] uppercase font-bold text-gray-400">Payload Mapping Verified</p>
                  <p className="font-bold text-green-900 text-xs">
                    {LANGUAGE_FLAGS[language]} {language} Dialect Core · {channel} Stream Node
                  </p>
                </div>
                <button
                  onClick={() => navigator.clipboard?.writeText(message)}
                  className="text-xs text-green-700 font-bold border border-green-300 bg-white px-3 py-1.5 rounded-lg hover:bg-green-100 transition shadow-sm"
                >
                  Copy Message Content
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}