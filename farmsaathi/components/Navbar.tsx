"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {

  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/70 backdrop-blur-lg border-b border-white/20">

      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* LOGO */}

        <h1 className="text-2xl font-bold text-green-900">
          FarmSaathi
        </h1>

        {/* DESKTOP MENU */}

        <div className="hidden lg:flex gap-8 font-semibold text-green-900">

          <a href="#home" className="hover:text-green-600 transition">
            Home
          </a>

          <a href="#services" className="hover:text-green-600 transition">
            Services
          </a>

          <a href="#products" className="hover:text-green-600 transition">
            Products
          </a>

          <a href="#weather" className="hover:text-green-600 transition">
            Weather
          </a>

          <a href="#contact" className="hover:text-green-600 transition">
            Contact
          </a>

        </div>

        {/* DESKTOP BUTTON */}

        <button className="hidden lg:block bg-green-700 hover:bg-green-800 text-white px-6 py-2 rounded-full transition">

          Register

        </button>

        {/* MOBILE MENU BUTTON */}

        <button
          className="lg:hidden text-green-900"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={32} /> : <Menu size={32} />}
        </button>

      </div>

      {/* MOBILE MENU */}

      {open && (

        <div className="lg:hidden bg-white/90 backdrop-blur-lg px-6 py-6 flex flex-col gap-6 text-green-900 font-semibold border-t border-green-100">

          <a href="#home">Home</a>

          <a href="#services">Services</a>

          <a href="#products">Products</a>

          <a href="#weather">Weather</a>

          <a href="#contact">Contact</a>

          <button className="bg-green-700 text-white py-3 rounded-xl">
            Register
          </button>

        </div>

      )}

    </nav>
  );
}