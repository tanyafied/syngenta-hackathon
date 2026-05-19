export default function Contact() {
  return (
    <section className="py-24 px-6 bg-[#f7faf7]">

      <div className="max-w-6xl mx-auto glass rounded-[3rem] p-10 shadow-xl">

        <div className="text-center mb-14">

          <h2 className="text-5xl font-bold text-green-900">
            Contact & Support
          </h2>

          <p className="text-gray-600 mt-4 text-lg">
            Reach out for farmer assistance,
            dealer partnerships, and crop guidance.
          </p>

        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

          {/* LEFT */}

          <div className="space-y-6">

            <div className="bg-white p-6 rounded-2xl shadow">

              <h3 className="text-2xl font-bold text-green-800 mb-2">
                📞 Helpline
              </h3>

              <p className="text-gray-600">
                +91 98765 43210
              </p>

            </div>

            <div className="bg-white p-6 rounded-2xl shadow">

              <h3 className="text-2xl font-bold text-green-800 mb-2">
                📧 Email Support
              </h3>

              <p className="text-gray-600">
                support@farmsaathi.com
              </p>

            </div>

            <div className="bg-white p-6 rounded-2xl shadow">

              <h3 className="text-2xl font-bold text-green-800 mb-2">
                📍 Regional Offices
              </h3>

              <p className="text-gray-600">
                Odisha • Punjab • Karnataka • Maharashtra
              </p>

            </div>

          </div>

          {/* RIGHT */}

          <div className="bg-white p-8 rounded-2xl shadow">

            <div className="space-y-5">

              <input
                type="text"
                placeholder="Your Name"
                className="w-full p-4 rounded-xl border border-green-100"
              />

              <input
                type="email"
                placeholder="Your Email"
                className="w-full p-4 rounded-xl border border-green-100"
              />

              <textarea
                placeholder="Your Message"
                rows={5}
                className="w-full p-4 rounded-xl border border-green-100"
              />

              <button className="w-full bg-green-700 hover:bg-green-800 text-white py-4 rounded-xl font-bold transition">

                Send Message

              </button>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}