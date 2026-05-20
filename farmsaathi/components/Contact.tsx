export default function Contact() {
  return (
    <section id="contact" className="py-24 px-6 bg-[#f7faf7]">
      <div className="max-w-6xl mx-auto bg-white rounded-[3rem] p-10 shadow-xl border border-green-100">
        <div className="text-center mb-14">
          <h2 className="text-5xl font-bold text-green-900">
            Contact & Support
          </h2>
          <p className="text-gray-600 mt-4 text-lg">
            Reach out for farmer assistance, network partnerships, and crop core guidance.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="space-y-6">
            <div className="bg-green-50/50 border border-green-100 p-6 rounded-2xl shadow-sm">
              <h3 className="text-2xl font-bold text-green-800 mb-2">📞 National Helpline</h3>
              <p className="text-gray-700 font-medium">+91 98765 43210</p>
            </div>

            <div className="bg-green-50/50 border border-green-100 p-6 rounded-2xl shadow-sm">
              <h3 className="text-2xl font-bold text-green-800 mb-2">📧 Corporate Email</h3>
              <p className="text-gray-700 font-medium">support@agriconnect.com</p>
            </div>

            <div className="bg-green-50/50 border border-green-100 p-6 rounded-2xl shadow-sm">
              <h3 className="text-2xl font-bold text-green-800 mb-2">📍 Central Offices</h3>
              <p className="text-gray-600 text-sm">Odisha • Punjab • Karnataka • Maharashtra • Tamil Nadu</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-950 to-green-900 p-8 rounded-2xl shadow-xl text-white">
            <h3 className="text-2xl font-bold mb-4">Drop a Message</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Your Name"
                className="w-full p-4 rounded-xl border border-white/10 bg-white/10 text-white placeholder:text-green-200"
              />
              <input
                type="email"
                placeholder="Your Email"
                className="w-full p-4 rounded-xl border border-white/10 bg-white/10 text-white placeholder:text-green-200"
              />
              <textarea
                placeholder="Your Message"
                rows={4}
                className="w-full p-4 rounded-xl border border-white/10 bg-white/10 text-white placeholder:text-green-200"
              />
              <button className="w-full bg-yellow-400 hover:bg-yellow-500 text-green-950 py-4 rounded-xl font-bold transition shadow-md">
                Send Query Request
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}