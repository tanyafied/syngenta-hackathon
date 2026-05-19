"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {

  const [open, setOpen] = useState(false);

  return (

    <nav className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-lg border-b border-green-100">

      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* LOGO */}

        <div>

          <h1 className="text-3xl font-black text-green-900">
            FarmSaathi
          </h1>

          <p className="text-sm text-green-700">
            Smart Farming Intelligence
          </p>

        </div>

        {/* DESKTOP MENU */}

        <div className="hidden lg:flex items-center gap-8 text-green-900 font-semibold">

          <a
            href="#weather"
            className="hover:text-green-600 transition"
          >
            Weather
          </a>

          <a
            href="#register"
            className="hover:text-green-600 transition"
          >
            Register
          </a>

          <a
            href="#products"
            className="hover:text-green-600 transition"
          >
            Fertilizers
          </a>

          <a
            href="#analytics"
            className="hover:text-green-600 transition"
          >
            Insights
          </a>

          <a
            href="#contact"
            className="hover:text-green-600 transition"
          >
            Support
          </a>

        </div>

        {/* DESKTOP BUTTON */}

        <a href="#register">

          <button className="hidden lg:block bg-green-800 hover:bg-green-900 text-white px-7 py-3 rounded-2xl font-bold transition">

            Register Farm

          </button>

        </a>

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

        <div className="lg:hidden bg-white border-t border-green-100 px-6 py-8 flex flex-col gap-6 text-green-900 font-semibold shadow-lg">

          <a href="#weather">
            Weather
          </a>

          <a href="#register">
            Register
          </a>

          <a href="#products">
            Fertilizers
          </a>

          <a href="#analytics">
            Insights
          </a>

          <a href="#contact">
            Support
          </a>

          <a href="#register">

            <button className="w-full bg-green-800 text-white py-4 rounded-2xl font-bold">

              Register Farm

            </button>

          </a>

        </div>

      )}

    </nav>

  );

}