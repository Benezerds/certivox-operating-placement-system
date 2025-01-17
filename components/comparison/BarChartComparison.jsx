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

const BarChartComparison = ({ project1 = {}, project2 = {} }) => {
  // Provide default values in case project1 or project2 is undefined or incomplete
  const defaultProject = {
    projectName: "N/A",
    likes: 0,
    comments: 0,
    views: 0,
  };

  const data = [
    {
      projectName: project1.projectName || defaultProject.projectName,
      likes: project1.likes || defaultProject.likes,
      comments: project1.comments || defaultProject.comments,
      views: project1.views || defaultProject.views,
    },
    {
      projectName: project2.projectName || defaultProject.projectName,
      likes: project2.likes || defaultProject.likes,
      comments: project2.comments || defaultProject.comments,
      views: project2.views || defaultProject.views,
    },
  ];

  // Check if all data points are 0 or projects are undefined
  const hasData =
    data.some((d) => d.likes > 0 || d.comments > 0 || d.views > 0) &&
    data.some((d) => d.projectName !== "N/A");

  return (
    <div style={{ width: "100%", height: "400px", margin: "0 auto" }}>
      {hasData ? (
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
              fill="#f39c12"
              barSize={30}
              radius={[5, 5, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div
          style={{
            textAlign: "center",
            padding: "20px",
            fontSize: "16px",
            color: "#888",
          }}
        >
          No data available to display.
        </div>
      )}
    </div>
  );
};

export default BarChartComparison;
