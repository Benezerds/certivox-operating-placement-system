'use client';

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  HomeIcon,
  ClipboardDocumentIcon,
  ChartBarIcon,
  WalletIcon,
  Bars3Icon,
  ChevronDoubleLeftIcon,
  ArrowLeftEndOnRectangleIcon,
  UserCircleIcon,
  UsersIcon,
  AdjustmentsHorizontalIcon
} from "@heroicons/react/24/solid";
import { signOut } from "firebase/auth";
import { auth } from "@/app/firebase";
import Image from "next/image";

const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(true); // Sidebar starts expanded
  const [currentPath, setCurrentPath] = useState(""); // Track current path
  const router = useRouter();

  const menuItems = [
    { name: "Home", icon: <HomeIcon className="w-6 h-6" />, path: "/dashboard" },
    { name: "Projects", icon: <ClipboardDocumentIcon className="w-6 h-6" />, path: "/dashboard/project" },
    { name: "Data", icon: <ChartBarIcon className="w-6 h-6" />, path: "/dashboard/data" },
    { name: "Budget", icon: <WalletIcon className="w-6 h-6" />, path: "/dashboard/budget" },
    { name: "Admin", icon: <UserCircleIcon className="w-6 h-6" />, path: "/admin" },
    { name: "Users", icon: <UsersIcon className="w-6 h-6" />, path: "/admin/users" },
    { name: "Roles", icon: <AdjustmentsHorizontalIcon className="w-6 h-6" />, path: "/admin/setup" },
  ];

  const handleToggle = () => {
    setIsExpanded((prev) => !prev);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth); // Firebase sign-out
      router.push("/auth"); // Redirect to the login page
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Track the current path manually
  useEffect(() => {
    if (typeof window !== "undefined") {
      const path = window.location.pathname;
      if (path === "/admin") {
        setCurrentPath("/admin/users"); // Default to Users under Admin
        router.push("/admin/users"); // Redirect to UsersPage under Admin
      } else {
        setCurrentPath(path); // Set the current path based on the actual path
      }
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
          {/* Actual Logo */}
          <Image
            src="/cretivox_logo.png"
            alt="Cretivox Logo"
            width={50}
            height={50}
            className={`h-8 transition-all duration-300 ${
              isExpanded ? "w-auto" : "hidden"
            }`}
          />
        </h1>
        {/* Toggle Button */}
        <button
          onClick={handleToggle}
          className="text-gray-500 hover:text-gray-900 focus:outline-none"
        >
          {isExpanded ? (
            <ChevronDoubleLeftIcon className="w-6 h-6" />
          ) : (
            <Bars3Icon className="flex items-center w-6 h-6" />
          )}
        </button>
      </div>

      {/* Navigation Menu */}
      <nav className="mt-4">
        <ul className="space-y-2">
          {menuItems.map((item, index) => (
            <li key={index}>
              <a
                onClick={() => {
                  router.push(item.path);
                  setCurrentPath(item.path); // Update the current path on click
                }}
                className={`flex items-center px-6 py-2 rounded-md cursor-pointer hover:bg-gray-100 transition ${
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

      {/* Logout Button */}
      <div className="p-4 mt-auto border-t">
        <button
          onClick={handleLogout}
          className={`flex items-center justify-center w-full px-4 py-2 text-white bg-red-500 rounded-lg transition-all hover:bg-red-600 ${
            isExpanded ? "justify-start" : "justify-center"
          }`}
        >
          <ArrowLeftEndOnRectangleIcon className="w-6 h-6" />
          {isExpanded && <span className="ml-2">Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
