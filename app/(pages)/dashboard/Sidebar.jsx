import { useState } from "react";
import { useRouter } from "next/router";

const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(false); // For toggle
  const router = useRouter();

  const handleToggle = () => setIsExpanded(!isExpanded);

  const menuItems = [
    { name: "Dashboard", icon: "🏠", path: "/dashboard" },
    { name: "Projects", icon: "📁", path: "/projects" },
    { name: "Performance", icon: "📊", path: "/performance" },
    { name: "Settings", icon: "⚙️", path: "/settings" },
  ];

  return (
    <aside
      className={`flex flex-col bg-gray-800 text-white transition-all duration-300 ${
        isExpanded ? "w-64" : "w-16"
      } h-screen`}
    >
      {/* Toggle Button */}
      <button
        onClick={handleToggle}
        className="p-4 focus:outline-none bg-gray-700 hover:bg-gray-600"
      >
        {isExpanded ? "Collapse" : "Expand"}
      </button>

      {/* Menu Items */}
      <ul className="mt-4">
        {menuItems.map((item, index) => (
          <li
            key={index}
            onClick={() => router.push(item.path)}
            className="flex items-center gap-4 p-3 cursor-pointer hover:bg-gray-700"
          >
            <span>{item.icon}</span>
            {isExpanded && <span>{item.name}</span>}
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;