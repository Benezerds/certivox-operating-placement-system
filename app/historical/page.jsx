"use client";

import Chart from "../../components/historical/Chart";
import Card from "../../components/historical/Card";
import MultiSelectTreeDropdown from "../../components/historical/Multitreedropdown";
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
    { date: "2024-01-15", division: "Community", source: "Inbound", status: "Development", brandCategory: "E-sport", brand: "VARdrid", platform: "YouTube" },
    { date: "2024-01-08", division: "Community", source: "Outbound", status: "Ongoing", brandCategory: "Fashion", brand: "Uniqlo", platform: "YouTube" },
    { date: "2025-01-03", division: "Marketing", source: "Inbound", status: "Delivered", brandCategory: "Fashion", brand: "Uniqlo", platform: "YouTube" },
    { date: "2024-01-22", division: "Marketing", source: "Outbound", status: "Editing", brandCategory: "Sport", brand: "Manchester City", platform: "TikTok" },
    { date: "2023-12-15", division: "Marketing", source: "Outbound", status: "Content Proposal", brandCategory: "Sport", brand: "Manchester City", platform: "YouTube" },
    { date: "2024-07-01", division: "Community", source: "Outbound", status: "Ongoing", brandCategory: "Sport", brand: "Manchester City", platform: "TikTok" },
    { date: "2024-12-01", division: "Marketing", source: "Inbound", status: "Ongoing", brandCategory: "Fashion", brand: "Uniqlo", platform: "TikTok" },
    { date: "2024-12-03", division: "Community", source: "Inbound", status: "Published", brandCategory: "Fashion", brand: "Uniqlo", platform: "YouTube" },
    { date: "2025-01-01", division: "Marketing", source: "Outbound", status: "Published", brandCategory: "Sport", brand: "Manchester City", platform: "YouTube" },
    { date: "2023-12-01", division: "Community", source: "Inbound", status: "Published", brandCategory: "Fashion", brand: "Uniqlo", platform: "TikTok" },
    { date: "2025-01-03", division: "Marketing", source: "Inbound", status: "Published", brandCategory: "Fashion", brand: "Uniqlo", platform: "TikTok" },
    { date: "2024-12-15", division: "Community", source: "Inbound", status: "Published", brandCategory: "Judi Online", brand: "VARdrid", platform: "YouTube" },
    { date: "2024-12-15", division: "Marketing", source: "Inbound", status: "Content Proposal", brandCategory: "Sport", brand: "Manchester City", platform: "TikTok" },
    { date: "2024-12-01", division: "Marketing", source: "Inbound", status: "Delivered", brandCategory: "Fashion", brand: "Uniqlo", platform: "YouTube" },
    { date: "2024-01-01", division: "Marketing", source: "Inbound", status: "Development", brandCategory: "E-sport", brand: "VARdrid", platform: "TikTok" },
    { date: "2024-01-08", division: "Marketing", source: "Outbound", status: "Published", brandCategory: "Sport", brand: "Manchester City", platform: "TikTok" },
    { date: "2024-11-01", division: "Community", source: "Inbound", status: "Development", brandCategory: "Fashion", brand: "Uniqlo", platform: "YouTube" },
    { date: "2024-12-15", division: "Marketing", source: "Inbound", status: "Published", brandCategory: "Sport", brand: "Manchester City", platform: "YouTube" },
    { date: "2025-01-01", division: "Marketing", source: "Outbound", status: "Editing", brandCategory: "Sport", brand: "Manchester City", platform: "TikTok" },
    { date: "2023-12-01", division: "Community", source: "Inbound", status: "Development", brandCategory: "Fashion", brand: "Uniqlo", platform: "YouTube" },
    { date: "2024-12-31", division: "Community", source: "Outbound", status: "Development", brandCategory: "Judi Online", brand: "VARdrid", platform: "YouTube" },
    { date: "2024-01-22", division: "Marketing", source: "Inbound", status: "Published", brandCategory: "Fashion", brand: "Uniqlo", platform: "TikTok" },
    { date: "2024-01-15", division: "Community", source: "Inbound", status: "Ongoing", brandCategory: "E-sport", brand: "VARdrid", platform: "TikTok" },
    { date: "2024-12-31", division: "Community", source: "Inbound", status: "Editing", brandCategory: "Judi Online", brand: "VARdrid", platform: "TikTok" },
    { date: "2024-01-01", division: "Community", source: "Inbound", status: "Development", brandCategory: "Fashion", brand: "Uniqlo", platform: "TikTok" },
    { date: "2024-12-15", division: "Marketing", source: "Inbound", status: "Content Proposal", brandCategory: "Sport", brand: "Manchester City", platform: "TikTok" },
    { date: "2024-12-15", division: "Marketing", source: "Inbound", status: "Published", brandCategory: "Sport", brand: "Manchester City", platform: "YouTube" },
    { date: "2024-12-01", division: "Marketing", source: "Inbound", status: "Delivered", brandCategory: "Fashion", brand: "Uniqlo", platform: "YouTube" },
    { date: "2024-07-01", division: "Marketing", source: "Inbound", status: "Published", brandCategory: "Sport", brand: "Manchester City", platform: "YouTube" },
    { date: "2024-12-03", division: "Community", source: "Inbound", status: "Published", brandCategory: "Fashion", brand: "Uniqlo", platform: "YouTube" },
    { date: "2024-11-01", division: "Marketing", source: "Outbound", status: "Content Proposal", brandCategory: "Judi Online", brand: "VARdrid", platform: "TikTok" },
    { date: "2024-01-29", division: "Community", source: "Outbound", status: "Editing", brandCategory: "Judi Online", brand: "VARdrid", platform: "YouTube" },
    { date: "2024-01-01", division: "Community", source: "Inbound", status: "Ongoing", brandCategory: "Fashion", brand: "Uniqlo", platform: "YouTube" },
    { date: "2024-01-15", division: "Community", source: "Inbound", status: "Development", brandCategory: "E-sport", brand: "VARdrid", platform: "YouTube" },
    { date: "2023-12-01", division: "Community", source: "Inbound", status: "Ongoing", brandCategory: "Fashion", brand: "Uniqlo", platform: "YouTube" },
    { date: "2025-01-01", division: "Marketing", source: "Outbound", status: "Ongoing", brandCategory: "Sport", brand: "Manchester City", platform: "TikTok" },
    { date: "2024-01-08", division: "Community", source: "Outbound", status: "Ongoing", brandCategory: "Fashion", brand: "Uniqlo", platform: "TikTok" },
    { date: "2025-01-02", division: "Community", source: "Inbound", status: "Delivered", brandCategory: "E-sport", brand: "VARdrid", platform: "YouTube" },
    { date: "2024-01-22", division: "Marketing", source: "Inbound", status: "Content Proposal", brandCategory: "Fashion", brand: "Uniqlo", platform: "YouTube" },
    { date: "2024-02-01", division: "Marketing", source: "Inbound", status: "Development", brandCategory: "E-sport", brand: "VARdrid", platform: "YouTube" },
    { date: "2024-02-01", division: "Marketing", source: "Outbound", status: "Ongoing", brandCategory: "Fashion", brand: "Uniqlo", platform: "TikTok" },
    { date: "2024-01-29", division: "Community", source: "Outbound", status: "Editing", brandCategory: "Judi Online", brand: "VARdrid", platform: "TikTok" },
    { date: "2024-01-15", division: "Community", source: "Inbound", status: "Ongoing", brandCategory: "E-sport", brand: "VARdrid", platform: "YouTube" },
    { date: "2023-12-01", division: "Community", source: "Inbound", status: "Development", brandCategory: "Fashion", brand: "Uniqlo", platform: "YouTube" },
    { date: "2024-01-22", division: "Marketing", source: "Inbound", status: "Published", brandCategory: "Fashion", brand: "Uniqlo", platform: "TikTok" },
  ];
  
  const [chartData, setChartData] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("1Y");
  const [selectedDivision, setSelectedDivision] = useState("All Divisions");
  const [selectedQuarter, setSelectedQuarter] = useState("Off"); // Default to "Off"
  const [selectedYear, setSelectedYear] = useState("Off"); // Default to "Off"
  const [isTimeFilterActive, setIsTimeFilterActive] = useState(true); // Toggle between filters
  const [years, setYears] = useState([]); // State for dynamic years filter
  const [selectedSource, setSelectedSource] = useState("All"); // Default to "All"
  const [selectedStatus, setSelectedStatus] = useState("All"); // Default to "0"
  const [selectedBrandCategory, setSelectedBrandCategory] = useState([]); // Multiple selections allowed
  const [selectedPlatform, setSelectedPlatform] = useState([]); // Multiple selections allowed
  const [selectedBrand, setSelectedBrand] = useState([]); // Multiple selections allowed
  const [totalViews, setTotalViews] = useState(0);

  const filters = ["1M", "3M", "6M", "YTD", "1Y", "All"];
  const divisions = ["All Divisions", "Community", "Marketing"];
  const quarters = ["Off", "Q1", "Q2", "Q3", "Q4"];

  // Extract unique years from `fullData`
  useEffect(() => {
    const uniqueYears = Array.from(
      new Set(
        fullData
          .map((data) => {
            const year = new Date(data.date).getFullYear();
            return !isNaN(year) ? year : null; // Filter out invalid years
          })
          .filter((year) => year !== null)
      )
    ).sort((a, b) => a - b);
    setYears(["Off", ...uniqueYears]);
  }, [fullData]);

  

  // Utility function to format the date
  const formatDate = (date) => {
    const options = { month: "short", day: "numeric" };
    return new Date(date).toLocaleDateString("en-US", options);
  };

  // Filtering logic
  const filterData = () => {
    const now = new Date();
    let filteredData = [...fullData]; // Start with all data

    if (selectedQuarter === "Off" && selectedYear === "Off") {
      // Time filter is active
      filteredData = fullData.filter(({ date, division: dataDivision }) => {
        const dataDate = new Date(date);

        // Filter by division
        if (selectedDivision !== "All Divisions" && dataDivision !== selectedDivision)
          return false;

        // Time range filters (e.g., 1M, 3M)
        switch (selectedFilter) {
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
            const startOfYear = new Date(now.getFullYear(), 0, 1);
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
    } else {
      // Quarter/year filter is active
      const startMonth = { Q1: 0, Q2: 3, Q3: 6, Q4: 9 }[selectedQuarter];
      const endMonth = startMonth + 3;

      filteredData = fullData.filter(({ date, division: dataDivision }) => {
        const dataDate = new Date(date);

        // Filter by division
        if (selectedDivision !== "All Divisions" && dataDivision !== selectedDivision)
          return false;

        // Filter by year and quarter
        return (
          dataDate.getFullYear() === parseInt(selectedYear) &&
          dataDate.getMonth() >= startMonth &&
          dataDate.getMonth() < endMonth
        );
      });
    }
    // Apply Source filter
    if (selectedSource !== "All") {
      filteredData = filteredData.filter(({ source }) => source === selectedSource);
    }

    // Apply Status filter
    if (selectedStatus !== "All") {
      filteredData = filteredData.filter(({ status }) => status === selectedStatus);
    }    

    // Apply Brand Category filter
    if (selectedBrandCategory.length > 0) {
      filteredData = filteredData.filter(({ brandCategory }) =>
        selectedBrandCategory.some(
          (category) => category.toLowerCase() === brandCategory.toLowerCase()
        )
      );
    }

    // Apply Brand filter
    if (selectedBrand.length > 0) {
      filteredData = filteredData.filter(({ brand }) => selectedBrand.includes(brand));
    }
    
    // Apply Platform filter
    if (selectedPlatform.length > 0) {
      filteredData = filteredData.filter(({ platform }) =>
        selectedPlatform.includes(platform)
      );
    }


  // Group data by date and count items
  const groupedData = filteredData.reduce((acc, curr) => {
    const rawDate = new Date(curr.date); // Raw date for sorting
    const formattedDate = `${formatDate(curr.date)} ${rawDate.getFullYear()}`; // Include year in key
    acc[formattedDate] = acc[formattedDate] || { date: rawDate, count: 0 };
    acc[formattedDate].count += 1; // Increment count
    return acc;
  }, {});

  // Convert groupedData to sorted array and format for chart
  const chartData = Object.values(groupedData)
    .sort((a, b) => a.date - b.date) // Sort by raw date
    .map(({ date, count }) => ({
      date: formatDate(date), // Format dates after sorting
      value: count, // Count of items
    }));

  // Update state with chartData
  setChartData(chartData);

  // Calculate and set total views
  setTotalViews(filteredData.length);
};

  useEffect(() => {
    filterData();
  }, [selectedFilter,
    selectedDivision,
    selectedQuarter,
    selectedYear,
    selectedSource,
    selectedStatus,
    selectedBrandCategory,
    selectedBrand,
    selectedPlatform,]);

  // Handlers
  const handleFilterChange = (filter) => {
    setSelectedQuarter("Off"); // Turn off quarter filter
    setSelectedYear("Off"); // Turn off year filter
    setSelectedFilter(filter); // Activate time filter
  };

  const handleQuarterChange = (quarter) => {
    setSelectedFilter("Off"); // Turn off time filter
    setSelectedQuarter(quarter); // Activate quarter filter
  };

  const handleYearChange = (year) => {
    setSelectedFilter("Off"); // Turn off time filter
    setSelectedYear(year); // Activate year filter
  };

  const handleDivisionChange = (e) => setSelectedDivision(e.target.value);

  

  // Function to compute active filter text
const getActiveFilterText = () => {
  if (selectedQuarter !== "Off" && selectedYear !== "Off") {
    return `${selectedQuarter} ${selectedYear}`; // Show Quarter and Year if active
  }
  return selectedFilter; // Otherwise, show Time Filter
};
  
  return (
    <main className="flex flex-col justify-center items-center min-h-screen bg-white text-black">
  {/* Header Section */}
  <header className="w-full max-w-5xl mb-8 text-center">
    <h1 className="text-lg sm:text-2xl text-gray-700">
      Historical performance with manual forecast
    </h1>
  </header>

   {/* Multi-Select Tree Dropdown */}
   <MultiSelectTreeDropdown
  onSourceChange={setSelectedSource}
  onStatusChange={setSelectedStatus}
  onBrandCategoryChange={setSelectedBrandCategory}
  onBrandChange={setSelectedBrand}
  onDivisionChange={setSelectedDivision}
  onPlatformChange={setSelectedPlatform}
  onExecute={() => filterData()} // Executes the filter
  onReset={() => {
    setSelectedSource("All");
    setSelectedStatus("All");
    setSelectedBrandCategory([]);
    setSelectedBrand([]);
    setSelectedDivision("All Divisions");
    filterData(); // Re-run to reset the data
  }}
/> 

  {/* Chart Card Container */}
  <div className="w-full max-w-[90%] bg-gray-100 p-6 rounded-lg shadow-lg border border-gray-300 mb-8">
        <div className="flex flex-col mb-4">
          <span className="text-sm text-gray-500">Total Projects</span>
          <h1 className="text-5xl font-bold mb-2 text-black">{totalViews}</h1>
          <span className="text-gray-500">{getActiveFilterText()}</span>
        </div>
        <Chart data={chartData} />
      </div>

{/* Time Filter and Quarter/Year Dropdown */}
<div className="flex items-center justify-start space-x-4 mb-6 w-full max-w-[90%]">
        {/* Time Filter Buttons */}
        <div className="inline-flex p-1 bg-gray-800 rounded-full shadow-md">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => handleFilterChange(filter)}
              className={`px-4 py-2 rounded-full font-medium transition ${
                selectedFilter === filter &&
                selectedQuarter === "Off" &&
                selectedYear === "Off"
                  ? "bg-white text-black"
                  : "bg-transparent text-white hover:bg-gray-700"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Quarter Dropdown */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Quarter</label>
          <select
            value={selectedQuarter}
            onChange={(e) => handleQuarterChange(e.target.value)}
            className="bg-gray-100 text-black p-2 rounded-lg border border-gray-300"
          >
            {quarters.map((quarter) => (
              <option key={quarter} value={quarter}>
                {quarter}
              </option>
            ))}
          </select>
        </div>

        {/* Year Dropdown */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Year</label>
          <select
            value={selectedYear}
            onChange={(e) => handleYearChange(e.target.value)}
            className="bg-gray-100 text-black p-2 rounded-lg border border-gray-300"
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
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
