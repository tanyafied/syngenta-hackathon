"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { month: "Jan", yield: 12, market: 10 },
  { month: "Feb", yield: 19, market: 15 },
  { month: "Mar", yield: 15, market: 12 },
  { month: "Apr", yield: 25, market: 18 },
  { month: "May", yield: 22, market: 28 },
  { month: "Jun", yield: 30, market: 25 },
];

export default function Analytics() {
  return (
    <section className="py-24 bg-white/50">

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

        <div>

          <h2 className="text-4xl font-bold text-green-900 mb-6">
            Real-Time Crop Analytics
          </h2>

          <p className="text-gray-600 mb-8 text-lg">
            Track crop yield trends, market fluctuations,
            and seasonal farming insights in real time.
          </p>

          <div className="space-y-4">

            <div className="flex items-center space-x-4 p-4 bg-white rounded-xl shadow-sm border-l-4 border-green-500">
              <span className="text-2xl">📈</span>

              <span className="font-semibold text-green-900">
                Market prices expected to rise by 12%
              </span>
            </div>

            <div className="flex items-center space-x-4 p-4 bg-white rounded-xl shadow-sm border-l-4 border-yellow-500">
              <span className="text-2xl">⚠️</span>

              <span className="font-semibold text-green-900">
                Heavy rainfall predicted in nearby regions
              </span>
            </div>

          </div>

        </div>

        <div className="bg-white p-8 rounded-3xl shadow-xl h-[400px]">

          <ResponsiveContainer width="100%" height="100%">

            <LineChart data={data}>

              <XAxis dataKey="month" />

              <YAxis />

              <Tooltip />

              <Line
                type="monotone"
                dataKey="yield"
                stroke="#4CAF50"
                strokeWidth={4}
              />

              <Line
                type="monotone"
                dataKey="market"
                stroke="#FBC02D"
                strokeWidth={4}
              />

            </LineChart>

          </ResponsiveContainer>

        </div>

      </div>

    </section>
  );
}