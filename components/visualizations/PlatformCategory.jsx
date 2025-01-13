"use client";

import { useState, useEffect, useCallback } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/app/firebase";

const COLORS = ["#FF8042", "#0088FE", "#00C49F", "#FFBB28", "#AF19FF"]; // Color palette for slices

const PlatformDistribution = () => {
  const [chartData, setChartData] = useState([]);

  const processPlatformData = useCallback((snapshot) => {
    if (snapshot.empty) {
      console.warn("No documents found in the 'Projects' collection.");
      setChartData([]);
      return;
    }

    const platformCounts = {};

    snapshot.docs.forEach((doc) => {
      const project = doc.data();
      console.log("Fetched project:", project); // Log the project data
      const platform = project.platform;
      console.log("Fetched platform:", platform); // Log the platform field

      if (Array.isArray(platform)) {
        platform.forEach((p) => {
          const platformKey = p.trim();
          platformCounts[platformKey] = (platformCounts[platformKey] || 0) + 1;
        });
      } else if (typeof platform === "string" && platform.trim()) {
        const platformKey = platform.trim();
        platformCounts[platformKey] = (platformCounts[platformKey] || 0) + 1;
      } else {
        platformCounts["Unknown"] = (platformCounts["Unknown"] || 0) + 1;
      }
    });

    console.log("Platform counts:", platformCounts); // Log the counts

    const total = Object.values(platformCounts).reduce((sum, count) => sum + count, 0);

    const data = Object.entries(platformCounts).map(([name, value]) => ({
      name,
      value: (value / total) * 100, // Convert to percentage
    }));

    const sortedData = data.sort((a, b) => b.value - a.value);
    const top5 = sortedData.slice(0, 5);

    const othersValue = sortedData
      .slice(5)
      .reduce((sum, entry) => sum + entry.value, 0);

    if (othersValue > 0) {
      top5.push({ name: "Others", value: othersValue });
    }

    console.log("Chart data:", top5); // Log final chart data
    setChartData(top5); // Update chart data
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "Projects"), processPlatformData);
    return () => unsubscribe();
  }, [processPlatformData]);

  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-lg">
      <h2 className="text-xl font-semibold mb-4 text-center">Platform Distribution</h2>

      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            innerRadius={60} // Inner radius for doughnut style
            fill="#8884d8"
            label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
              const radius = innerRadius + (outerRadius - innerRadius) / 2;
              const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
              const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));
              return (
                <text
                  x={x}
                  y={y}
                  fill="white"
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="12"
                >
                  {`${(percent * 100).toFixed(1)}%`}
                </text>
              );
            }}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `${value.toFixed(2)}%`} />
        </PieChart>
      </ResponsiveContainer>

      <div className="flex flex-wrap justify-center mt-4 space-x-4">
        {chartData.map((entry, index) => (
          <div key={`legend-${index}`} className="flex items-center space-x-2">
            <span
              style={{
                display: "inline-block",
                width: "10px",
                height: "10px",
                backgroundColor: COLORS[index % COLORS.length],
                borderRadius: "50%",
              }}
            ></span>
            <span className="text-sm text-gray-700">{entry.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlatformDistribution;

