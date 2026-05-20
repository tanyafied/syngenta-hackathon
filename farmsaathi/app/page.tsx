import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Stats from "@/components/LiveAlerts";
import Analytics from "@/components/Analytics";
import Recommendations from "@/components/Recommendations";
import Products from "@/components/Products";
import Weather from "@/components/Weather";
import Register from "@/components/Register";
import Farmers from "@/components/Farmers";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (

    <main className="bg-[#F5F5DC] overflow-x-hidden">

      {/* NAVBAR */}
      <Navbar />

      {/* LANDING HERO */}
      <Hero />

      {/* LIVE INSIGHTS */}
      <Stats />

      {/* DATA ANALYTICS */}
      <Analytics />

      {/* SMART RECOMMENDATIONS */}
      <Recommendations />

      {/* FERTILIZER PRODUCTS */}
      <Products />

      {/* WEATHER + ALERTS */}
      <Weather />

      {/* FARMER REGISTRATION */}
      <Register />

      {/* REGISTERED FARMERS */}
      <Farmers />

      {/* CONTACT */}
      <Contact />

      {/* FOOTER */}
      <Footer />

    </main>

  );
}