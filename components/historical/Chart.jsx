"use client";

import {
  LineChart,
  Line,
  Area,
  AreaChart,
  XAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { format } from "date-fns"; // Import date-fns for date formatting


const Chart = ({ data }) => {
   // Format the data to display short dates like "Jan 8"
   const formattedData = data.map((item) => ({
    ...item,
    date: format(new Date(item.date), "MMM d"), // Format date to "Jan 8"
  }));
  
  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ffffff" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#ffffff" stopOpacity={0} />
            </linearGradient>
          </defs>
          {/* Area Chart */}
          <Area
            type="monotone"
            dataKey="value"
            stroke="#8884d8"
            fillOpacity={1}
            fill="url(#colorUv)"
          />
          {/* Line Chart */}
          <Line type="monotone" dataKey="value" stroke="#8884d8" />
          {/* X-Axis */}
          <XAxis
            dataKey="date"
            tick={{ fill: "#666" }}
            tickLine={false}
            axisLine={false}
          />
          {/* Tooltip */}
          <Tooltip
            contentStyle={{
              backgroundColor: "#ffffff",
              borderRadius: "10px",
              border: "1px solid #ddd",
              padding: "10px",
            }}
            labelStyle={{ color: "#333" }}
            formatter={(value, name) => [`$${value}`, "Price"]}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Chart;
