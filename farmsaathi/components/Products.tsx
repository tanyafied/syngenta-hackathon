export default function Products() {
  return (
    <section
      id="products"
      className="py-24 px-6 max-w-7xl mx-auto"
    >

      <div className="flex justify-between items-end mb-12">

        <div>
          <h2 className="text-4xl font-bold text-green-900">
            Premium Supplies
          </h2>

          <p className="text-gray-500 mt-2">
            Verified fertilizers and pesticides.
          </p>
        </div>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

        <div className="bg-white rounded-3xl overflow-hidden shadow-sm card-hover">
          <img
            src="https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?auto=format&fit=crop&q=80&w=600"
            className="h-48 w-full object-cover"
          />

          <div className="p-6">

            <h4 className="text-lg font-bold text-green-900">
              Premium NPK Mix
            </h4>

            <p className="text-gray-500 text-sm mt-2">
              Balanced nutrition for crops.
            </p>

            <div className="flex justify-between items-center mt-6">

              <span className="text-xl font-bold text-green-900">
                ₹850
              </span>

              <button className="bg-green-700 text-white px-4 py-2 rounded-xl hover:bg-green-800 transition">
                Buy
              </button>

            </div>

          </div>
        </div>

        <div className="bg-white rounded-3xl overflow-hidden shadow-sm card-hover">
          <img
            src="https://images.unsplash.com/photo-1628352081506-83c43123ed6d?auto=format&fit=crop&q=80&w=600"
            className="h-48 w-full object-cover"
          />

          <div className="p-6">

            <h4 className="text-lg font-bold text-green-900">
              Bio-Insecticide
            </h4>

            <p className="text-gray-500 text-sm mt-2">
              Protection against crop pests.
            </p>

            <div className="flex justify-between items-center mt-6">

              <span className="text-xl font-bold text-green-900">
                ₹420
              </span>

              <button className="bg-green-700 text-white px-4 py-2 rounded-xl hover:bg-green-800 transition">
                Buy
              </button>

            </div>

          </div>
        </div>

      </div>

    </section>
  );
}