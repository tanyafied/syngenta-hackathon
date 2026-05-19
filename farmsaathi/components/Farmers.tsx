"use client";

import { useEffect, useState } from "react";

export default function Farmers() {
  const [farmers, setFarmers] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/farmers")
      .then((res) => res.json())
      .then((data) => setFarmers(data));
  }, []);

  return (
    <section className="py-20 px-6 bg-green-50">
      <h1 className="text-4xl font-bold text-center text-green-900 mb-12">
        Registered Farmers
      </h1>
      <input
        type="text"
        placeholder="Search by state..."
        className="w-full p-4 rounded-xl border mb-10"
        onChange={(e) => setSearch(e.target.value)}
/>

      <div className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {farmers
            .filter((farmer: any) =>
            farmer.state?.toLowerCase().includes(search.toLowerCase())
            )
            .slice(0, 9).map((farmer: any, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-lg p-6 border border-green-100"
          >
            <h2 className="text-xl font-bold text-green-800 mb-2">
              Farmer #{index + 1}
            </h2>

            <p className="text-gray-700">
              <strong>ID:</strong> {farmer.grower_id}
            </p>

            <p className="text-gray-700">
              <strong>State:</strong> {farmer.state}
            </p>

            <p className="text-gray-700">
              <strong>Language:</strong> {farmer.language}
            </p>

            <p className="text-gray-700">
              <strong>Crop:</strong> {farmer.grower_crop_calendar}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}