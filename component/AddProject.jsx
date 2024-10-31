// components/AddProject.jsx

import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';


const AddProject = ({ onClose }) => {
  const [startDate, setStartDate] = useState(null);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      {/* Modal content */}
      <div className="bg-white p-8 rounded-lg w-full max-w-lg relative shadow-lg">
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500">
          Close X
        </button>

        <h2 className="text-xl font-semibold mb-4">Add Project</h2>

        {/* Form Fields */}
        <form className="space-y-4">
          <div>
            <label className="block font-semibold">Source</label>
            <select className="border border-gray-300 p-2 rounded w-full">
              <option>Choose one</option>
              <option>Inbound</option>
              <option>Outbound</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold">Project Name</label>
            <input
              type="text"
              placeholder="Enter project name"
              className="border border-gray-300 p-2 rounded w-full"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold">Project Status</label>
              <select className="border border-gray-300 p-2 rounded w-full">
                <option>Choose one</option>
                <option>Ongoing</option>
                <option>Completed</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold">Date</label>
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                placeholderText="Enter date"
                className="border border-gray-300 p-2 rounded w-full"
              />
            </div>
          </div>

          {/* Additional form fields... */}
          
          <button
            type="button"
            className="w-full bg-black text-white py-2 rounded-lg mt-4"
          >
            Add Project
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProject;
