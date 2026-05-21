"use client";

export default function Navbar() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    } else {
      console.warn(`Target section #${id} not found in DOM.`);
    }
  };

  return (
    <nav className="w-full bg-[#F5F5DC] border-b border-[#1b4332]/10 sticky top-0 z-50 px-6 py-4 transition-all shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* BRAND LOGO */}
        <div className="flex flex-col cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <span className="text-2xl font-black text-[#1b4332] tracking-tight leading-none">
            AgriConnect
          </span>
          <span className="text-[10px] font-bold text-green-700 uppercase tracking-widest mt-1">
            Smart Farming Intelligence
          </span>
        </div>

        {/* NAVIGATION LINKS */}
        <div className="hidden md:flex items-center gap-8">
          <button 
            onClick={() => scrollToSection("weather")}
            className="text-[#1b4332]/80 hover:text-[#1b4332] font-semibold text-sm transition-colors"
          >
            Weather
          </button>
          
          <button 
            onClick={() => scrollToSection("register")}
            className="text-[#1b4332]/80 hover:text-[#1b4332] font-semibold text-sm transition-colors"
          >
            Register
          </button>

          {/* ⚡ FIXED: Now scrolls directly to your Live Alerts section */}
          <button 
            onClick={() => scrollToSection("insights")}
            className="text-[#1b4332]/80 hover:text-[#1b4332] font-semibold text-sm transition-colors"
          >
            Insights
          </button>

          {/* 🌟 NEW: Added Dealers shortcut navigation hook */}
          <button 
            onClick={() => scrollToSection("dealers")}
            className="text-[#1b4332]/80 hover:text-[#1b4332] font-semibold text-sm transition-colors relative group"
          >
            Dealers
            <span className="absolute -top-3 -right-4 bg-green-600 text-white font-extrabold text-[8px] px-1.5 py-0.5 rounded-full scale-90 animate-pulse">
              NEW
            </span>
          </button>

          <button 
            onClick={() => scrollToSection("products")}
            className="text-[#1b4332]/80 hover:text-[#1b4332] font-semibold text-sm transition-colors"
          >
            Syngenta Products
          </button>
          
          <button 
            onClick={() => scrollToSection("contact")}
            className="text-[#1b4332]/80 hover:text-[#1b4332] font-semibold text-sm transition-colors"
          >
            Support
          </button>
        </div>

        {/* ACTION CTA BUTTON */}
        <div>
          <button 
            onClick={() => scrollToSection("register")}
            className="bg-[#1b4332] hover:bg-[#133024] text-white font-bold text-sm px-5 py-2.5 rounded-full transition-all shadow-md active:scale-95"
          >
            Register Farm
          </button>
        </div>

      </div>
    </nav>
  );
}