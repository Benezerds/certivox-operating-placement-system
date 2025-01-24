import React, { useState, useEffect } from "react";
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
import { collection, getDoc, onSnapshot } from "firebase/firestore"; // Import Firestore functions
import { db } from "@/app/firebase";

const BarChartComparison = ({ category1, category2 }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch Projects Data from API
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "Projects"), async (querySnapshot) => {
      const updatedProjects = [];

      for (let docSnap of querySnapshot.docs) {
        const project = docSnap.data();
        let categoryName = "N/A"; // Default value

        // Check if category is a reference and resolve it
        if (project.category) {
          try {
            const categoryRef = doc(db, "Categories", project.category.id);
            const categoryDoc = await getDoc(categoryRef);
            if (categoryDoc.exists()) {
              categoryName = categoryDoc.data().category_name || "N/A";
            } else {
              categoryName = "Category not found";
            }
          } catch (error) {
            console.error("Error fetching category:", error);
            categoryName = "Category not found";
          }
        }

        updatedProjects.push({ ...project, category_name: categoryName });
      }

      setProjects(updatedProjects);
      setLoading(false);
    });

    // Cleanup function to unsubscribe from snapshot listener when component unmounts
    return () => unsubscribe();
  }, []);
  

  // Function to aggregate metrics for selected category
const aggregateMetricsForCategory = (category) => {
  let aggregatedData = { likes: 0, comments: 0, views: 0 };

  // Loop through each project and accumulate values for matching category
  projects.forEach((project) => {
    console.log(project.category_name);
    if (project.category_name === category.category_name) {
      aggregatedData.likes += project.likes;
      aggregatedData.comments += project.comments;
      aggregatedData.views += project.views;
    }
  });

  return aggregatedData;
};

  // Aggregate data for both selected categories
  const aggregatedDataCategory1 = aggregateMetricsForCategory(category1);
  const aggregatedDataCategory2 = aggregateMetricsForCategory(category2);

  // Prepare the data for the chart
  const data = [
    {
      category: category1.category_name || "Category 1", // Use category_name from the selected category object
      likes: aggregatedDataCategory1.likes,
      comments: aggregatedDataCategory1.comments,
      views: aggregatedDataCategory1.views,
    },
    {
      category: category2.category_name || "Category 2", // Use category_name from the selected category object
      likes: aggregatedDataCategory2.likes,
      comments: aggregatedDataCategory2.comments,
      views: aggregatedDataCategory2.views,
    },
  ];

  console.log("Chart data:", data);

  // Check if there's any data to display
  const hasData =
    data.some((d) => d.likes > 0 || d.comments > 0 || d.views > 0) &&
    data.some((d) => d.category !== "N/A");
    console.log("Has data to display:", hasData);

  return (
    <div style={{ width: "100%", height: "400px", margin: "0 auto" }}>
      {loading ? (
        <div
          style={{
            textAlign: "center",
            padding: "20px",
            fontSize: "16px",
            color: "#888",
          }}
        >
          Loading projects data...
        </div>
      ) : hasData ? (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="category"
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
