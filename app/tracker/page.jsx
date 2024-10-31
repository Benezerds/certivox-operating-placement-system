"use client";
import { useState } from "react";
import AddProject from "components/AddProject"; // Import the AddProject component

const Tracker = () => {
  const [projects, setProjects] = useState([
    // Sample data to test pagination
    { source: "Inbound", project: "Brand new website", status: "Content...", date: "Jan 1, 2023", quarter: "Q1", category: "Campaign", brand: "RUCAS", platform: "Website", sow: "Option1", link: "example.com", division: "Marketing" },
    { source: "Inbound", project: "New feature launch", status: "Ongoing", date: "Jan 1, 2023", quarter: "Q1", category: "Campaign", brand: "RUCAS", platform: "Website", sow: "Option1", link: "example.com", division: "Marketing" },
    { source: "Inbound", project: "Blog post about AI", status: "Content...", date: "Jan 1, 2023", quarter: "Q1", category: "Campaign", brand: "RUCAS", platform: "Website", sow: "Option1", link: "example.com", division: "Marketing" },
    { source: "Inbound", project: "Social media campaign", status: "Editing", date: "Jan 1, 2023", quarter: "Q1", category: "Campaign", brand: "RUCAS", platform: "Website", sow: "Option1", link: "example.com", division: "Marketing" },
    { source: "Outbound", project: "Email campaign", status: "Delivered", date: "Feb 1, 2023", quarter: "Q1", category: "Promotion", brand: "ABC", platform: "Email", sow: "Option2", link: "abc.com", division: "Sales" },
    // Add more items as needed to test pagination
  ]);
  
  const [showAddProject, setShowAddProject] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDivision, setSelectedDivision] = useState("all");
  const [selectedYear, setSelectedYear] = useState("2023");

  const rowsPerPage = 4;
  const [currentPage, setCurrentPage] = useState(1);

  // Filter projects based on the search query and selected filters
  const filteredProjects = projects
    .filter((project) => project.brand.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter((project) => selectedDivision === "all" || project.division === selectedDivision)
    .filter((project) => selectedYear === "all" || project.date.startsWith(selectedYear));

  const totalPages = Math.ceil(filteredProjects.length / rowsPerPage);
  const displayedProjects = filteredProjects.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const goToPage = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold mb-6">Project Summary</h1>

      {/* Filter Options */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4">
          {/* Division Dropdown */}
          <select
            value={selectedDivision}
            onChange={(e) => setSelectedDivision(e.target.value)}
            className="border border-gray-300 p-2 rounded-lg"
          >
            <option value="all">ALL DIVISION</option>
            <option value="marketing">Marketing</option>
            <option value="product">Community</option>
          </select>

          {/* Year Dropdown */}
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="border border-gray-300 p-2 rounded-lg"
          >
            <option value="2023">2023</option>
            <option value="2022">2022</option>
            <option value="2021">2021</option>
          </select>
        </div>

        {/* Search Bar and Buttons */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Search by brand"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border border-gray-300 p-2 rounded-lg w-64 mr-2"
          />
          <button className="px-4 py-2 bg-gray-200 rounded-lg">Export CSV</button>
          <button
            onClick={() => setShowAddProject((prev) => !prev)}
            className="px-4 py-2 bg-black text-white rounded-lg"
          >
            + New Project
          </button>

          {showAddProject && (
            <AddProject onClose={() => setShowAddProject(false)} />
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto mt-6">
        <table className="w-full text-left border border-gray-300">
          <thead>
            <tr>
              {[
                "Source",
                "Project",
                "Status",
                "Date",
                "Quarter",
                "Category",
                "Brand",
                "Platform",
                "SOW",
                "Division",
                "Link",
              ].map((header) => (
                <th key={header} className="p-2 border-b border-gray-300">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {displayedProjects.length === 0 ? (
              <tr>
                <td colSpan={11} className="p-4 text-center text-gray-500">
                  No projects available
                </td>
              </tr>
            ) : (
              displayedProjects.map((project, idx) => (
                <tr key={idx} className="border-b">
                  <td className="p-2">{project.source || "N/A"}</td>
                  <td className="p-2">{project.project || "N/A"}</td>
                  <td className="p-2">{project.status || "N/A"}</td>
                  <td className="p-2">{project.date || "N/A"}</td>
                  <td className="p-2">{project.quarter || "N/A"}</td>
                  <td className="p-2">{project.category || "N/A"}</td>
                  <td className="p-2">{project.brand || "N/A"}</td>
                  <td className="p-2">{project.platform || "N/A"}</td>
                  <td className="p-2">{project.sow || "N/A"}</td>
                  <td className="p-2">{project.division || "N/A"}</td>
                  <td className="p-2">{project.link || "N/A"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination and Total Projects */}
      <div className="flex justify-between items-center mt-4">
        <div className="flex gap-2">
          <button
            onClick={() => goToPage(currentPage - 1)}
            className="px-3 py-1 border border-gray-300 rounded"
            disabled={currentPage === 1}
          >
            {"<"}
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => goToPage(page)}
              className={`px-3 py-1 border border-gray-300 rounded ${
                page === currentPage ? "bg-gray-300" : ""
              }`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => goToPage(currentPage + 1)}
            className="px-3 py-1 border border-gray-300 rounded"
            disabled={currentPage === totalPages}
          >
            {">"}
          </button>
        </div>

        <p>Total Projects: {filteredProjects.length}</p>
      </div>
    </div>
  );
};

export default Tracker;
