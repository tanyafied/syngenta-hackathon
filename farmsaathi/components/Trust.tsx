export default function Trust() {
  return (
    <section className="py-24 px-6 bg-white">

      <div className="max-w-7xl mx-auto">

        <div className="text-center mb-16">

          <h2 className="text-5xl font-bold text-green-900">
            Why Farmers Trust FarmSaathi
          </h2>

          <p className="text-gray-600 mt-4 text-lg">
            Building confidence through local support,
            real-time guidance, and trusted dealer networks.
          </p>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          <div className="glass p-8 rounded-[2rem] shadow-xl">

            <div className="text-5xl mb-6">
              🌾
            </div>

            <h3 className="text-2xl font-bold text-green-900 mb-4">
              Personalized Guidance
            </h3>

            <p className="text-gray-600">
              Farmers receive crop and fertilizer
              recommendations based on weather and location.
            </p>

          </div>

          <div className="glass p-8 rounded-[2rem] shadow-xl">

            <div className="text-5xl mb-6">
              🤝
            </div>

            <h3 className="text-2xl font-bold text-green-900 mb-4">
              Trusted Dealers
            </h3>

            <p className="text-gray-600">
              Nearby verified agricultural dealers
              help farmers build confidence in the platform.
            </p>

          </div>

          <div className="glass p-8 rounded-[2rem] shadow-xl">

            <div className="text-5xl mb-6">
              📡
            </div>

            <h3 className="text-2xl font-bold text-green-900 mb-4">
              Offline Accessibility
            </h3>

            <p className="text-gray-600">
              Farmers can receive alerts through
              calls, SMS, and WhatsApp even in low-network areas.
            </p>

          </div>

        </div>

      </div>

    </section>
  );
}