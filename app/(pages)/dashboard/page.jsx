"use client";
import { useEffect, useRef, useState } from "react";
import { collection, onSnapshot, orderBy } from "firebase/firestore";
import Swal from "sweetalert2";
import { Chart } from "chart.js/auto";
import { useRouter } from "next/navigation";
import { auth } from "@/app/firebase";
import { getAuth, signOut } from "firebase/auth"; // Firebase imports
import PerformanceMetrics from "@/components/dashboard/PerformanceMetrics";

function Dashboard() {
  //Test Data and Metrics
  const performanceData = [
    {
      label: "Total Projects",
      data: [80, 85, 90, 95, 100],
      isPositive: true,
      percentage: "+10%",
      days: "7 days",
    },
    {
      label: "Average Time on Page",
      data: [2, 2.5, 2.3, 2.8, 3],
      isPositive: true,
      percentage: "+15%",
      days: "7 days",
    },
  ];


  const currentYear = new Date().getFullYear();
  const auth = getAuth();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/"); // Redirect to login page after logout
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Fetch data function (adjust this as per your requirements)
  const fetchData = async () => {
    try {
      // Fetch or handle data here
      console.log("Fetching data...");
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Checking Authentication
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        router.push("/"); // Redirect to login if not authenticated
      } else {
        setIsAuthenticated(true); // Set authenticated state
        fetchData(); // Fetch data when user is authenticated
      }
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, [router]);

  // Conditional rendering to prevent flashing
  if (!isAuthenticated) {
    return null; // Show nothing or a loading indicator until authentication state is resolved
  }

  return (
    <>
      <div className="flex min-h-screen">
        {/* Main Content */}
        <div className="flex-1 p-6 bg-gray-100">
          <header className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-white transition bg-red-500 rounded-lg hover:bg-red-700"
            >
              Logout
            </button>
          </header>

          {/* Replace this with your existing dashboard content */}
          {/* Performance Metrics Section */}
          <section className="mt-8">
            <h2 className="mb-4 text-2xl font-bold">Performance</h2>
            <div className="flex flex-wrap gap-4">
              {performanceData.map((metric, index) => (
                <PerformanceMetrics
                  key={index}
                  data={metric.data}
                  label={metric.label}
                  isPositive={metric.isPositive}
                  percentage={metric.percentage}
                  days={metric.days}
                />
              ))}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
