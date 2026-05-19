export default function Stats() {
  return (
    <section className="py-20 bg-white">

      <div className="max-w-7xl mx-auto px-6">

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          <div className="glass rounded-3xl p-8 text-center shadow-lg">
            <h2 className="text-5xl font-bold text-green-700">
              10K+
            </h2>

            <p className="mt-4 text-gray-600">
              Farmers Connected
            </p>
          </div>

          <div className="glass rounded-3xl p-8 text-center shadow-lg">
            <h2 className="text-5xl font-bold text-green-700">
              92%
            </h2>

            <p className="mt-4 text-gray-600">
              Crop Advisory Accuracy
            </p>
          </div>

          <div className="glass rounded-3xl p-8 text-center shadow-lg">
            <h2 className="text-5xl font-bold text-green-700">
              500+
            </h2>

            <p className="mt-4 text-gray-600">
              Verified Dealers
            </p>
          </div>

          <div className="glass rounded-3xl p-8 text-center shadow-lg">
            <h2 className="text-5xl font-bold text-green-700">
              24/7
            </h2>

            <p className="mt-4 text-gray-600">
              Weather Monitoring
            </p>
          </div>

        </div>

      </div>

    </section>
  );
}