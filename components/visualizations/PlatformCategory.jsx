"use client";

import { useState, useEffect, useCallback } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "@/app/firebase";

const COLORS = ["#3B82F6", "#6366F1", "#10B981", "#F59E0B", "#EF4444"];

const PlatformCategory = () => {
  const [chartData, setChartData] = useState([]);
  const [selectedQuarter, setSelectedQuarter] = useState("All");

  const processPlatformData = (snapshot, quarter) => {
    const platformCounts = {};

    snapshot.docs.forEach((doc) => {
      const { platform, quarter: projectQuarter } = doc.data();
      if (quarter !== "All" && projectQuarter !== quarter) return;

      if (Array.isArray(platform)) {
        platform.forEach((p) => {
          const key = p.trim();
          platformCounts[key] = (platformCounts[key] || 0) + 1;
        });
      } else if (typeof platform === "string" && platform.trim()) {
        const key = platform.trim();
        platformCounts[key] = (platformCounts[key] || 0) + 1;
      } else {
        platformCounts["Unknown"] = (platformCounts["Unknown"] || 0) + 1;
      }
    });

    const total = Object.values(platformCounts).reduce((sum, count) => sum + count, 0);
    const data = Object.entries(platformCounts)
      .map(([name, value]) => ({
        name,
        value: (value / total) * 100,
      }))
      .sort((a, b) => b.value - a.value);

    const top5 = data.slice(0, 5);
    const othersValue = data.slice(5).reduce((sum, entry) => sum + entry.value, 0);
    if (othersValue > 0) {
      top5.push({ name: "Others", value: othersValue });
    }

    return top5;
  };

  const fetchChartData = useCallback(() => {
    const q =
      selectedQuarter === "All"
        ? collection(db, "Projects")
        : query(collection(db, "Projects"), where("quarter", "==", selectedQuarter));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        setChartData(processPlatformData(snapshot, selectedQuarter));
      } else {
        console.warn("No documents found in the 'Projects' collection.");
        setChartData([]);
      }
    });

    return unsubscribe;
  }, [selectedQuarter]);

  useEffect(() => {
    const unsubscribe = fetchChartData();
    return () => unsubscribe();
  }, [fetchChartData]);

  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-lg">
      <h2 className="text-xl font-semibold mb-2 text-gray-800">Platform Distribution</h2>

      <div className="mb-4">
        <label htmlFor="quarter" className="mr-2 text-sm text-gray-600">
          Filter by Quarter:
        </label>
        <select
          id="quarter"
          value={selectedQuarter}
          onChange={(e) => setSelectedQuarter(e.target.value)}
          className="border border-gray-300 rounded p-1 text-sm"
        >
          <option value="All">All</option>
          <option value="Q1">Q1</option>
          <option value="Q2">Q2</option>
          <option value="Q3">Q3</option>
          <option value="Q4">Q4</option>
        </select>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            innerRadius={60}
            label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
              const radius = innerRadius + (outerRadius - innerRadius) / 2;
              const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
              const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));

              return (
                <text
                  x={x}
                  y={y}
                  fill="#fff"
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="10"
                  className="font-medium"
                >
                  {`${(percent * 100).toFixed(0)}%`}
                </text>
              );
            }}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `${value.toFixed(0)}%`} />
        </PieChart>
      </ResponsiveContainer>

      <div className="flex flex-wrap justify-center mt-4">
        {chartData.map((entry, index) => (
          <div key={`legend-${index}`} className="flex items-center mx-2">
            <span
              style={{
                display: "inline-block",
                width: "12px",
                height: "12px",
                backgroundColor: COLORS[index % COLORS.length],
                borderRadius: "50%",
              }}
            ></span>
            <span className="ml-2 text-sm text-gray-600">{entry.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlatformCategory;
