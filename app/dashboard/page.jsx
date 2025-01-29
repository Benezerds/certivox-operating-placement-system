"use client";

import { useState, useEffect } from "react";
import { getYear, parseISO } from "date-fns";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/app/firebase"; // Ensure Firebase is set up correctly
import ProjectTable from "@/components/project/ProjectTable";
import ProjectTableNoFunctionality from "@/components/dashboard/ProjectTableNoFunctionality";
import BrandCategory from "@/components/visualizations/BrandCategory";
import PlatformCategory from "@/components/visualizations/PlatformCategory";

import StatusProgress from "@/components/visualizations/StatusProgress";
import ActivityLogCard from "@/components/visualizations/ActivityLogCard";

function Dashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // Track the current page
  const itemsPerPage = 4; // Number of items per page
  const router = useRouter();

  // ✅ 1. Authentication Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        setIsAuthenticated(false);
        router.push("/auth");
      } else {
        setIsAuthenticated(true);
      }
      
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

  // ✅ 2. Fetch Activities (Runs only when component mounts)
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

  // ✅ 3. Render Component (Avoid Hooks Conditional Execution)
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

        {/* Right Column: Activity Logs (Matches height of left column) */}
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
    </div>
  );
};

export default Dashboard;
