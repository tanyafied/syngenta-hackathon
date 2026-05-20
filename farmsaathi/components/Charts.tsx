"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Charts() {
  const data = {
    labels: ["Odisha", "Punjab", "Karnataka", "Maharashtra", "Tamil Nadu"],
    datasets: [
      {
        label: "Farmer Registrations via AgriConnect",
        data: [1200, 1900, 800, 1500, 1000],
        backgroundColor: ["#2E7D32", "#388E3C", "#43A047", "#4CAF50", "#66BB6A"],
        borderRadius: 10,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" as const },
    },
  };

  return (
    <section className="py-24 px-6 bg-[#f5f8f5]">
      <div className="max-w-6xl mx-auto bg-white rounded-[3rem] p-10 shadow-xl border border-green-50">
        <div className="mb-10 text-center">
          <h3 className="text-3xl font-bold text-green-900">Regional Cluster Scale</h3>
          <p className="text-gray-500 mt-2">Live operational metric volume sorted by target regions</p>
        </div>
        <div className="w-full max-h-[400px] flex justify-center">
          <Bar data={data} options={options} />
        </div>
      </div>
    </section>
  );
}