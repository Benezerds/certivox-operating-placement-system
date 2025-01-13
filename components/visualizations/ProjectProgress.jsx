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

const ProjectProgress = () => {
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

  // Prepare labels (project names) for the chart
  const labels = projectData.map((project) => project.projectName || "Unnamed");

  // Map data for each project
  const data = projectData.map((project) => {
    const statusIndex = progressStages.indexOf(project.projectStatus);
    return {
      projectName: project.projectName,
      statusLength: statusIndex !== -1 ? statusIndex + 1 : 0, // Bar length based on progress stage position
    };
  });

  // Calculate the maximum value for the X-axis scale
  const maxStage = Math.max(
    ...data.map((item) => item.statusLength),
    progressStages.length // Default to full length if all data is shown
  );

  // Prepare dataset for Chart.js
  const chartData = {
    labels: labels, // Project names as Y-Axis labels
    datasets: [
      {
        label: "Project Progress",
        data: data.map((item) => item.statusLength), // Progress stage lengths
        backgroundColor: "#3B82F6", // Bar color
        borderRadius: 8,
        barThickness: 16,
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
        type: "linear", // Use a linear scale to represent progress stage lengths
        min: 0, // Start from 0
        max: maxStage, // Maximum value based on data
        grid: {
          color: "#E5E7EB", // Subtle light gray grid lines
        },
        ticks: {
          stepSize: 1, // Increment by 1 per progress stage
          callback: function (value) {
            return progressStages[value - 1] || ""; // Label according to progress stage
          },
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
            const progressIndex = context.raw;
            return `Status: ${
              progressIndex !== null
                ? progressStages[progressIndex - 1] // Use progressStages
                : "Unknown"
            }`;
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
        Project Progress
      </h2>

      <div
        className="p-4"
        style={{
          height: `${projectData.length * 50}px`, // Height adjusted to match the amount of data
        }}
      >
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

export default ProjectProgress;
