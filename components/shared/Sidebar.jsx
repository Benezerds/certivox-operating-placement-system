'use client';

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  HomeIcon,
  ClipboardDocumentIcon,
  ChartBarIcon,
  WalletIcon,
} from "@heroicons/react/24/solid";

const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(true); // Sidebar starts expanded
  const router = useRouter();

  const menuItems = [
    { name: "Home", icon: <HomeIcon className="w-6 h-6 mr-3" />, path: "/home" },
    { name: "Projects", icon: <ClipboardDocumentIcon className="w-6 h-6 mr-3" />, path: "/projects" },
    { name: "Data", icon: <ChartBarIcon className="w-6 h-6 mr-3" />, path: "/data" },
    { name: "Budget", icon: <WalletIcon className="w-6 h-6 mr-3" />, path: "/budget" },
  ];

  const handleToggle = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <aside
      className={`flex flex-col bg-white text-gray-700 shadow-md transition-all duration-300 ${
        isExpanded ? "w-64" : "w-20"
      } h-screen`}
    >
      {/* Logo and Toggle */}
      <div className="flex items-center justify-between px-6 py-4 border-b">
        <h1 className={`text-xl font-bold ${!isExpanded && "hidden"}`}>
          Logo
        </h1>
        <button
          onClick={handleToggle}
          className="text-gray-500 hover:text-gray-900 focus:outline-none"
        >
          {isExpanded ? "←" : "→"}
        </button>
      </div>

      {/* Navigation Menu */}
      <nav className="mt-4">
        <ul className="space-y-2">
          {menuItems.map((item, index) => (
            <li key={index}>
              <a
                onClick={() => router.push(item.path)}
                className={`flex items-center px-6 py-2 rounded-md cursor-pointer hover:bg-gray-100 hover:text-gray-900 transition ${
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
