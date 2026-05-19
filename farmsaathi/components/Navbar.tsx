export default function Navbar() {
  return (
    <nav className="fixed w-full z-50 glass px-6 py-4 flex justify-between items-center">

      <div className="text-2xl font-bold text-green-900">
        FarmSaathi
      </div>

      <div className="hidden lg:flex space-x-8 font-semibold text-green-900">
        <a href="#home">Home</a>
        <a href="#services">Services</a>
        <a href="#products">Products</a>
        <a href="#weather">Weather</a>
        <a href="#contact">Contact</a>
      </div>

      <button className="bg-green-700 text-white px-6 py-2 rounded-full font-bold hover:bg-green-800 transition">
        Register
      </button>

    </nav>
  );
}