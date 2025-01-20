"use client";

import { useState, useEffect } from "react";
import { getYear, parseISO } from "date-fns";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/app/firebase"; // Ensure Firebase is set up correctly
import ProjectTable from "@/components/project/ProjectTable";
import ProjectTableNoFunctionality from "@/components/dashboard/ProjectTableNoFunctionality";
import BrandCategory from "@/components/visualizations/BrandCategory";
import PlatformCategory from "@/components/visualizations/PlatformCategory";

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // Track the current page
  const itemsPerPage = 4; // Number of items per page

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "Projects"), (snapshot) => {
      const fetchedProjects = snapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        .sort((a, b) => {
          const yearA = a.createdAt?.toDate
            ? a.createdAt.toDate().getFullYear()
            : 0;
          const yearB = b.createdAt?.toDate
            ? b.createdAt.toDate().getFullYear()
            : 0;
          if (yearA !== yearB) {
            return yearB - yearA;
          }

          const dateA = a.createdAt?.toDate
            ? a.createdAt.toDate()
            : new Date(0);
          const dateB = b.createdAt?.toDate
            ? b.createdAt.toDate()
            : new Date(0);
          return dateB - dateA;
        });

      setProjects(fetchedProjects);
      setFilteredProjects(fetchedProjects);
    });

    return () => unsubscribe();
  }, []);

  // Logic for paginated projects
  const paginatedProjects = filteredProjects.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);

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
    <div className="flex flex-col h-screen p-8">
      <h1 className="mb-6 text-2xl font-semibold">Dashboard</h1>
  
      {/* Brand and Platform categories displayed side by side on larger screens, stacked on smaller screens */}
      <div className="flex flex-col gap-8 mb-8 md:flex-row">
        <div className="flex flex-col flex-1">
          <BrandCategory />
        </div>
        <div className="flex flex-col flex-1">
          <PlatformCategory />
        </div>
      </div>
  
      {/* Project Table - moved to the bottom */}
      <div className="flex-1 mb-8">
        <ProjectTableNoFunctionality
          projects={paginatedProjects}
          getProjectDate={(project) =>
            project.createdAt?.toDate ? project.createdAt.toDate() : new Date()
          }
        />
      </div>
  
      {/* Pagination */}
      <div className="flex items-center justify-center gap-4 mt-4">
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
  
      <p>Total Projects: {filteredProjects.length}</p>
    </div>
  );
  
};

export default Dashboard;
