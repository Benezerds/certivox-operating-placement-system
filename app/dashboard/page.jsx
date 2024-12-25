"use client";
import { useEffect, useState } from "react";
import { getAuth, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/app/firebase";
import PerformanceMetrics from "@/components/dashboard/PerformanceMetrics";

function Dashboard() {
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

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        router.push("/"); // Redirect to login if not authenticated
      } else {
        setIsAuthenticated(true);
      }
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, [router]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="mt-8 ml-8">
      {/* Main Content */}
      <button
        onClick={handleLogout}
        className="h-12 px-4 py-2 text-white bg-red-500 rounded-lg w-44 hover:bg-red-600"
      >
        Logout
      </button>

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
