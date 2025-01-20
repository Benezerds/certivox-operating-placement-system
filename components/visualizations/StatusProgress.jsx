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
import ChartDataLabels from "chartjs-plugin-datalabels"; // Import plugin ChartDataLabels
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/app/firebase";

// Register required Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels // Register ChartDataLabels plugin
);

const StatusProgress = () => {
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

  // Aggregate project counts for each progress stage
  const stageCounts = progressStages.map((stage) => {
    return projectData.filter((project) => project.projectStatus === stage).length;
  });

  // Prepare dataset for Chart.js
  const chartData = {
    labels: progressStages, // Progress stages as Y-axis labels
    datasets: [
      {
        label: "Number of Projects",
        data: stageCounts, // Count of projects in each progress stage
        backgroundColor: "#D1D5DB", // Light gray bar color
        borderRadius: 10, // Rounded corners for the bars
        barThickness: 16, // Thickness of each bar
      },
    ],
  };

  // Configure chart options
  const options = {
    indexAxis: "y", // Horizontal bar chart
    responsive: true,
    maintainAspectRatio: false, // Allow the chart to fit its container
    scales: {
      x: {
        display: false, // Hide the X-axis
      },
      y: {
        ticks: {
          font: {
            family: "'Inter', sans-serif",
            size: 14,
          },
          color: "#6B7280", // Gray color for Y-axis labels
        },
        grid: {
          display: false, // Hide horizontal grid lines
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
            return `Projects: ${context.raw}`; // Display project count in tooltip
          },
        },
        backgroundColor: "#1F2937", // Dark gray tooltip background
        titleFont: { family: "'Inter', sans-serif", size: 14 },
        bodyFont: { family: "'Inter', sans-serif", size: 12 },
        cornerRadius: 6,
      },
      datalabels: {
        anchor: "center", // Center the label inside the bar
        align: "center", // Align the label horizontally in the center
        formatter: (value) => value, // Display the value (project count)
        font: {
          family: "'Inter', sans-serif",
          size: 14,
          weight: "bold",
        },
        color: "#374151", // Dark gray text color for contrast
        padding: {
          right: -5, // Shift the numbers slightly to the right
        },
        clamp: true, // Prevent labels from being cut off
      },
    },
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Project Progress by Status
      </h2>

      <div
        className="p-4"
        style={{
          height: `${progressStages.length * 50}px`, // Adjust height based on number of stages
        }}
      >
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

export default StatusProgress;
