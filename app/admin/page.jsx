"use client";

import { useEffect, useState } from "react";
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/app/firebase";

const AdminPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

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

  if (!isAuthenticated) {
    return <div>Loading...</div>;
  }

  // Mock user data for demonstration
  const userData = [
    {
      name: "Ashley Alexander",
      email: "ashley.a@cretivox.com",
      role: "Admin",
      lastActive: "4 minutes ago",
    },
    {
      name: "Avia Butler",
      email: "avia.b@cretivox.com",
      role: "Employee",
      lastActive: "10 hours ago",
    },
    {
      name: "Bob Johnson",
      email: "bob.j@cretivox.com",
      role: "Employee",
      lastActive: "19 hours ago",
    },
    {
      name: "Alice Brown",
      email: "alice.b@cretivox.com",
      role: "Employee",
      lastActive: "1 day ago",
    },
  ];

  return (
    <div className="flex flex-col bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center px-8 py-4 bg-white shadow">
        <h1 className="text-xl font-bold text-gray-800">User Management</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
        >
          Log Out
        </button>
      </div>

      {/* Add User Button */}
      <div className="flex justify-end px-8 py-4">
        <button className="bg-gray-800 text-white px-6 py-2 rounded-md hover:bg-gray-700">
          Add User
        </button>
      </div>

      {/* User Table */}
      <div className="bg-white mx-8 shadow-md rounded-lg p-6">
        <div className="grid grid-cols-5 gap-4 font-semibold text-gray-600 border-b pb-2">
          <span>Full Name</span>
          <span>Email</span>
          <span>Role</span>
          <span>Last Active</span>
          <span>Actions</span>
        </div>

        {userData.map((user, index) => (
          <div
            key={index}
            className="grid grid-cols-5 gap-4 items-center text-gray-800 border-b py-2"
          >
            <span>{user.name}</span>
            <span className="text-gray-500">{user.email}</span>
            <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-center">
              {user.role}
            </span>
            <span className="text-gray-500">{user.lastActive}</span>
            <div className="flex gap-2">
              <button className="bg-gray-300 text-gray-700 px-3 py-1 rounded-md hover:bg-gray-400">
                Edit
              </button>
              <button className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPage;
