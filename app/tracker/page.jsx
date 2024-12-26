"use client";

import { useState, useEffect } from "react";
import { getYear, parseISO } from "date-fns";

import {
  collection,
  onSnapshot,
  doc,
  deleteDoc,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/app/firebase"; // Ensure Firebase is set up correctly
import AddProject from "components/project/AddProject"; // Import the AddProject component
import ProjectTable from "@/components/project/ProjectTable";
import EditProject from "@/components/project/EditProject";

const Tracker = () => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [showAddProject, setShowAddProject] = useState(false);
  const [editProject, setEditProject] = useState(null); // For storing the selected project to edit
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDivision, setSelectedDivision] = useState("all");
  const [selectedYear, setSelectedYear] = useState("all");
  const [currentPage, setCurrentPage] = useState(1); // Track the current page
  const itemsPerPage = 4; // Number of items per page
  const [notification, setNotification] = useState({ message: "", visible: false });

  // Fetch projects from Firestore and listen for changes
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "Projects"), (snapshot) => {
      const fetchedProjects = snapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        .filter((project) => {
          // Filter by division
          const divisionMatch =
            selectedDivision === "all" || project.division === selectedDivision;

          // Filter by year
          const yearMatch =
            selectedYear === "all" ||
            (project.date && getYear(parseISO(project.date)) === Number(selectedYear));


            return divisionMatch && yearMatch;
        })
        .sort((a, b) => {
          // Sort by division (alphabetically)
          if (a.division && b.division && a.division !== b.division) {
            return a.division.localeCompare(b.division);
          }

          // If divisions are the same, sort by year (descending)
          const yearA = a.createdAt?.toDate
            ? a.createdAt.toDate().getFullYear()
            : 0;
          const yearB = b.createdAt?.toDate
            ? b.createdAt.toDate().getFullYear()
            : 0;
          if (yearA !== yearB) {
            return yearB - yearA;
          }

          // Finally, sort by date created (descending)
          const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(0);
          const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(0);
          return dateB - dateA;
        });

      setProjects(fetchedProjects);
      setFilteredProjects(fetchedProjects);
    });

    // Cleanup the listener when the component unmounts
    return () => unsubscribe();
  }, [selectedDivision, selectedYear]);

  // Function to safely handle different formats of the 'createdAt' field
  const getProjectDate = (project) => {
    if (project.createdAt?.toDate) {
      return project.createdAt.toDate(); // Firestore Timestamp
    }
    return new Date(); // Default to the current date
  };
  const handleSearch = () => {
    const lowerCaseQuery = searchQuery.toLowerCase().trim();
  
    if (lowerCaseQuery === "") {
      setProjects(filteredProjects); // Reset to filteredProjects
      setTimeout(() => setNotification({ message: "", visible: false }), 3000); // Hide after 3 seconds
      return;
    }
  
    const filtered = filteredProjects.filter((project) =>
      project.brand?.toLowerCase().startsWith(lowerCaseQuery)
    );
  
    if (filtered.length > 0) {
      setProjects(filtered);
    } else {
      setNotification({
        message: "No projects match the entered brand ",
        visible: true,
      });
      setTimeout(() => setNotification({ message: "", visible: false }), 3000); // Hide after 3 seconds
    }
  };
  
  

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "Projects", id));
      setProjects((prevProjects) =>
        prevProjects.filter((project) => project.id !== id)
      );
      console.log(`Project with ID ${id} deleted successfully.`);
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  const handleAddProject = async (projectData) => {
    try {
      await addDoc(collection(db, "Projects"), {
        ...projectData,
        createdAt: serverTimestamp(), // Add server timestamp
      });
      console.log("Project added successfully.");
    } catch (error) {
      console.error("Error adding project:", error);
    }
  };

  const handleEdit = (project) => {
    setEditProject(project); // Open the EditProject modal with the selected project
  };

  // Logic for paginated projects
  const paginatedProjects = projects.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(projects.length / itemsPerPage);

  // Handle page navigation
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    
    <div className="flex flex-col justify-between h-screen p-8">
      {/* Notification */}
        {notification.visible && (
          <div
            style={{
              position: "fixed",
              bottom: "20px",
              left: "20px",
              backgroundColor: "#f8d7da", // Light red background
              color: "#721c24", // Dark red text
              padding: "10px 20px",
              border: "1px solid #f5c6cb", // Red border
              borderRadius: "8px",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              fontSize: "14px",
              fontWeight: "bold",
              zIndex: 1000,
            }}
          >
            {notification.message}
          </div>
        )}
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
              onChange={(e) => {
                setSelectedDivision(e.target.value);
                setCurrentPage(1); // Reset to first page
              }}
              className="p-2 border border-gray-300 rounded-lg"
            >
              <option value="all">ALL DIVISION</option>
              <option value="Marketing">Marketing</option>
              <option value="Community">Community</option>
            </select>

            {/* Year Dropdown */}
            <select
              value={selectedYear}
              onChange={(e) => {
                setSelectedYear(e.target.value);
                setCurrentPage(1); // Reset to first page
              }}
              className="p-2 border border-gray-300 rounded-lg"
            >
              <option value="all">All Years</option>
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
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
              
                }
              
              }}
              required
              className="w-64 p-2 mr-2 border border-gray-300 rounded-lg"
            />
            <button
              onClick={handleSearch}
              className="px-4 py-2 text-white bg-blue-500 rounded-lg"
            >
              Search
            </button>
            <button className="px-4 py-2 bg-gray-200 rounded-lg">Export CSV</button>
            <button
              onClick={() => setShowAddProject((prev) => !prev)}
              className="px-4 py-2 text-white bg-black rounded-lg"
            >
              + New Project
            </button>

            {showAddProject && (
              <AddProject onAdd={handleAddProject} onClose={() => setShowAddProject(false)} />
            )}
          </div>
        </div>

        {/* Edit Project Modal */}
        {editProject && (
          <EditProject
            project={editProject}
            onClose={() => setEditProject(null)} // Close the modal
          />
        )}

        {/* Project Table */}
        <ProjectTable
        
          projects={paginatedProjects}
          getProjectDate={getProjectDate}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />

        {/* Pagination */}
        <div className="flex items-center justify-center mt-4 gap-4">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-lg border ${
              currentPage === 1
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-white text-black hover:bg-gray-100"
            }`}
          >
            &lt; Back
          </button>
          <span className="px-4 py-2 text-lg font-semibold">{currentPage}</span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-lg border ${
              currentPage === totalPages
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-white text-black hover:bg-gray-100"
            }`}
          >
            Next &gt;
          </button>
        </div>

        <p>Total Projects: {projects.length}</p>
      </div>
      
    </div>
  );
};

export default Tracker;
