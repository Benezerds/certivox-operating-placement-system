"use client";

import { useState, useEffect } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/app/firebase"; // Ensure Firebase is set up correctly
import AddProject from "components/project/AddProject"; // Import the AddProject component
import ProjectTable from "@/components/project/ProjectTable";

const Tracker = () => {
  const [projects, setProjects] = useState([]);
  const [showAddProject, setShowAddProject] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDivision, setSelectedDivision] = useState("all");
  const [selectedYear, setSelectedYear] = useState("2024");

  // Fetch projects from Firestore and listen for changes
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "Projects"), (snapshot) => {
      const fetchedProjects = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Log the fetched projects to inspect the data
      console.log(fetchedProjects);

      setProjects(fetchedProjects);
    });

    // Cleanup the listener when the component unmounts
    return () => unsubscribe();
  }, []);

  // Function to safely handle different formats of the 'date' field
  const getProjectDate = (project) => {
    if (project.date?.toDate) {
      // If it's a Firestore Timestamp, convert to JS Date
      return project.date.toDate();
    }
    if (project.date instanceof Date) {
      return project.date;
    }
    if (typeof project.date === "string") {
      return new Date(project.date);
    }
    return null;
  };

  return (
    // Data Grid
    <div className="flex flex-col justify-between h-screen p-8">
      <div className="flex-grow"></div>

      {/* Project Summary Table Section */}
      <div className="flex flex-col">
        <h1 className="mb-6 text-2xl font-semibold">Project Summary</h1>

        {/* Filter Options */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            {/* Division Dropdown */}
            <select
              value={selectedDivision}
              onChange={(e) => setSelectedDivision(e.target.value)}
              className="p-2 border border-gray-300 rounded-lg"
            >
              <option value="all">ALL DIVISION</option>
              <option value="Marketing">Marketing</option>
              <option value="Community">Community</option>
            </select>

            {/* Year Dropdown */}
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="p-2 border border-gray-300 rounded-lg"
            >
              <option value="2024">2024</option>
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
              className="w-64 p-2 mr-2 border border-gray-300 rounded-lg"
            />
            <button className="px-4 py-2 bg-gray-200 rounded-lg">
              Export CSV
            </button>
            <button
              onClick={() => setShowAddProject((prev) => !prev)}
              className="px-4 py-2 text-white bg-black rounded-lg"
            >
              + New Project
            </button>

            {showAddProject && (
              <AddProject onClose={() => setShowAddProject(false)} />
            )}
          </div>
        </div>

        <ProjectTable projects={projects} getProjectDate={getProjectDate} />

        <p>Total Projects: {projects.length}</p>
      </div>
    </div>
  );
};

export default Tracker;
