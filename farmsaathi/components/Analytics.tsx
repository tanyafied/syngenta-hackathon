export default function Analytics() {
  return (
    <section className="py-24 px-6 bg-white">

      <div className="max-w-7xl mx-auto">

        <div className="text-center mb-16">

          <h2 className="text-4xl font-bold text-green-900">
            Agricultural Insights
          </h2>

          <p className="text-gray-500 mt-4">
            Real-time farmer engagement and campaign analytics.
          </p>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

          <div className="glass p-8 rounded-3xl shadow-lg">
            <p className="text-gray-500 mb-2">
              Registered Farmers
            </p>

            <h3 className="text-5xl font-bold text-green-800">
              12.4K
            </h3>

            <p className="text-green-600 mt-4">
              +18% this month
            </p>
          </div>

          <div className="glass p-8 rounded-3xl shadow-lg">
            <p className="text-gray-500 mb-2">
              Campaign Reach
            </p>

            <h3 className="text-5xl font-bold text-green-800">
              89%
            </h3>

            <p className="text-green-600 mt-4">
              WhatsApp engagement improved
            </p>
          </div>

          <div className="glass p-8 rounded-3xl shadow-lg">
            <p className="text-gray-500 mb-2">
              Retailers Active
            </p>

            <h3 className="text-5xl font-bold text-green-800">
              2.1K
            </h3>

            <p className="text-green-600 mt-4">
              Across multiple regions
            </p>
          </div>

          <div className="glass p-8 rounded-3xl shadow-lg">
            <p className="text-gray-500 mb-2">
              Product Recommendations
            </p>

            <h3 className="text-5xl font-bold text-green-800">
              95%
            </h3>

            <p className="text-green-600 mt-4">
              Farmer satisfaction rate
            </p>
          </div>

        </div>

      </div>

    </section>
  );
}
