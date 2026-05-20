export default function Trust() {
  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-green-900">
            Why Farmers Trust AgriConnect
          </h2>
          <p className="text-gray-600 mt-4 text-lg">
            Building confidence through local support, real-time guidance, and trusted network validation matrices.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass p-8 rounded-[2rem] shadow-xl border border-green-50 bg-green-50/10">
            <div className="text-5xl mb-6">🌾</div>
            <h3 className="text-2xl font-bold text-green-900 mb-4">Personalized Guidance</h3>
            <p className="text-gray-600 leading-relaxed text-sm">
              Farmers receive custom input suggestions and predictive harvest models based explicitly on weather indexes and soil structures.
            </p>
          </div>

          <div className="glass p-8 rounded-[2rem] shadow-xl border border-green-50 bg-green-50/10">
            <div className="text-5xl mb-6">🤝</div>
            <h3 className="text-2xl font-bold text-green-900 mb-4">Trusted Networks</h3>
            <p className="text-gray-600 leading-relaxed text-sm">
              Direct connection pathways to nearby certified agricultural distribution points ensure reliable access to recommended supplies.
            </p>
          </div>

          <div className="glass p-8 rounded-[2rem] shadow-xl border border-green-50 bg-green-50/10">
            <div className="text-5xl mb-6">📡</div>
            <h3 className="text-2xl font-bold text-green-900 mb-4">Offline Access Nodes</h3>
            <p className="text-gray-600 leading-relaxed text-sm">
              Integrated low-bandwidth SMS channels and fallback structural telephony arrays bring advanced insights to non-smartphone hardware profiles.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}