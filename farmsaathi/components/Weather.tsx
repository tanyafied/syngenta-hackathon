export default function Weather() {
  return (
    <section
      id="weather"
      className="py-24 px-6 bg-[#f0f4f0]"
    >
      <div className="max-w-7xl mx-auto glass p-10 rounded-[3rem] border border-white relative overflow-hidden">

        <div className="absolute top-0 right-0 p-10 opacity-20 text-yellow-400 text-8xl">
          ☀️
        </div>

        <h2 className="text-4xl font-bold text-green-900 mb-10">
          Personalized Weather Dashboard
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

          <div className="bg-white/80 p-6 rounded-2xl text-center shadow-sm">
            <p className="text-gray-500 mb-2">Temperature</p>
            <h4 className="text-3xl font-bold text-green-900">
              32°C
            </h4>
          </div>

          <div className="bg-white/80 p-6 rounded-2xl text-center shadow-sm">
            <p className="text-gray-500 mb-2">Rain Probability</p>
            <h4 className="text-3xl font-bold text-green-900">
              15%
            </h4>
          </div>

          <div className="bg-white/80 p-6 rounded-2xl text-center shadow-sm">
            <p className="text-gray-500 mb-2">Humidity</p>
            <h4 className="text-3xl font-bold text-green-900">
              64%
            </h4>
          </div>

          <div className="bg-white/80 p-6 rounded-2xl text-center shadow-sm">
            <p className="text-gray-500 mb-2">Wind Speed</p>
            <h4 className="text-3xl font-bold text-green-900">
              12 km/h
            </h4>
          </div>

        </div>

        <div className="mt-10 p-6 bg-green-900 rounded-2xl text-white flex flex-col md:flex-row items-center justify-between gap-4">

          <div>
            <p className="font-bold text-yellow-400 mb-2">
              Farming Suggestion
            </p>

            <p>
              Soil moisture is optimal for seed sowing this week.
              Light irrigation recommended after 3 days.
            </p>
          </div>

          <button className="bg-yellow-500 hover:bg-yellow-600 text-green-900 px-6 py-3 rounded-xl font-bold transition">
            View Forecast
          </button>

        </div>

      </div>
    </section>
  );
}