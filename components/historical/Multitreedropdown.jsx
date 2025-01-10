import React, { useState } from "react";

const MultiSelectTreeDropdown = ({
  onSourceChange,
  onStatusChange,
  onBrandCategoryChange,
  onBrandChange,
  onDivisionChange,
}) => {
  const [selectedSource, setSelectedSource] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedBrandCategory, setSelectedBrandCategory] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState([]);
  const [selectedDivision, setSelectedDivision] = useState("All Divisions");

  // Dropdown visibility states
  const [isBrandCategoryOpen, setIsBrandCategoryOpen] = useState(false);
  const [isBrandOpen, setIsBrandOpen] = useState(false);

  // Options for each group
  const sources = ["Outbound", "Inbound", "All"];
  const statuses = ["All", "0", "Development", "Content Proposal", "Ongoing", "Editing", "Delivered", "Published"];
  const brandCategories = ["Fashion", "Judi Online", "Sport", "E-Sport"];
  const brands = ["Uniqlo", "Manchester City", "VARdrid"];
  const divisions = ["Marketing", "Community", "All Divisions"];

  // Handlers for each group
  const handleSourceChange = (e) => {
    const value = e.target.value;
    setSelectedSource(value);
    onSourceChange(value);
  };

  const handleStatusChange = (value) => {
    setSelectedStatus(value);
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
    onDivisionChange(value);
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
      setSelectedStatus(value);
      onStatusChange(value); // Inform parent about the change
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

      {/* Brand Category Dropdown */}
      <div className="relative">
        <label className="block text-sm font-medium text-gray-700">Brand Category</label>
        <div
          onClick={() => setIsBrandCategoryOpen(!isBrandCategoryOpen)} // Toggle visibility
          className="bg-gray-100 text-black p-2 rounded-lg border border-gray-300 cursor-pointer"
        >
          Select Brand Categories
        </div>
        {isBrandCategoryOpen && (
          <div className="absolute mt-2 bg-white shadow-lg rounded-lg border border-gray-300 p-4 z-10">
            {brandCategories.map((category) => (
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
            ))}
          </div>
        )}
      </div>

      {/* Brand Dropdown */}
      <div className="relative">
        <label className="block text-sm font-medium text-gray-700">Brand</label>
        <div
          onClick={() => setIsBrandOpen(!isBrandOpen)} // Toggle visibility
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
