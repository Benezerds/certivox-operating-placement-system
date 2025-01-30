"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  HomeIcon,
  ClipboardDocumentIcon,
  ChartBarIcon,
  WalletIcon,
  Bars2Icon,
  Bars3Icon,
  ChevronDoubleLeftIcon,
  ArrowLeftEndOnRectangleIcon,
  UserCircleIcon,
  UserIcon,
  AdjustmentsHorizontalIcon,
} from "@heroicons/react/24/solid";
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "@/app/firebase";

const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [currentPath, setCurrentPath] = useState("");
  const [userRole, setUserRole] = useState(null); // Store user role
  const router = useRouter();

  const handleToggle = () => {
    setIsExpanded((prev) => !prev);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/auth");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const fetchUserRole = async (uid) => {
    console.log("Fetching role for UID:", uid);
  
    try {
      const res = await fetch(`/api/users/${uid}`);
      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
  
      const data = await res.json();
      console.log("User role response:", data); // Debugging
  
      if (data && data.role) {
        setUserRole(data.role);
      } else {
        console.error("Role not found in API response");
      }
    } catch (error) {
      console.error("Failed to fetch user role:", error);
    }
  };
  
  // Fetch user role on mount
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("User logged in:", user.uid);
        fetchUserRole(user.uid);
      } else {
        console.log("No user logged in");
      }
    });
  
    return () => unsubscribe();
  }, []);

  // Define menu items
  const menuItems = [
    { name: "Home", icon: <HomeIcon className="w-6 h-6" />, path: "/dashboard" },
    { name: "Projects", icon: <ClipboardDocumentIcon className="w-6 h-6" />, path: "/dashboard/project" },
    { name: "Historical", icon: <ChartBarIcon className="w-6 h-6" />, path: "/dashboard/historical" },
    { name: "Comparison", icon: <Bars2Icon className="w-6 h-6" />, path: "/dashboard/comparison" },
    { name: "Category Management", icon: <WalletIcon className="w-6 h-6" />, path: "/dashboard/management" },
    { name: "Admin", icon: <UserCircleIcon className="w-6 h-6" />, path: "/dashboard/admin", restricted: true },
    { name: "Users", icon: <UserIcon className="w-6 h-6" />, path: "/dashboard/admin/users", restricted: true },
    { name: "Roles", icon: <AdjustmentsHorizontalIcon className="w-6 h-6" />, path: "/dashboard/admin/setup", restricted: true },
  ];

  // Remove restricted items if user is not an Admin
  const filteredMenuItems = userRole === "Admin" ? menuItems : menuItems.filter(item => !item.restricted);

  // Track the current path
  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentPath(window.location.pathname);
    }
  }, [router]);

  return (
    <aside
      className={`flex flex-col bg-white text-gray-700 shadow-md transition-all duration-300 ${
        isExpanded ? "w-64" : "w-20"
      } h-screen`}
    >
      {/* Logo and Toggle */}
      <div className="flex items-center justify-between px-6 py-4 border-b">
        <h1 className={`text-xl font-bold ${!isExpanded && "hidden"}`}>
          <img
            src="/cretivox_logo.png"
            alt="Cretivox Logo"
            className={`h-8 transition-all duration-300 ${
              isExpanded ? "w-auto" : "w-0 hidden"
            }`}
          />
        </h1>
        <button
          onClick={handleToggle}
          className="text-gray-500 hover:text-gray-900 focus:outline-none"
        >
          {isExpanded ? (
            <ChevronDoubleLeftIcon className="w-6 h-6" />
          ) : (
            <Bars3Icon className="w-6 h-6" />
          )}
        </button>
      </div>
  
      {/* Navigation Menu */}
      <nav className="mt-4">
        <ul className="space-y-2">
          {filteredMenuItems.map((item, index) => (
            <li key={index}>
              <a
                onClick={() => {
                  router.push(item.path);
                  setCurrentPath(item.path);
                }}
                className={`flex items-center px-6 py-2 rounded-md cursor-pointer transition ${
                  currentPath === item.path
                    ? "bg-gray-200 text-gray-900"
                    : "hover:bg-gray-100 hover:text-gray-900"
                } ${isExpanded ? "justify-start" : "justify-center"}`}
              >
                <div className="flex items-center justify-center w-8 h-8 mr-3">
                  {item.icon}
                </div>
                <span className={`${!isExpanded && "hidden"} text-sm`}>
                  {item.name}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
  
      {/* Role Display */}
      <div className={`px-6 py-4 mt-4 text-sm font-medium text-gray-600 ${isExpanded ? "text-left" : "text-center"}`}>
        <span className="block text-gray-500">Role:</span>
        <span className={`font-bold ${userRole === "Admin" ? "text-green-600" : "text-gray-700"}`}>
          {userRole}
        </span>
      </div>
  
      {/* Logout Button */}
      <div className="p-4 mt-auto border-t">
        <button
          onClick={handleLogout}
          className={`flex items-center justify-center w-full px-4 py-2 text-white bg-red-500 rounded-lg transition-all hover:bg-red-600 ${
            isExpanded ? "justify-start" : "justify-center"
          }`}
        >
          <span className="flex items-center">
            <ArrowLeftEndOnRectangleIcon className="w-6 h-6" />
            {isExpanded && <span className="ml-2">Logout</span>}
          </span>
        </button>
      </div>
    </aside>
  );
  
};

export default Sidebar;
