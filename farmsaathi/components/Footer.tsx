export default function Footer() {
  return (
    <footer className="bg-green-950 text-white px-6 py-20">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-4 gap-12">
          <div>
            <h2 className="text-4xl font-black mb-4">AgriConnect</h2>
            <p className="text-green-200 leading-relaxed text-sm">
              AI-powered agricultural intelligence platform helping farmers make smarter cultivation, investment, and market selling choices.
            </p>
          </div>

          <div>
            <h3 className="text-2xl font-bold mb-5">Platform</h3>
            <div className="space-y-3 text-green-200 text-sm">
              <p>Weather Intelligence</p>
              <p>Dynamic Crop Prediction</p>
              <p>Regional Return Estimation</p>
              <p>Custom Input Mapping</p>
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-bold mb-5">Support</h3>
            <div className="space-y-3 text-green-200 text-sm">
              <p>Farmer Assistance Core</p>
              <p>Offline SMS Alerts</p>
              <p>Multilingual Voice Streams</p>
              <p>24×7 Emergency Helpdesk</p>
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-bold mb-5">Contact</h3>
            <div className="space-y-3 text-green-200 text-sm">
              <p>📞 +91 98765 43210</p>
              <p>📧 support@agriconnect.com</p>
              <p>📍 Bhubaneswar, Odisha, India</p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-16 pt-8 text-center text-sm text-green-300">
          <p>© {new Date().getFullYear()} AgriConnect Systems Inc. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}