import React, { useState, useEffect } from "react";

const MultiSelectTreeDropdown = ({
  onSourceChange,
  onStatusChange,
  onBrandCategoryChange,
  onBrandChange,
  onDivisionChange,
  onPlatformChange,
}) => {
  // States for filter options
  const [sources, setSources] = useState(["All"]);
  const [statuses, setStatuses] = useState(["All"]);
  const [brandCategories, setBrandCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [platforms, setPlatforms] = useState([]);
  const [divisions, setDivisions] = useState(["All Divisions"]);

  // States for selected filters
  const [selectedSource, setSelectedSource] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedBrandCategory, setSelectedBrandCategory] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState([]);
  const [selectedDivision, setSelectedDivision] = useState("All Divisions");
  const [selectedPlatform, setSelectedPlatform] = useState([]);

  // Dropdown visibility states
  const [isBrandCategoryOpen, setIsBrandCategoryOpen] = useState(false);
  const [isBrandOpen, setIsBrandOpen] = useState(false);
  const [isPlatformOpen, setIsPlatformOpen] = useState(false);

  // Fetch filter options from the backend
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/projects");
        const data = await response.json();

        // Extract unique values for each filter option
        const uniqueStatuses = Array.from(new Set(data.map((item) => item.projectStatus)));
        const uniqueCategories = Array.from(
          new Set(
            data.map((item) => {
              const category = item.category;
              return typeof category === "string" ? category.split("/").pop() : "";
            })
          )
        ).filter((category) => category); // Ensure valid strings
        const uniqueBrands = Array.from(new Set(data.map((item) => item.brand)));
        const uniquePlatforms = Array.from(new Set(data.flatMap((item) => item.platform)));
        const uniqueDivisions = Array.from(new Set(data.map((item) => item.division)));
        // Extract unique values for `source` field
      const uniqueSources = Array.from(new Set(data.map((item) => item.source)));

        setStatuses(["All", ...uniqueStatuses]);
        setSources(["All", ...uniqueSources]);
        setBrandCategories(uniqueCategories);
        setBrands(uniqueBrands);
        setPlatforms(uniquePlatforms);
        setDivisions(["All Divisions", ...uniqueDivisions]);
      } catch (error) {
        console.error("Error fetching filter options:", error);
      }
    };

    fetchOptions();
  }, []);

  // Handlers for each filter group
  const handleSourceChange = (e) => {
    const value = e.target.value;
    setSelectedSource(value);
    onSourceChange(value); // Notify parent
  };

  const handleStatusChange = (e) => {
    const value = e.target.value;
    setSelectedStatus(value);
    onStatusChange(value); // Notify parent
  };

  const handleBrandCategoryChange = (e) => {
    const value = e.target.value;
    setSelectedBrandCategory((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
    );
    onBrandCategoryChange(
      selectedBrandCategory.includes(value)
        ? selectedBrandCategory.filter((item) => item !== value)
        : [...selectedBrandCategory, value]
    );
  };

  const handleBrandChange = (e) => {
    const value = e.target.value;
    setSelectedBrand((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
    );
    onBrandChange(
      selectedBrand.includes(value)
        ? selectedBrand.filter((item) => item !== value)
        : [...selectedBrand, value]
    );
  };

  const handleDivisionChange = (e) => {
    const value = e.target.value;
    setSelectedDivision(value);
    onDivisionChange(value); // Notify parent
  };

  const handlePlatformChange = (e) => {
    const value = e.target.value;
    setSelectedPlatform((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
    );
    onPlatformChange(
      selectedPlatform.includes(value)
        ? selectedPlatform.filter((item) => item !== value)
        : [...selectedPlatform, value]
    );
  };

  return (
    <div className="flex space-x-4">
      {/* Source Dropdown */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Source</label>
        <select
          value={selectedSource}
          onChange={handleSourceChange}
          className="bg-gray-100 text-black p-2 rounded-lg border border-gray-300"
        >
          {sources.map((source) => (
            <option key={source} value={source}>
              {source}
            </option>
          ))}
        </select>
      </div>

      {/* Status Dropdown */}
      <div>
  <label className="block text-sm font-medium text-gray-700">Status</label>
  <select
    value={selectedStatus}
    onChange={(e) => {
      const value = e.target.value;
      setSelectedStatus(value); // Update selected status
      onStatusChange(value); // Notify parent
    }}
    className="bg-gray-100 text-black p-2 rounded-lg border border-gray-300"
  >
    {statuses.map((status) => (
      <option key={status} value={status}>
        {status}
      </option>
    ))}
  </select>
</div>
      {/* category Dropdown */}
      <div className="relative">
  <label className="block text-sm font-medium text-gray-700">Category</label>
  <div
    onClick={() => setIsBrandCategoryOpen(!isBrandCategoryOpen)}
    className="bg-gray-100 text-black p-2 rounded-lg border border-gray-300 cursor-pointer"
  >
    Select Categories
  </div>
  {isBrandCategoryOpen && (
    <div className="absolute mt-2 bg-white shadow-lg rounded-lg border border-gray-300 p-4 z-10">
      {brandCategories.map((category) => (
        category && (
          <label key={category} className="flex items-center space-x-2 mb-2">
            <input
              type="checkbox"
              value={category}
              checked={selectedBrandCategory.includes(category)}
              onChange={handleBrandCategoryChange}
              className="form-checkbox"
            />
            <span>{category}</span>
          </label>
        )
      ))}
    </div>
  )}
</div>

      {/* Brand Dropdown */}
      <div className="relative">
        <label className="block text-sm font-medium text-gray-700">Brand</label>
        <div
          onClick={() => setIsBrandOpen(!isBrandOpen)}
          className="bg-gray-100 text-black p-2 rounded-lg border border-gray-300 cursor-pointer"
        >
          Select Brands
        </div>
        {isBrandOpen && (
          <div className="absolute mt-2 bg-white shadow-lg rounded-lg border border-gray-300 p-4 z-10">
            {brands.map((brand) => (
              <label key={brand} className="flex items-center space-x-2 mb-2">
                <input
                  type="checkbox"
                  value={brand}
                  checked={selectedBrand.includes(brand)}
                  onChange={handleBrandChange}
                  className="form-checkbox"
                />
                <span>{brand}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Platform Dropdown */}
      <div className="relative">
        <label className="block text-sm font-medium text-gray-700">Platform</label>
        <div
          onClick={() => setIsPlatformOpen(!isPlatformOpen)}
          className="bg-gray-100 text-black p-2 rounded-lg border border-gray-300 cursor-pointer"
        >
          Select Platforms
        </div>
        {isPlatformOpen && (
          <div className="absolute mt-2 bg-white shadow-lg rounded-lg border border-gray-300 p-4 z-10">
            {platforms.map((platform) => (
              <label key={platform} className="flex items-center space-x-2 mb-2">
                <input
                  type="checkbox"
                  value={platform}
                  checked={selectedPlatform.includes(platform)}
                  onChange={handlePlatformChange}
                  className="form-checkbox"
                />
                <span>{platform}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Division Dropdown */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Division</label>
        <select
          value={selectedDivision}
          onChange={handleDivisionChange}
          className="bg-gray-100 text-black p-2 rounded-lg border border-gray-300"
        >
          {divisions.map((division) => (
            <option key={division} value={division}>
              {division}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default MultiSelectTreeDropdown;
