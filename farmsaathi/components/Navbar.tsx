"use client";

import { useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: "Weather", href: "#weather" },
    { name: "Register", href: "#register" },
    { name: "Insights", href: "#insights" },
    { name: "Syngenta Products", href: "#syngenta-products" }, // 💡 Added right between Insights and Support
    { name: "Support", href: "#contact" },
  ];

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const targetElement = document.querySelector(href);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setIsOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#F5F5DC]/90 backdrop-blur-md border-b border-green-900/10 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* LOGO */}
        <div className="flex flex-col">
          <span className="text-2xl font-black text-green-950 tracking-tight">
            AgriConnect
          </span>
          <span className="text-xs font-semibold text-green-700 uppercase tracking-widest -mt-1">
            Smart Farming Intelligence
          </span>
        </div>

        {/* DESKTOP NAV ITEMS */}
        <div className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              onClick={(e) => handleScroll(e, item.href)}
              className="text-base font-semibold text-green-900 hover:text-green-700 transition relative py-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-green-700 hover:after:w-full after:transition-all"
            >
              {item.name}
            </a>
          ))}
        </div>

        {/* RIGHT SIDE CTA */}
        <div className="hidden md:flex items-center">
          <a
            href="#register"
            onClick={(e) => handleScroll(e, "#register")}
            className="bg-green-800 hover:bg-green-900 text-white font-bold px-6 py-3 rounded-2xl transition shadow-md hover:shadow-lg transform active:scale-95"
          >
            Register Farm
          </a>
        </div>

        {/* MOBILE MENU TOGGLE */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-green-950 focus:outline-none p-2"
          aria-label="Toggle Navigation Menu"
        >
          <svg className="h-6 w-6 fill-none stroke-current" viewBox="0 0 24 24">
            {isOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* MOBILE DROPDOWN CONTAINER */}
      {isOpen && (
        <div className="md:hidden bg-[#F5F5DC] border-b border-green-900/10 px-6 py-6 space-y-4 animate-fadeIn">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              onClick={(e) => handleScroll(e, item.href)}
              className="block text-lg font-bold text-green-950 hover:text-green-700 transition"
            >
              {item.name}
            </a>
          ))}
          <hr className="border-green-900/10 my-4" />
          <a
            href="#register"
            onClick={(e) => handleScroll(e, "#register")}
            className="block text-center bg-green-800 text-white font-bold py-4 rounded-xl shadow-md"
          >
            Register Farm
          </a>
        </div>
      )}
    </nav>
  );
}