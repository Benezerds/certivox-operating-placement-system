"use client";

import React, { useState, useEffect } from "react";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend } from "recharts";

const RadarChartComparison = ({ category1, category2 }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch Projects Data
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("/api/projects");
        if (!response.ok) {
          throw new Error("Failed to fetch projects");
        }
        const data = await response.json();
        setProjects(data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Function to aggregate metrics for a selected category
  const aggregateMetricsForCategory = (category) => {
    let aggregatedData = { likes: 0, comments: 0, views: 0 };

    projects.forEach((project) => {
      const categoryParts = project.category.split("/");
      const projectCategoryId = categoryParts[categoryParts.length - 1];

      if (projectCategoryId === category.id) {
        if (typeof project.likes === "number") {
          aggregatedData.likes += project.likes;
        }
        if (typeof project.comments === "number") {
          aggregatedData.comments += project.comments;
        }
        if (typeof project.views === "number") {
          aggregatedData.views += project.views;
        }
      }
    });

    return aggregatedData;
  };

  if (loading) return <p>Loading...</p>;

  // Aggregate data for both selected categories
  const aggregatedDataCategory1 = aggregateMetricsForCategory(category1);
  const aggregatedDataCategory2 = aggregateMetricsForCategory(category2);

  // Reduce views scale by dividing by 1,000
  const scaleViews = (value) => value / 1000;

  // Prepare the data for the radar chart
  const data = [
    {
      metric: "Likes",
      category1: aggregatedDataCategory1.likes,
      category2: aggregatedDataCategory2.likes,
      fullMark: 100,
    },
    {
      metric: "Comments",
      category1: aggregatedDataCategory1.comments,
      category2: aggregatedDataCategory2.comments,
      fullMark: 100,
    },
    {
      metric: "Views (per 1k)",
      category1: scaleViews(aggregatedDataCategory1.views),
      category2: scaleViews(aggregatedDataCategory2.views),
      fullMark: 100,
    },
  ];

  return (
    <div className="flex justify-center">
      <RadarChart outerRadius={100} width={400} height={300} data={data}>
        <PolarGrid />
        <PolarAngleAxis dataKey="metric" />
        <PolarRadiusAxis />
        <Radar name={category1.category_name} dataKey="category1" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
        <Radar name={category2.category_name} dataKey="category2" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
        <Legend />
      </RadarChart>
    </div>
  );
};

export default RadarChartComparison;
