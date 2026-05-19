export default function Features() {
  return (
    <section
      id="services"
      className="py-24 px-6 max-w-7xl mx-auto"
    >
      <div className="text-center mb-16">

        <h2 className="text-4xl font-bold text-green-900">
          Our Services
        </h2>

        <div className="w-20 h-1 bg-yellow-500 mx-auto mt-4"></div>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

        <div className="glass p-8 rounded-3xl card-hover hover:shadow-2xl transition-all duration-300">
          <h3 className="text-xl font-bold mb-3">
            Weather Updates
          </h3>

          <p className="text-gray-600 text-sm">
            Real-time alerts with precision hyper-local mapping.
          </p>
        </div>

        <div className="glass p-8 rounded-3xl card-hover hover:shadow-2xl transition-all duration-300">
          <h3 className="text-xl font-bold mb-3">
            Crop Guidance
          </h3>

          <p className="text-gray-600 text-sm">
            Recommendations based on seasonal and soil conditions.
          </p>
        </div>

        <div className="glass p-8 rounded-3xl card-hover hover:shadow-2xl transition-all duration-300">
          <h3 className="text-xl font-bold mb-3">
            Voice Alerts
          </h3>

          <p className="text-gray-600 text-sm">
            Offline voice notifications for farmers.
          </p>
        </div>

        <div className="glass p-8 rounded-3xl card-hover hover:shadow-2xl transition-all duration-300">
          <h3 className="text-xl font-bold mb-3">
            Regional Languages
          </h3>

          <p className="text-gray-600 text-sm">
            Support for multiple Indian languages.
          </p>
        </div>

      </div>
    </section>
  );
}