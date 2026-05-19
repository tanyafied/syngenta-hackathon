"use client";

import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section
      id="home"
      className="hero-gradient h-screen flex items-center justify-center text-center px-4 pt-20 relative overflow-hidden"
      
    >
      <div className="absolute top-20 left-20 w-72 h-72 bg-green-400 rounded-full blur-3xl opacity-20"></div>

      <div className="absolute bottom-20 right-20 w-72 h-72 bg-yellow-300 rounded-full blur-3xl opacity-20"></div>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="max-w-4xl relative z-10"
      >

        <span className="bg-yellow-400 text-green-900 px-4 py-1 rounded-full text-sm font-bold mb-4 inline-block">
          SMART FARMING PLATFORM
        </span>

        <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-white mb-6">
          Smart Farming.
          <br />
          Better Harvests.
        </h1>

        <p className="text-base md:text-xl text-green-50 mb-10 leading-relaxed">
          Helping farmers with weather insights, crop guidance,
          fertilizer recommendations, and better market opportunities.
        </p>

        <div className="flex flex-col md:flex-row justify-center gap-4">

          <button className="bg-yellow-500 hover:bg-yellow-600 text-green-900 px-10 py-4 rounded-xl font-bold text-lg transition-all hover:scale-105 shadow-lg">
            Register as Farmer
          </button>

          <button className="glass text-white px-10 py-4 rounded-xl font-bold text-lg border border-white hover:bg-white/20 transition-all hover:scale-105">
            Explore Products
          </button>

        </div>

      </motion.div>
    </section>
  );
}
