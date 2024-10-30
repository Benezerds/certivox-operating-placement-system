"use client";
import { useState } from "react";
const Tracker = () => {
  const [projects, setProjects] = useState([]);
    
  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold mb-6">Project Tracker</h1>
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
        <div className="mt-4">
          <p>Total Projects: {projects.length}</p>
        </div>
      </div>
    </div>
  );
};



export default Tracker