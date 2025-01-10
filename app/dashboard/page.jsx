"use client";

import { useEffect, useState } from "react";
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/app/firebase";
import PerformanceMetrics from "@/components/dashboard/PerformanceMetrics";

function Dashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

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

  const handleLogout = async () => {
    try {
      await signOut(auth); // Firebase sign-out
      router.push("/auth"); // Redirect to the login page
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        setIsAuthenticated(false); // User is not authenticated
        router.push("/auth"); // Redirect to login page
      } else {
        setIsAuthenticated(true); // User is authenticated
      }
    });

    // Cleanup subscription when the component is unmounted
    return () => unsubscribe();
  }, [router]);

  // Return null or loading screen if not authenticated
  if (!isAuthenticated) {
    return <div>Loading...</div>;
  }

  return (
    <div className="mt-8 ml-8">
      {/* Main Content */}
      <h2 className="mb-4 text-2xl font-bold text-gray-800">
        Performance Metrics
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
    </div>
  );
}

export default Dashboard;
