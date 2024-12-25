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
} from "@heroicons/react/24/solid";

const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(true); // Sidebar starts expanded
  const [currentPath, setCurrentPath] = useState(""); // Track current path
  const router = useRouter();

  const menuItems = [
    { name: "Home", icon: <HomeIcon className="w-6 h-6 mr-3" />, path: "dashboard" },
    { name: "Projects", icon: <ClipboardDocumentIcon className="w-6 h-6 mr-3" />, path: "/projects" },
    { name: "Data", icon: <ChartBarIcon className="w-6 h-6 mr-3" />, path: "/data" },
    { name: "Budget", icon: <WalletIcon className="w-6 h-6 mr-3" />, path: "/budget" },
  ];

  const handleToggle = () => {
    setIsExpanded((prev) => !prev);
  };

  // Track the current path manually
  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentPath(window.location.pathname); // Get the current path from the window object
    }
  }, [router]); // Update when router changes

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
          <img
            src="/cretivox_logo.png"
            alt="Cretivox Logo"
            className={`h-8 transition-all duration-300 ${
              isExpanded ? "w-auto" : "w-0 hidden"
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
            <Bars3Icon className="w-6 h-6" />
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
                  router.push(item.path)
                  setCurrentPath(item.path); // Update the current path on click
                }}
                
                className={`flex items-center px-6 py-2 rounded-md cursor-pointer hover:bg-gray-100 hover:text-gray-900 transition ${
                  currentPath === item.path
                  ? "bg-gray-200 text-gray-900" : "hover:bg-gray-100 hover:text-gray-900"}
                  isExpanded ? "justify-start" : "justify-center"
                }`}
              >
                {item.icon}
                <span className={`${!isExpanded && "hidden"} text-sm`}>
                  {item.name}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
