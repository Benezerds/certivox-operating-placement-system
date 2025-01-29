"use client";

import { useEffect, useState } from "react";
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/app/firebase";
import PerformanceMetrics from "@/components/dashboard/PerformanceMetrics";
import BrandCategory from "@/components/visualizations/BrandCategory";
import PlatformCategory from "@/components/visualizations/PlatformCategory";
import ActivityLogCard from "@/components/visualizations/ActivityLogCard";

function Dashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
    });

    return () => unsubscribe();
  }, [router]);

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
}

export default Dashboard;
