"use client";

import Chart from "../../components/historical/Chart";
import Card from "../../components/historical/Card";
import MultiSelectTreeDropdown from "../../components/historical/Multitreedropdown";
import React, { useState, useEffect } from "react";

export default function Home() {
  const [cardData, setCardData] = useState([]);
  const [fullData, setFullData] = useState([]); // Fetched data will be stored here
  const [chartData, setChartData] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("off");
  const [selectedDivision, setSelectedDivision] = useState("All Divisions");
  const [selectedQuarter, setSelectedQuarter] = useState("Off");
  const [selectedYear, setSelectedYear] = useState("Off");
  const [isTimeFilterActive, setIsTimeFilterActive] = useState(true);
  const [years, setYears] = useState([]);
  const [selectedSource, setSelectedSource] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedBrandCategory, setSelectedBrandCategory] = useState([]);
  const [selectedPlatform, setSelectedPlatform] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState([]);
  const [totalViews, setTotalViews] = useState(0);

  const filters = ["1M", "3M", "6M", "YTD", "1Y", "All"];
  const divisions = ["All Divisions", "Community", "Marketing"];
  const quarters = ["Off", "Q1", "Q2", "Q3", "Q4"];

  // Fetch data from the backend
  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/projects");
      if (!response.ok) throw new Error("Failed to fetch data.");
      const data = await response.json();
      setFullData(data); // Save fetched data in fullData
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Extract unique years for filtering
  useEffect(() => {
    const uniqueYears = Array.from(
      new Set(
        fullData
          .map((data) => {
            const year = new Date(data.date).getFullYear();
            return !isNaN(year) ? year : null;
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
    let filteredData = [...fullData];

    if (selectedQuarter === "Off" && selectedYear === "Off") {
      filteredData = fullData.filter(({ date, division: dataDivision }) => {
        const dataDate = new Date(date);

        // Filter by division
        if (selectedDivision !== "All Divisions" && dataDivision !== selectedDivision)
          return false;

        // Time range filters
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

    // Apply additional filters (source, status, etc.)
    if (selectedSource !== "All") {
      filteredData = filteredData.filter(({ source }) => source === selectedSource);
    }
    if (selectedStatus !== "All") {
      filteredData = filteredData.filter(({ projectStatus }) => projectStatus === selectedStatus);
    }
    if (selectedBrandCategory.length > 0) {
      filteredData = filteredData.filter(({ category }) =>
        selectedBrandCategory.includes(category)
      );
    }
    if (selectedBrand.length > 0) {
      filteredData = filteredData.filter(({ brand }) => selectedBrand.includes(brand));
    }
    if (selectedPlatform.length > 0) {
      filteredData = filteredData.filter(({ platform }) =>
        platform.some((p) => selectedPlatform.includes(p))
      );
    }

    // Calculate totals
    const totalViews = filteredData.reduce((sum, item) => sum + (item.views || 0), 0);
    const totalComments = filteredData.reduce((sum, item) => sum + (item.comments || 0), 0);
    const totalLikes = filteredData.reduce((sum, item) => sum + (item.likes || 0), 0);

    // Update card data
    setCardData([
      { title: `${totalViews}`, subtitle: "Total Views" },
      { title: `${totalComments}`, subtitle: "Total Comments" },
      { title: `${totalLikes}`, subtitle: "Total Likes" },
    ]);

    // Group data for the chart
    const groupedData = filteredData.reduce((acc, curr) => {
      const rawDate = new Date(curr.date);
      const formattedDate = `${formatDate(curr.date)} ${rawDate.getFullYear()}`;
    
      if (!acc[formattedDate]) {
        acc[formattedDate] = {
          date: rawDate,
          value: 0,
          brand: new Set(),
          brandCategory: new Set(),
          platform: new Set(),
        };
      }
    
      acc[formattedDate].value += 1;
      acc[formattedDate].brand.add(curr.brand);
      acc[formattedDate].brandCategory.add(curr.category); // Match `category` field
      curr.platform.forEach((p) => acc[formattedDate].platform.add(p));
    
      return acc;
    }, {});

    const chartData = Object.values(groupedData)
      .sort((a, b) => a.date - b.date)
      .map(({ date, value }) => ({
        date: formatDate(date),
        value,
      }));

    setChartData(chartData);
    setTotalViews(filteredData.length);
  };

  useEffect(() => {
    fetchData(); // Fetch data when the component mounts
  }, []);

  useEffect(() => {
    filterData();
  }, [
    selectedFilter,
    selectedDivision,
    selectedQuarter,
    selectedYear,
    selectedSource,
    selectedStatus,
    selectedBrandCategory,
    selectedBrand,
    selectedPlatform,
  ]);

  // Handlers
  const handleFilterChange = (filter) => {
    setSelectedQuarter("Off");
    setSelectedYear("Off");
    setSelectedFilter(filter);
  };

  const handleQuarterChange = (quarter) => {
    setSelectedFilter("Off");
    setSelectedQuarter(quarter);
  };

  const handleYearChange = (year) => {
    setSelectedFilter("Off");
    setSelectedYear(year);
  };

  const getActiveFilterText = () => {
    if (selectedQuarter !== "Off" && selectedYear !== "Off") {
      return `${selectedQuarter} ${selectedYear}`;
    }
    return selectedFilter;
  };

  return (
    <main className="flex flex-col justify-center items-center min-h-screen bg-white text-black">
      {/* Header */}
      <header className="w-full max-w-5xl mb-8 text-center">
        <h1 className="text-lg sm:text-2xl text-gray-700">Historical Performance</h1>
      </header>

      {/* Multi-Select Tree Dropdown */}
      <MultiSelectTreeDropdown
        onSourceChange={setSelectedSource}
        onStatusChange={setSelectedStatus}
        onBrandCategoryChange={setSelectedBrandCategory}
        onBrandChange={setSelectedBrand}
        onDivisionChange={setSelectedDivision}
        onPlatformChange={setSelectedPlatform}
        onExecute={filterData}
        onReset={() => {
          setSelectedSource("All");
          setSelectedStatus("All");
          setSelectedBrandCategory([]);
          setSelectedBrand([]);
          setSelectedDivision("All Divisions");
          filterData();
        }}
      />

      {/* Chart Card Container */}
      <div className="w-full max-w-[90%] bg-gray-100 p-6 rounded-lg shadow-lg border border-gray-300 mb-8">
        <div className="flex flex-col mb-4">
          <span className="text-sm text-gray-500">Total Projects</span>
          <h1 className="text-5xl font-bold mb-2 text-black">{totalViews}</h1>
          <span className="text-gray-500">
      {chartData.length > 0 ? getActiveFilterText() : "Please select a time filter to display data"}
    </span>
  </div>

  {/* visualize zhart or placeholder */}
  {chartData.length > 0 ? (
    <Chart data={chartData} />
  ) : (
    <div className="flex justify-center items-center h-64">
      <p className="text-gray-500 text-lg">No data available. Please select a time filter or the correct filter.</p>
    </div>
  )}
</div>

      {/* Time Filter and Dropdowns */}
      <div className="flex items-center justify-start space-x-4 mb-6 w-full max-w-[90%]">
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

         {/* Group Year and Quarter Dropdowns */}
  <div className="flex space-x-4">
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
    </div>
    </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
        {cardData.map((data, index) => (
          <Card key={index} title={data.title} subtitle={data.subtitle} />
        ))}
      </div>
    </main>
  );
}
