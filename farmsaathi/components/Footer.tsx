export default function Footer() {

  return (

    <footer
      id="contact"
      className="bg-green-950 text-white px-6 py-20"
    >

      <div className="max-w-7xl mx-auto">

        <div className="grid lg:grid-cols-4 gap-12">

          {/* BRAND */}

          <div>

            <h2 className="text-4xl font-black mb-4">
              FarmSaathi
            </h2>

            <p className="text-green-200 leading-relaxed">

              AI-powered agricultural intelligence platform
              helping farmers make smarter cultivation,
              fertilizer, and selling decisions.

            </p>

          </div>

          {/* PLATFORM */}

          <div>

            <h3 className="text-2xl font-bold mb-5">
              Platform
            </h3>

            <div className="space-y-3 text-green-200">

              <p>Weather Intelligence</p>

              <p>Crop Prediction</p>

              <p>Profit Estimation</p>

              <p>Fertilizer Recommendation</p>

            </div>

          </div>

          {/* SUPPORT */}

          <div>

            <h3 className="text-2xl font-bold mb-5">
              Support
            </h3>

            <div className="space-y-3 text-green-200">

              <p>Farmer Assistance</p>

              <p>Offline SMS Alerts</p>

              <p>Regional Language Support</p>

              <p>24×7 Help Center</p>

            </div>

          </div>

          {/* CONTACT */}

          <div>

            <h3 className="text-2xl font-bold mb-5">
              Contact
            </h3>

            <div className="space-y-3 text-green-200">

              <p>📞 +91 98765 43210</p>

              <p>📧 support@farmsaathi.com</p>

              <p>📍 Odisha, India</p>

            </div>

          </div>

        </div>

        {/* BOTTOM */}

        <div className="border-t border-green-800 mt-16 pt-8 flex flex-col lg:flex-row justify-between gap-5 text-green-300">

          <p>
            © 2026 FarmSaathi. All rights reserved.
          </p>

          <p>
            Empowering Farmers Through Smart Agricultural Intelligence 🌾
          </p>

        </div>

      </div>

    </footer>

  );

}