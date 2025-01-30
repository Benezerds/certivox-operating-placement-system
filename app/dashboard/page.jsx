"use client";

import { useState, useEffect } from "react";
import { getYear, parseISO } from "date-fns";
import { collection, onSnapshot } from "firebase/firestore";
import { auth, db } from "@/app/firebase"; // Ensure Firebase is set up correctly
import ProjectTable from "@/components/project/ProjectTable";
import ProjectTableNoFunctionality from "@/components/dashboard/ProjectTableNoFunctionality";
import BrandCategory from "@/components/visualizations/BrandCategory";
import PlatformCategory from "@/components/visualizations/PlatformCategory";
import StatusProgress from "@/components/visualizations/StatusProgress";
import ActivityLogCard from "@/components/visualizations/ActivityLogCard";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";

function Dashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const router = useRouter();

  // ✅ Authentication Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        setIsAuthenticated(false);
        router.push("/auth");
      } else {
        setIsAuthenticated(true);
      }
    });
    return () => unsubscribe();
  }, []);

  // ✅ Fetch Projects
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "Projects"), (snapshot) => {
      const fetchedProjects = snapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        .sort((a, b) => {
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

  // ✅ Pagination Logic
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

  // ✅ Fetch Activities
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await fetch("/api/activity");
        if (!response.ok) throw new Error("Failed to fetch activities");
        const data = await response.json();
        setActivities(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  // ✅ Render Component
  if (!isAuthenticated) {
    return <div>Loading...</div>;
  }

  return (
    <div className="mt-8 ml-8 mr-8">
      {/* Performance Metrics Section */}
      <h2 className="mb-4 text-2xl font-bold text-gray-800">
        Performance Metrics
      </h2>

      {/* Flex container for layout */}
      <div className="flex gap-4">
        {/* Left Column: Brand & Platform Category */}
        <div className="flex flex-1 gap-4">
          <BrandCategory className="flex-1" />
          <PlatformCategory className="flex-1" />
        </div>

        {/* Right Column: Activity Logs */}
        <div className="flex flex-col w-1/3 p-4 bg-white border rounded-lg shadow-md">
          <h2 className="mb-2 text-lg font-semibold">Recent Activities</h2>
          {loading ? (
            <p>Loading activities...</p>
          ) : error ? (
            <p className="text-red-500">Error: {error}</p>
          ) : activities.length > 0 ? (
            <div className="space-y-2 overflow-y-auto max-h-[500px] scroll-smooth">
              {activities.map((activity) => (
                <ActivityLogCard key={activity.id} activity={activity} />
              ))}
            </div>
          ) : (
            <p>No recent activities.</p>
          )}
        </div>
      </div>

      {/* Project Table Section */}
      <div className="flex-1 my-8">
        <ProjectTableNoFunctionality
          projects={paginatedProjects}
          getProjectDate={(project) =>
            project.createdAt?.toDate ? project.createdAt.toDate() : new Date()
          }
        />
      </div>

      {/* Pagination Controls */}
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

      {/* Display Total Projects */}
      <p className="mt-2 text-center">
        Total Projects: {filteredProjects.length}
      </p>

      {/* Status Progress Section
      <div className="mt-8">
        <h2 className="mb-4 text-xl font-semibold">Project Status Progress</h2>
        <StatusProgress />
      </div> */}
    </div>
  );
}

export default Dashboard;
