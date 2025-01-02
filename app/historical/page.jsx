"use client";

import Chart from "../../components/historical/Chart";
import Card from "../../components/historical/Card";
import React, { useState, useEffect } from "react";

export default function Home() {
  // State for chart and card data

  //card data
  const [cardData, setCardData] = useState([
    { title: "$125 - $251", subtitle: "12-Month Trade Range" },
    { title: "$300 - $500", subtitle: "6-Month Trade Range" },
    { title: "$100 - $200", subtitle: "3-Month Trade Range" },
  ]);

  //chart data
  const fullData = [
    { date: "2024-01-01", value: 100 },
    { date: "2024-01-08", value: 150 },
    { date: "2024-01-15", value: 200 },
    { date: "2024-01-22", value: 180 },
    { date: "2024-01-29", value: 80 },
    { date: "2024-12-01", value: 120 },
    { date: "2024-07-01", value: 130 },
    { date: "2024-02-01", value: 110 },
    { date: "2024-12-03", value: 150 },
    { date: "2024-11-01", value: 90 },
  ];
  const [chartData, setChartData] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("1Y");

  const filters = ["1M", "3M", "6M", "YTD", "1Y", "All"];

  // Utility function to format the date
  const formatDate = (date) => {
    const options = { month: "short", day: "numeric" }; // E.g., "Oct 17"
    return new Date(date).toLocaleDateString("en-US", options);
  };

   // Sort the full data by date before filtering or formatting
   const sortedData = fullData.sort((a, b) => new Date(a.date) - new Date(b.date));

   

  // Helper function to filter data based on date range
  const filterData = (filter) => {
    const now = new Date();
    const filteredData = fullData.filter(({ date }) => {
      const dataDate = new Date(date);

      switch (filter) {
        case "1M":
          const oneMonthAgo = new Date();
          oneMonthAgo.setMonth(now.getMonth() - 1);
          return dataDate >= oneMonthAgo && dataDate <= now;
        case "3M":
          const threeMonthsAgo = new Date();
          threeMonthsAgo.setMonth(now.getMonth() - 3);
          return dataDate >= threeMonthsAgo && dataDate <= now;
        case "6M":
          const sixMonthsAgo = new Date();
          sixMonthsAgo.setMonth(now.getMonth() - 6);
          return dataDate >= sixMonthsAgo && dataDate <= now;
        case "YTD":
          const startOfYear = new Date(now.getFullYear(), 0, 1); // January 1st
          return dataDate >= startOfYear && dataDate <= now;
        case "1Y":
          const oneYearAgo = new Date();
          oneYearAgo.setFullYear(now.getFullYear() - 1);
          return dataDate >= oneYearAgo && dataDate <= now;
        case "All":
        default:
          return true;
      }
    });

    // Format dates for the chart
    return filteredData.map((item) => ({
      ...item,
      date: formatDate(item.date), // Apply date formatting
    }));
  };

  // Update chart data whenever the filter changes
  useEffect(() => {
    const filteredData = filterData(selectedFilter);
    setChartData(filteredData);
  }, [selectedFilter]);

  const handleFilterChange = (filter) => {
    setSelectedFilter(filter);
  };



  return (
    <main className="flex flex-col justify-center items-center min-h-screen bg-black text-white">
        {/* Header Section */}
      <header className="w-full max-w-5xl mb-8 text-center">
        <h1 className="text-lg sm:text-2xl text-gray-300">
          Historical performance with manual forecast
        </h1>
        <h2 className="text-4xl font-bold mt-2">Name of Project</h2>
      </header>

        {/* Chart Card Container */}
      <div className="w-[500px] bg-[#161616] p-6 rounded-lg shadow-lg border border-gray-800 mb-8">
        <div className="flex flex-col mb-4">
          <span className="text-sm text-gray-400">Total views</span>
          <h1 className="text-5xl font-bold mb-2">200k</h1>
          <span className="text-gray-500">1 year</span>
        </div>

        {/* Chart Component */}
        <Chart data={chartData} />

        {/* Filter Buttons */}
        <div className="flex justify-between items-center mt-4">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => handleFilterChange(filter)}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                selectedFilter === filter
                  ? "bg-gray-700 text-white"
                  : "bg-gray-800 text-gray-400"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
        {cardData.map((data, index) => (
          <Card key={index} title={data.title} subtitle={data.subtitle} />
        ))}
      </div>
    </main>
  );
}
