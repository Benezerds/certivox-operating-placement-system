"use client";
import { useState } from "react";
const Tracker = () => {
  const [projects, setProjects] = useState([]);
    
  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold mb-6">Project Summary</h1>
      
      {/* Filter Options */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4">
          {/* Division Dropdown */}
          <select className="border border-gray-300 p-2 rounded-lg">
            <option value="all">ALL DIVISION</option>
            <option value="marketing">Marketing</option>
            <option value="product">Product</option>
            <option value="sales">Sales</option>
          </select>

          {/* Year Dropdown */}
          <select className="border border-gray-300 p-2 rounded-lg">
            <option value="2023">2023</option>
            <option value="2022">2022</option>
            <option value="2021">2021</option>
          </select>
        </div>
        
        {/* Buttons for Export and Add Project */}
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 bg-gray-200 rounded-lg">Export CSV</button>
          <button className="px-4 py-2 bg-black text-white rounded-lg">+ New Project</button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto mt-6">
        <table className="w-full text-left border border-gray-300">
          <thead>
            <tr>
              {['Source', 'Project', 'Status', 'Date', 'Quarter', 'Category', 'Brand', 'Platform', 'SOW', 'Link', 'Division'].map((header) => (
                <th key={header} className="p-2 border-b border-gray-300">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {projects.length === 0 ? (
              <tr>
                <td colSpan={11} className="p-4 text-center text-gray-500">No projects available</td>
              </tr>
            ) : (
              projects.map((project, idx) => (
                <tr key={idx} className="border-b">
                  <td className="p-2">{project.source}</td>
                  <td className="p-2">{project.project}</td>
                  <td className="p-2">{project.status}</td>
                  <td className="p-2">{project.date}</td>
                  <td className="p-2">{project.quarter}</td>
                  <td className="p-2">{project.category}</td>
                  <td className="p-2">{project.brand}</td>
                  <td className="p-2">{project.platform || 'N/A'}</td>
                  <td className="p-2">{project.sow || 'N/A'}</td>
                  <td className="p-2">{project.link || 'N/A'}</td>
                  <td className="p-2">{project.division || 'N/A'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination and Total Projects */}
      <div className="flex justify-between items-center mt-4">
        {/* Pagination Controls */}
        <div className="flex gap-2">
          <button className="px-3 py-1 border border-gray-300 rounded">{"<"}</button>
          {[1, 2, 3, 4].map((page) => (
            <button
              key={page}
              className="px-3 py-1 border border-gray-300 rounded"
            >
              {page}
            </button>
          ))}
          <button className="px-3 py-1 border border-gray-300 rounded">{">"}</button>
        </div>

        {/* Total Projects Count */}
        <p>Total Project: {projects.length}</p>
      </div>
    </div>
  );
};

export default Tracker