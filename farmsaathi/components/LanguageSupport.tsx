"use client";

import { useState } from "react";

export default function LanguageSupport() {

  const [language, setLanguage] = useState("English");

  return (
    <section className="py-24 px-6 bg-[#f7faf7]">

      <div className="max-w-7xl mx-auto">

        <div className="text-center mb-16">

          <h2 className="text-5xl font-bold text-green-900">
            Multilingual & Offline Support
          </h2>

          <p className="text-gray-600 mt-4 text-lg">
            Farming assistance accessible to every farmer,
            even without internet access.
          </p>

        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

          {/* LANGUAGE CARD */}

          <div className="glass rounded-[2rem] p-8 shadow-xl">

            <h3 className="text-3xl font-bold text-green-900 mb-6">
              Select Preferred Language
            </h3>

            <select
              className="w-full p-4 rounded-xl border border-green-200 bg-white"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >

              <option>English</option>
              <option>Hindi</option>
              <option>Odia</option>
              <option>Bengali</option>
              <option>Tamil</option>

            </select>

            <div className="mt-8 p-6 bg-green-900 rounded-2xl text-white">

              <p className="text-yellow-400 font-bold mb-3">
                Current Alert
              </p>

              {language === "English" && (
                <p>
                  Rain expected tomorrow. Delay pesticide spraying.
                </p>
              )}

              {language === "Hindi" && (
                <p>
                  कल बारिश होने की संभावना है। कीटनाशक छिड़काव रोकें।
                </p>
              )}

              {language === "Odia" && (
                <p>
                  କାଲି ବର୍ଷା ସମ୍ଭାବନା ଅଛି। କୀଟନାଶକ ଛିଟା ଦେବା ବନ୍ଦ କରନ୍ତୁ।
                </p>
              )}

              {language === "Bengali" && (
                <p>
                  আগামীকাল বৃষ্টির সম্ভাবনা আছে। কীটনাশক স্প্রে বন্ধ রাখুন।
                </p>
              )}

              {language === "Tamil" && (
                <p>
                  நாளை மழை வாய்ப்பு உள்ளது. பூச்சிக்கொல்லி தெளிப்பதை நிறுத்தவும்.
                </p>
              )}

            </div>

          </div>

          {/* OFFLINE SUPPORT CARD */}

          <div className="glass rounded-[2rem] p-8 shadow-xl">

            <h3 className="text-3xl font-bold text-green-900 mb-6">
              Offline Farmer Assistance
            </h3>

            <div className="space-y-6">

              <div className="bg-white rounded-2xl p-6 border border-green-100">

                <h4 className="font-bold text-green-800 text-xl mb-2">
                  📞 Voice Call Alerts
                </h4>

                <p className="text-gray-600">
                  Farmers without internet receive automated
                  farming updates through voice calls in their
                  preferred language.
                </p>

              </div>

              <div className="bg-white rounded-2xl p-6 border border-green-100">

                <h4 className="font-bold text-green-800 text-xl mb-2">
                  💬 WhatsApp & SMS Updates
                </h4>

                <p className="text-gray-600">
                  Real-time weather alerts and crop recommendations
                  delivered directly to farmers.
                </p>

              </div>

              <div className="bg-white rounded-2xl p-6 border border-green-100">

                <h4 className="font-bold text-green-800 text-xl mb-2">
                  📡 Low-Network Optimization
                </h4>

                <p className="text-gray-600">
                  Designed to function in rural areas with limited connectivity.
                </p>

              </div>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}