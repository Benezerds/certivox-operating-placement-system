"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Cell,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import { collection, onSnapshot, doc, getDoc } from "firebase/firestore";
import { db } from "@/app/firebase";
import {
  startOfYear,
  startOfMonth,
  startOfWeek,
  subYears,
  subMonths,
  subWeeks,
  isWithinInterval,
} from "date-fns";

// Helper to calculate date ranges based on selected filter
const getDateRanges = (filter) => {
  const today = new Date();
  const ranges = {
    year: {
      currentStart: startOfYear(today),
      previousStart: startOfYear(subYears(today, 1)),
      previousEnd: subYears(today, 1),
    },
    monthly: {
      currentStart: startOfMonth(today),
      previousStart: startOfMonth(subMonths(today, 1)),
      previousEnd: subMonths(today, 1),
    },
    weekly: {
      currentStart: startOfWeek(today, { weekStartsOn: 1 }),
      previousStart: startOfWeek(subWeeks(today, 1), { weekStartsOn: 1 }),
      previousEnd: subWeeks(today, 1),
    },
  };
  return ranges[filter];
};

// Helper to fetch and cache category names
const fetchCategoryName = async (categoryId, categoryCache) => {
  if (!categoryId) return "Unknown";
  if (categoryCache[categoryId]) return categoryCache[categoryId];

  try {
    const categoryDoc = await getDoc(doc(db, "Categories", categoryId));
    if (categoryDoc.exists()) {
      const categoryName = categoryDoc.data()?.category_name || "Unknown";
      categoryCache[categoryId] = categoryName; // Cache the result
      return categoryName;
    }
    console.warn(`Category not found for ID: ${categoryId}`);
    return "Unknown";
  } catch (error) {
    console.error("Error fetching category:", error);
    return "Unknown";
  }
};

const BrandCategory = () => {
  const [selectedFilter, setSelectedFilter] = useState("year");
  const [totalProjects, setTotalProjects] = useState(0);
  const [percentageChange, setPercentageChange] = useState(0);
  const [chartData, setChartData] = useState([]);

  const dateRanges = useMemo(() => getDateRanges(selectedFilter), [selectedFilter]);

  const processProjectData = useCallback(
    async (snapshot) => {
      if (snapshot.empty) {
        setTotalProjects(0);
        setPercentageChange(0);
        setChartData([]);
        return;
      }

      const projects = [];
      const categoryCache = {};

      for (const docSnapshot of snapshot.docs) {
        const project = docSnapshot.data();
        if (!project.date) continue;

        const categoryName = await fetchCategoryName(
          project.category?.id,
          categoryCache
        );
        const projectDate = project.date.toDate?.() || new Date(project.date);
        projects.push({ category: categoryName, date: projectDate });
      }

      const { currentStart, previousStart, previousEnd } = dateRanges;

      const currentProjects = projects.filter((project) =>
        isWithinInterval(project.date, { start: currentStart, end: new Date() })
      );
      const previousProjects = projects.filter((project) =>
        isWithinInterval(project.date, { start: previousStart, end: previousEnd })
      );

      const currentTotal = currentProjects.length;
      const previousTotal = previousProjects.length;
      const percentageChangeValue =
        previousTotal > 0 ? ((currentTotal - previousTotal) / previousTotal) * 100 : 0;

      setTotalProjects(currentTotal);
      setPercentageChange(percentageChangeValue);

      const categoryCounts = currentProjects.reduce((acc, project) => {
        acc[project.category] = (acc[project.category] || 0) + 1;
        return acc;
      }, {});

      const topCategories = Object.entries(categoryCounts)
        .map(([name, value]) => ({ name, value: value || 0 })) // Ensure fallback to 0
        .sort((a, b) => b.value - a.value)
        .slice(0, 5);

      setChartData(topCategories);
    },
    [dateRanges]
  );

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "Projects"), processProjectData);
    return () => unsubscribe();
  }, [processProjectData]);

  return (
    <div className="h-full max-w-lg p-6 bg-white rounded-lg shadow-md">
      <h2 className="mb-2 text-xl font-semibold">Projects by Brand Category</h2>

      <div className="flex items-center mb-2">
        <span className="mr-2 text-4xl font-bold">{totalProjects}</span>
        <span
          className={`text-lg font-medium ${
            percentageChange >= 0 ? "text-green-500" : "text-red-500"
          }`}
        >
          {percentageChange >= 0
            ? `+${percentageChange.toFixed(2)}%`
            : `${percentageChange.toFixed(2)}%`}
        </span>
      </div>

      <div className="mb-4 text-gray-500">
        {selectedFilter === "year"
          ? "Year to Date"
          : selectedFilter === "monthly"
          ? "Monthly"
          : "Weekly"}
      </div>

      <div className="flex mb-4 space-x-2">
        {["year", "monthly", "weekly"].map((filter) => (
          <button
            key={filter}
            onClick={() => setSelectedFilter(filter)}
            className={`px-4 py-2 rounded ${
              selectedFilter === filter
                ? "bg-black text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {filter === "year" ? "Year to Date" : filter.charAt(0).toUpperCase() + filter.slice(1)}
          </button>
        ))}
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={chartData} layout="vertical" barCategoryGap="10%">
          <XAxis type="number" hide />
          <YAxis
            dataKey="name"
            type="category"
            width={100} // Adjust width for longer names
            tick={{ fill: "#888" }}
            tickLine={false}
          />
          <Bar dataKey="value" fill="#E5E7EB" radius={[0, 10, 10, 0]}>
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={index % 2 === 0 ? "#D1D5DB" : "#E5E7EB"}
              />
            ))}
            <LabelList
              dataKey="value"
              position="insideRight" // Display counts inside the bars
              offset={10}
              fill="#333"
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BrandCategory;
