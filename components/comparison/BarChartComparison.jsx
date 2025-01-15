import React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const BarChartComparison = ({ project1, project2 }) => {
  const data = [
    {
      projectName: "Project A",
      likes: 4000,
      comments: 2400,
      views: 2400,
    },
    {
      projectName: "Project B",
      likes: 3000,
      comments: 1398,
      views: 2210,
    },
  ];

  return (
    <div style={{ width: "100%", height: "400px", margin: "0 auto" }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="projectName"
            tick={{ fontSize: 14, fill: "#555" }}
            axisLine={{ stroke: "#ccc" }}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 14, fill: "#555" }}
            axisLine={{ stroke: "#ccc" }}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              borderRadius: "8px",
              border: "1px solid #ddd",
              fontSize: 14,
            }}
            itemStyle={{ color: "#555" }}
          />
          <Legend
            wrapperStyle={{
              fontSize: 14,
              top: -10,
              left: 10,
              color: "#555",
            }}
          />
          <Bar
            dataKey="views"
            fill="#4c8bf5"
            barSize={30}
            radius={[5, 5, 0, 0]}
          />
          <Bar
            dataKey="likes"
            fill="#34c38f"
            barSize={30}
            radius={[5, 5, 0, 0]}
          />
          <Bar
            dataKey="comments"
            fill="#34c38f"
            barSize={30}
            radius={[5, 5, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChartComparison;
