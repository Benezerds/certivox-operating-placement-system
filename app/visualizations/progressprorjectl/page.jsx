"use client";

import React, { useState } from "react";
import {
  LineChart,
  Line,
  Area,
  AreaChart,
  XAxis,
  ResponsiveContainer,
} from "recharts";

const Chart = () => {
  const [chartData, setChartData] = useState([
    { date: "Jan 1", value: 50 },
    { date: "Jan 8", value: 200 },
    { date: "Jan 15", value: 100 },
    { date: "Jan 22", value: 250 },
    { date: "Jan 29", value: 150 },
  ]);

  // Example function to update chart data
  const handleButtonClick = (range) => {
    switch (range) {
      case "1M":
        setChartData([
          { date: "Jan 1", value: 50 },
          { date: "Jan 8", value: 200 },
          { date: "Jan 15", value: 100 },
          { date: "Jan 22", value: 250 },
          { date: "Jan 29", value: 150 },
        ]);
        break;
      case "3M":
        setChartData([
          { date: "Nov 1", value: 70 },
          { date: "Dec 1", value: 180 },
          { date: "Jan 1", value: 200 },
          { date: "Jan 15", value: 250 },
          { date: "Jan 29", value: 150 },
        ]);
        break;
      // Add cases for "6M", "YTD", "1Y", "All" as needed
      default:
        setChartData([
          { date: "Jan 1", value: 50 },
          { date: "Jan 8", value: 200 },
          { date: "Jan 15", value: 100 },
          { date: "Jan 22", value: 250 },
          { date: "Jan 29", value: 150 },
        ]);
        break;
    }
  };

  return (
    <div className="w-full">
      {/* Chart */}
      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ffffff" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#ffffff" stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="value"
              stroke="#8884d8"
              fillOpacity={1}
              fill="url(#colorUv)"
            />
            <Line type="monotone" dataKey="value" stroke="#8884d8" />
            <XAxis
              dataKey="date"
              tick={{ fill: "#666" }}
              tickLine={false}
              axisLine={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Buttons */}
      <div className="flex justify-between mt-4 gap-2">
        {["1M", "3M", "6M", "YTD", "1Y", "All"].map((item) => (
          <button
            key={item}
            onClick={() => handleButtonClick(item)}
            className="px-4 py-2 bg-gray-700 rounded-full text-sm font-medium hover:bg-gray-600"
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Chart;
