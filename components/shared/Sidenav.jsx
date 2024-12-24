// components/Sidenav.js
import { HomeIcon, ClipboardDocumentIcon, ChartBarIcon, WalletIcon } from '@heroicons/react/24/outline';

const Sidenav = () => {
  return (
    <div className="w-64 h-screen bg-white shadow-md">
      <div className="px-6 py-4">
        <h1 className="text-xl font-bold">Logo</h1>
      </div>
      <nav className="mt-4">
        <ul className="space-y-2">
          <li>
            <a
              href="#"
              className="flex items-center px-6 py-2 text-gray-700 rounded-md hover:bg-gray-100 hover:text-gray-900"
            >
              <HomeIcon className="w-6 h-6 mr-3" />
              Home
            </a>
          </li>
          <li>
            <a
              href="#"
              className="flex items-center px-6 py-2 text-gray-700 rounded-md hover:bg-gray-100 hover:text-gray-900"
            >
              <ClipboardDocumentIcon className="w-6 h-6 mr-3" />
              Projects
            </a>
          </li>
          <li>
            <a
              href="#"
              className="flex items-center px-6 py-2 text-gray-700 rounded-md hover:bg-gray-100 hover:text-gray-900"
            >
              <ChartBarIcon className="w-6 h-6 mr-3" />
              Data
            </a>
          </li>
          <li>
            <a
              href="#"
              className="flex items-center px-6 py-2 text-gray-700 rounded-md hover:bg-gray-100 hover:text-gray-900"
            >
              <WalletIcon className="w-6 h-6 mr-3" />
              Budget
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidenav;
