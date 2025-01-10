"use client";

import { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/app/firebase";

// Register required Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function ProjectStatusChart() {
  const [projectData, setProjectData] = useState([]);

  // Fetch projects from Firebase
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "Projects"), (snapshot) => {
      const projects = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
        date: doc.data().date ? new Date(doc.data().date) : null,
      }));
      setProjectData(projects);
    });

    return () => unsubscribe(); // Cleanup subscription on unmount
  }, []);

  // Define the six progress stages
  const progressStages = [
    "Development",
    "Content Proposal",
    "Ongoing",
    "Editing",
    "Delivered",
    "Published",
  ];

  // Prepare data for the chart
  const labels = projectData.map((project) => project.projectName || "Unnamed"); // Y-axis: project names
  const data = projectData.map((project) =>
    progressStages.indexOf(project.projectStatus) + 1
  );

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: "Project Status",
        data: data,
        backgroundColor: "#F3F4F6", // Subtle light gray color
        borderRadius: 8,
        barThickness: 16,
      },
    ],
  };

  const options = {
    indexAxis: "y", // Horizontal bar chart
    responsive: true,
    maintainAspectRatio: false, // Allow the chart to fit the card
    scales: {
      x: {
        type: "category",
        labels: progressStages, // Use the progress stages directly on the x-axis
        grid: {
          color: "#E5E7EB", // Subtle light gray grid lines
        },
        ticks: {
          font: {
            family: "'Inter', sans-serif",
            size: 12,
          },
          color: "#6B7280", // Neutral gray color for axis labels
        },
      },
      y: {
        ticks: {
          font: {
            family: "'Inter', sans-serif",
            size: 14,
          },
          color: "#374151", // Darker gray for project names
        },
        grid: {
          display: false, // No horizontal grid lines
        },
      },
    },
    plugins: {
      legend: {
        display: false, // Hide legend
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `Status: ${progressStages[context.raw - 1] || "Unknown"}`;
          },
        },
        backgroundColor: "#1F2937", // Dark gray tooltip background
        titleFont: { family: "'Inter', sans-serif", size: 14 },
        bodyFont: { family: "'Inter', sans-serif", size: 12 },
        cornerRadius: 6,
      },
    },
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Project Status Overview
      </h2>
      <div
        className="p-4"
        style={{
          height: "350px",
        }}
      >
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
}

