"use client";

import { useEffect, useState } from "react";

export default function Farmers() {

  const [farmers, setFarmers] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    // Point cleanly to your backend folder server on port 8080
    fetch("http://localhost:8080/api/v1/farmers")
      .then((res) => {
        if (!res.ok) throw new Error("Backend server error");
        return res.json();
      })
      .then((data) => setFarmers(data))
      .catch((err) => console.error("Error loading farmers list:", err));
  }, []);

  return (

    <section className="py-24 px-6 bg-white">

      <div className="max-w-7xl mx-auto">

        {/* HEADER */}

        <div className="text-center mb-16">

          <h2 className="text-5xl font-bold text-green-900">
            Registered Farmer Intelligence
          </h2>

          <p className="text-gray-600 mt-4 text-lg">

            Live farmer profiles generated from
            agricultural datasets, crop activity,
            and regional farming trends.

          </p>

        </div>

        {/* SEARCH */}

        <div className="mb-12">

          <input
            type="text"
            placeholder="Search by state..."
            className="w-full p-5 rounded-2xl border border-green-100 shadow-sm"
            onChange={(e) => setSearch(e.target.value)}
          />

        </div>

        {/* GRID */}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">

          {farmers
            .filter((farmer: any) =>
              farmer.state
                ?.toLowerCase()
                .includes(search.toLowerCase())
            )
            .slice(0, 9)
            .map((farmer: any, index) => (

              <div
                key={index}
                className="glass rounded-[2rem] p-8 shadow-xl border border-green-50"
              >

                {/* TOP */}

                <div className="flex justify-between items-center mb-8">

                  <div>

                    <p className="text-gray-500">
                      Farmer ID
                    </p>

                    <h3 className="text-2xl font-bold text-green-900">
                      #{farmer.grower_id}
                    </h3>

                  </div>

                  <div className="text-5xl">
                    🌾
                  </div>

                </div>

                {/* DETAILS */}

                <div className="space-y-4">

                  <div className="flex justify-between">

                    <span className="text-gray-500">
                      State
                    </span>

                    <span className="font-bold text-green-900">
                      {farmer.state}
                    </span>

                  </div>

                  <div className="flex justify-between">

                    <span className="text-gray-500">
                      Language
                    </span>

                    <span className="font-bold text-green-900">
                      {farmer.language}
                    </span>

                  </div>

                  <div className="flex justify-between">

                    <span className="text-gray-500">
                      Crop Type
                    </span>

                    <span className="font-bold text-green-900">
                      {farmer.grower_crop_calendar}
                    </span>

                  </div>

                  <div className="flex justify-between">

                    <span className="text-gray-500">
                      AI Recommendation
                    </span>

                    <span className="font-bold text-yellow-600">
                      Rice
                    </span>

                  </div>

                </div>

                {/* ALERT */}

                <div className="mt-8 bg-yellow-50 border border-yellow-100 rounded-2xl p-5">

                  <h4 className="font-bold text-yellow-700 mb-2">
                    🚨 Smart Alert
                  </h4>

                  <p className="text-gray-600 text-sm">

                    Rainfall expected within 48 hours.
                    Recommended to delay pesticide spraying.

                  </p>

                </div>

              </div>

            ))}

        </div>

      </div>

    </section>

  );

}