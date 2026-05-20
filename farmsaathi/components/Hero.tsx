"use client";

import { motion } from "framer-motion";

export default function Hero() {
  return (

    <section className="min-h-screen bg-gradient-to-br from-green-950 via-green-900 to-green-800 text-white px-6 pt-32">

      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">

        {/* LEFT */}

        <div>

          <div className="inline-block bg-green-700/40 px-5 py-2 rounded-full mb-6">

            🌾 Smart Farming Intelligence Platform

          </div>

          <h1 className="text-6xl font-black leading-tight mb-8">

            Know What To
            <span className="text-yellow-400"> Grow</span>,
            <br />
            When To Sell,
            <br />
            And How Much
            <span className="text-green-300"> Profit</span>
            You Can Make.

          </h1>

          <p className="text-xl text-green-100 mb-10 leading-relaxed">

            FarmSaathi helps farmers with
            weather insights, crop recommendations,
            fertilizer suggestions, and profit prediction
            based on their region.

          </p>

          <div className="flex flex-wrap gap-5">

            <a href="#weather">

              <button className="bg-yellow-400 hover:bg-yellow-300 text-green-950 px-10 py-4 rounded-2xl font-bold text-lg transition">

                Check Farm Insights

              </button>

            </a>

            <a href="#register">

              <button className="border border-white/30 hover:bg-white/10 px-10 py-4 rounded-2xl font-bold text-lg transition">

                Register Farm

              </button>

            </a>

          </div>

        </div>

        {/* RIGHT */}

        <div className="glass rounded-[2rem] p-8 bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl">

          <div className="flex items-center justify-between mb-8">

            <div>

              <p className="text-green-200">
                Current Location
              </p>

              <h3 className="text-3xl font-bold">
                Brahmapur, Odisha
              </h3>

            </div>

            <div className="text-6xl">
              🌦
            </div>

          </div>

          <div className="grid grid-cols-2 gap-5">

            <div className="bg-white/10 p-5 rounded-2xl">

              <p className="text-green-200 mb-2">
                Temperature
              </p>

              <h2 className="text-4xl font-bold">
                31°C
              </h2>

            </div>

            <div className="bg-white/10 p-5 rounded-2xl">

              <p className="text-green-200 mb-2">
                Rainfall
              </p>

              <h2 className="text-4xl font-bold">
                High
              </h2>

            </div>

            <div className="bg-white/10 p-5 rounded-2xl">

              <p className="text-green-200 mb-2">
                Best Crop
              </p>

              <h2 className="text-3xl font-bold">
                Maize
              </h2>

            </div>

            <div className="bg-white/10 p-5 rounded-2xl">

              <p className="text-green-200 mb-2">
                Expected Profit
              </p>

              <h2 className="text-3xl font-bold">
                ₹45K
              </h2>

            </div>

          </div>

          <div className="mt-8 bg-yellow-400 text-green-950 rounded-2xl p-5 font-semibold text-lg">

            Recommended Fertilizer:
            Syngenta CropBoost NPK

          </div>

        </div>

      </div>

    </section>

    )
}