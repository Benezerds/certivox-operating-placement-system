"use client";

import React from "react";
import { LineChart, Line, XAxis, ResponsiveContainer } from "recharts";

const SimpleLineChart = () => {
  // Example data for the chart
  const data = [
    { date: "Jan 1", value: 10 },
    { date: "Jan 8", value: 15 },
    { date: "Jan 15", value: 12 },
    { date: "Jan 22", value: 18 },
    { date: "Jan 29", value: 14 },
  ];

  // Total projects and percentage change
  const totalProjects = 100;
  const percentageChange = 10; // Simulated percentage change

  return (
    <div className="flex flex-col items-center bg-white rounded-lg shadow-md p-4 max-w-md">
      {/* Title and Total */}
      <div className="text-center mb-4">
        <h2 className="text-sm font-medium text-gray-700">Total projects</h2>
        <div className="text-4xl font-bold">{totalProjects}</div>
        <div className="text-sm font-medium text-gray-500">
          7 days{" "}
          <span className={`font-bold ${percentageChange >= 0 ? "text-green-500" : "text-red-500"}`}>
            {percentageChange >= 0 ? `+${percentageChange}%` : `${percentageChange}%`}
          </span>
        </div>
      </div>

      {/* Line Chart */}
      <div className="w-full h-32">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#666" }} />
            <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SimpleLineChart;
