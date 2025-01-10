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

  // Map project statuses to numerical values for chart
  const statusMap = {
    Development: 1,
    "Content Proposal": 2,
    Ongoing: 3,
    Editing: 4,
    Delivered: 5,
    Published: 6,
  };

  // Prepare data for the chart
  const labels = projectData.map((project) => project.projectName || "Unnamed"); // Y-axis: project names
  const data = projectData.map(
    (project) => statusMap[project.projectStatus] || 0 // X-axis: project statuses
  );

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: "Project Status",
        data: data,
        backgroundColor: "#E5E7EB", // Neutral bar color
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
        beginAtZero: true,
        grid: {
          color: "#F3F4F6", // Subtle grid color
        },
        ticks: {
          font: {
            family: "'Inter', sans-serif",
            size: 12,
          },
          color: "#6B7280",
          callback: function (value) {
            const reverseMap = Object.entries(statusMap).reduce(
              (acc, [key, val]) => ({ ...acc, [val]: key }),
              {}
            );
            return reverseMap[value] || value; // Map numbers back to status names
          },
        },
      },
      y: {
        ticks: {
          font: {
            family: "'Inter', sans-serif",
            size: 14,
          },
          color: "#374151",
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
            const reverseMap = Object.entries(statusMap).reduce(
              (acc, [key, val]) => ({ ...acc, [val]: key }),
              {}
            );
            return `Status: ${reverseMap[context.raw] || "Unknown"}`;
          },
        },
        backgroundColor: "#111827",
        titleFont: { family: "'Inter', sans-serif", size: 14 },
        bodyFont: { family: "'Inter', sans-serif", size: 12 },
        cornerRadius: 10,
      },
    },
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-4xl mx-auto">
      <h2 className="text-lg font-bold text-gray-800 mb-4">
        Project Status Overview
      </h2>
      <div
        className="border border-gray-200 rounded-md bg-white shadow-sm p-6"
        style={{ height: "350px" }}
      >
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
}
