"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Stats from "@/components/LiveAlerts";
import Analytics from "@/components/Analytics";
import Recommendations from "@/components/Recommendations";
import Dealers from "@/components/Dealers"; // 🌟 Newly Included Component Row
import Products from "@/components/Products";
import Weather from "@/components/Weather";
import Register from "@/components/Register";
import Farmers from "@/components/Farmers";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import ChatBot from "@/components/ChatBot";

export default function Home() {
  const [activeLocation, setActiveLocation] = useState("Chennai");

  const handleRegistrationComplete = (locationName: string) => {
    if (locationName) {
      setActiveLocation(locationName);
    }
  };

  return (
    <main className="bg-[#F5F5DC] overflow-x-hidden">
      <Navbar />
      <Hero />
      <Stats />
      <Analytics />

      <Recommendations activeLocation={activeLocation} />
      
      {/* 🌟 Mounted the newly added Dealers section row directly into the flow */}
      <Dealers activeLocation={activeLocation} />
      
      <Products />
      <Weather activeLocation={activeLocation} />
      
      <Register onRegistrationSuccess={handleRegistrationComplete} />

      <ChatBot />
      
      <Farmers />
      <Contact />
      <Footer />
    </main>
  );
}