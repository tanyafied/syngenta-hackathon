export default function Register() {
  return (
    <section className="py-24 px-6 bg-green-50">

      <div className="max-w-4xl mx-auto glass rounded-[2rem] p-10 text-center shadow-xl">

        <h2 className="text-5xl font-bold text-green-900 mb-6">
          Join FarmSaathi
        </h2>

        <p className="text-gray-600 text-lg mb-10">
          Register to receive personalized crop guidance,
          weather alerts, and dealer recommendations.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <input
            type="text"
            placeholder="Farmer Name"
            className="p-4 rounded-xl border border-green-100"
          />

          <input
            type="text"
            placeholder="Mobile Number"
            className="p-4 rounded-xl border border-green-100"
          />

          <input
            type="text"
            placeholder="Location"
            className="p-4 rounded-xl border border-green-100"
          />

          <select className="p-4 rounded-xl border border-green-100">

            <option>Select Language</option>
            <option>English</option>
            <option>Hindi</option>
            <option>Odia</option>

          </select>

        </div>

        <button className="mt-10 bg-green-700 hover:bg-green-800 text-white px-10 py-4 rounded-2xl font-bold transition">

          Register Now

        </button>

      </div>

    </section>
  );
}