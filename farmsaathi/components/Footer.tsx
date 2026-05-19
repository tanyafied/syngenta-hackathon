export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-green-900 to-black text-white py-16 px-6">

      <div className="max-w-7xl mx-auto">

        <div className="flex flex-col md:flex-row justify-between items-center gap-6">

          <div>
            <h2 className="text-3xl font-bold">
              FarmSaathi
            </h2>

            <p className="text-green-200/60 mt-2">
              Smart farming for better harvests.
            </p>
          </div>

          <div className="flex gap-8 text-green-200/70">
            <a href="#">Home</a>
            <a href="#">Services</a>
            <a href="#">Products</a>
            <a href="#">Contact</a>
          </div>

        </div>

        <div className="border-t border-green-800 mt-10 pt-6 text-center text-green-200/40">
          © 2026 FarmSaathi. All rights reserved.
        </div>

      </div>

    </footer>
  );
}