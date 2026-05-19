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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function Charts() {
  const data = {
    labels: [
      "Odisha",
      "Punjab",
      "Karnataka",
      "Maharashtra",
      "Tamil Nadu",
    ],

    datasets: [
      {
        label: "Farmer Registrations",
        data: [1200, 1900, 800, 1500, 1000],

        backgroundColor: [
          "#2E7D32",
          "#388E3C",
          "#43A047",
          "#4CAF50",
          "#66BB6A",
        ],

        borderRadius: 10,
      },
    ],
  };

  return (
    <section className="py-24 px-6 bg-[#f5f8f5]">

      <div className="max-w-6xl mx-auto glass rounded-[3rem] p-10 shadow-xl">

        <div className="mb-10">

          <h2 className="text-4xl font-bold text-green-900">
            Regional Analytics
          </h2>

          <p className="text-gray-500 mt-3">
            Farmer registrations across states.
          </p>

        </div>

        <Bar data={data} />

      </div>

    </section>
  );
}