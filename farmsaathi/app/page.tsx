import LiveAlerts from "@/components/LiveAlerts";
import LanguageSupport from "@/components/LanguageSupport";

import Recommendations from "@/components/Recommendations";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Analytics from "@/components/Analytics";
import Register from "@/components/Register";
import Products from "@/components/Products";
import Weather from "@/components/Weather";
import Trust from "@/components/Trust";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import Stats from "@/components/Stats";
import Farmers from "@/components/Farmers";
import Charts from "@/components/Charts";

export default function Home() {
  return (
    <main className="overflow-x-hidden bg-[#F5F5DC]">
      <Navbar />
      <Hero />
      <Stats />
      <Features />
      <Analytics />
      <Charts />
      <Register />
      <Products />
      <Weather />
      <Recommendations />
      <LanguageSupport />
      <LiveAlerts />
      <Trust />
      <Contact />
      <Footer />
      <Farmers />

      <a
        href="#"
        className="fixed bottom-6 right-6 bg-green-500 text-white w-16 h-16 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition z-50 text-2xl"
      >
  💬
      </a>
    </main >
    
  );
}