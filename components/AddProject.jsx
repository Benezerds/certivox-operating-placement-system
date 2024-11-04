import React, { useState, useEffect, useRef } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { addDoc, collection } from "firebase/firestore";  // Import Firestore addDoc and collection
import { db } from '@/app/firebase';  // Make sure the Firebase setup is correct

const AddProject = ({ onClose }) => {
  const [source, setSource] = useState('');
  const [projectName, setProjectName] = useState('');
  const [projectStatus, setProjectStatus] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [quarter, setQuarter] = useState('');
  const [brandCategory, setBrandCategory] = useState('');
  const [platform, setPlatform] = useState('');
  const [customPlatform, setCustomPlatform] = useState(''); // Custom platform text
  const [sowType, setSowType] = useState(''); // SOW type dropdown value
  const [isSowCustom, setIsSowCustom] = useState(false);
  const [link, setLink] = useState('');
  const [division, setDivision] = useState('');
  const [sowList, setSowList] = useState([{ id: 1, sow: '', content: '' }]); // List of SOWs for bundling

  const sowInputRef = useRef(null); // Ref for the SOW input field

  // Handle SOW dropdown changes
  const handleSowChange = (e) => {
    const value = e.target.value;
    setSowType(value);

    if (value === 'bundling') {
      setIsSowCustom(false); // Not using custom field for bundling
      setSowList([{ id: 1, sow: '', content: '' }]); // Reset SOW list for bundling
    } else if (value === 'custom') {
      setIsSowCustom(true); // Switch to input field for custom SOW
      setSowList([{ id: 1, sow: '', content: '' }]); // Reset SOWs for custom
    } else {
      setIsSowCustom(false); // Switch back to dropdown for non-bundling, non-custom
      setSowList([{ id: 1, sow: '', content: '' }]); // Reset list
    }
  };

  // Add another SOW field
  const addSowField = () => {
    const newSowId = sowList.length + 1;
    setSowList([...sowList, { id: newSowId, sow: '', content: '' }]);
  };

  // Remove an SOW field by ID
  const removeSowField = (id) => {
    const updatedSowList = sowList.filter((sow) => sow.id !== id);
    // Reassign IDs to keep SOW numbering continuous
    const reIndexedSowList = updatedSowList.map((sow, index) => ({
      ...sow,
      id: index + 1,
    }));
    setSowList(reIndexedSowList);
  };

  // Handle SOW input changes for bundling
  const handleSowInputChange = (id, field, value) => {
    const updatedSowList = sowList.map((sow) =>
      sow.id === id ? { ...sow, [field]: value } : sow
    );
    setSowList(updatedSowList);
  };

  // Submit the project to Firestore
  const handleSubmit = async (e) => {
    e.preventDefault();

    const projectData = {
      source,
      projectName,
      projectStatus,
      date: startDate ? startDate : new Date(), // Ensure there's a valid date or use the current date
      quarter,
      brandCategory,
      platform: platform === "Apa kek" ? customPlatform : platform, // Custom platform handling
      sow: sowType === 'bundling' ? sowList : sowType, // Include bundling SOWs or custom SOW
      link,
      division,
    };

    try {
      await addDoc(collection(db, "Projects"), projectData); // Add project to Firestore
      onClose(); // Close modal after submission

      // Reset form fields after successful submission
      setSource('');
      setProjectName('');
      setProjectStatus('');
      setStartDate(null);
      setQuarter('');
      setBrandCategory('');
      setPlatform('');
      setCustomPlatform(''); // Reset custom platform
      setSowType('');
      setSowList([{ id: 1, sow: '', content: '' }]); // Reset SOW list
      setLink('');
      setDivision('');
    } catch (error) {
      console.error('Error adding project:', error);
    }
  }


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto relative shadow-lg">
        {/* X button to close the modal */}
        <button onClick={onClose} className="absolute top-4 right-4 text-red-500 hover:text-red-700">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-xl font-semibold mb-4">Add Project</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Source */}
          <div>
            <label className="block font-semibold">Source</label>
            <select
              value={source}
              onChange={(e) => setSource(e.target.value)}
              className="border border-gray-300 p-2 rounded w-full"
              required
            >
              <option value="">Choose one</option>
              <option value="Inbound">Inbound</option>
              <option value="Outbound">Outbound</option>
            </select>
          </div>

          {/* Project Name */}
          <div>
            <label className="block font-semibold">Project Name</label>
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="Enter project name"
              className="border border-gray-300 p-2 rounded w-full"
              required
            />
          </div>

          {/* Project Status and Date */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold">Project Status</label>
              <select
                value={projectStatus}
                onChange={(e) => setProjectStatus(e.target.value)}
                className="border border-gray-300 p-2 rounded w-full"
                required
              >
                <option value="">Choose one</option>
                <option value="Development">Development</option>
                <option value="Content Proposal">Content Proposal</option>
                <option value="Ongoing">Ongoing</option>
                <option value="Editing">Editing</option>
                <option value="Delivered">Delivered</option>
                <option value="Published">Published</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold">Date</label>
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                placeholderText="Enter date"
                className="border border-gray-300 p-2 rounded w-full"
                required
              />
            </div>
          </div>

          {/* Quarter */}
          <div>
            <label className="block font-semibold">Quarter</label>
            <select
              value={quarter}
              onChange={(e) => setQuarter(e.target.value)}
              className="border border-gray-300 p-2 rounded w-full"
              required
            >
              <option value="">Choose one</option>
              <option value="Q1">Q1</option>
              <option value="Q2">Q2</option>
              <option value="Q3">Q3</option>
              <option value="Q4">Q4</option>
            </select>
          </div>

          {/* Brand Category */}
          <div>
            <label className="block font-semibold">Brand Category</label>
            <input
              type="text"
              value={brandCategory}
              onChange={(e) => setBrandCategory(e.target.value)}
              placeholder="Enter brand category"
              className="border border-gray-300 p-2 rounded w-full"
              required
            />
          </div>

          {/* Platform */}
          <div>
            <label className="block font-semibold">Platform</label>
            <div className="flex flex-col space-y-2">
              {["Instagram", "Tik Tok", "Youtube", "Website", "Apa kek"].map((plat) => (
                <label key={plat} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="platform"
                    value={plat}
                    checked={platform === plat}
                    onChange={() => setPlatform(plat)}
                    className="form-radio"
                  />
                  <span>{plat}</span>
                </label>
              ))}
            </div>
            {/* Custom Platform */}
            {platform === "Apa kek" && (
              <input
                type="text"
                value={customPlatform}
                onChange={(e) => setCustomPlatform(e.target.value)}
                placeholder="Enter custom platform"
                className="border border-gray-300 p-2 rounded w-full mt-2"
              />
            )}
          </div>

          {/* SOW */}
          <div>
            <label className="block font-semibold">SOW</label>
            <select
              value={sowType}
              onChange={handleSowChange}
              className="border border-gray-300 p-2 rounded w-full"
              required
            >
              <option value="">Choose one</option>
              <option value="bundling">Bundling</option>
              <option value="custom">Custom</option>
            </select>
          </div>

          {/* Custom SOW Field */}
          {isSowCustom && (
            <div>
              <input
                ref={sowInputRef}
                type="text"
                value={sowList[0].sow}
                onChange={(e) => handleSowInputChange(1, 'sow', e.target.value)}
                placeholder="Enter custom SOW"
                className="border border-gray-300 p-2 rounded w-full"
                required
              />
            </div>
          )}

          {/* Bundling SOW fields */}
          {sowType === 'bundling' && (
            <div>
              {sowList.map((sowItem) => (
                <div key={sowItem.id} className="mb-4">
                  <div className="flex justify-between items-center">
                    <label className="font-semibold">
                      SOW {sowItem.id}
                    </label>
                    {sowList.length > 1 && (
                      <button
                        type="button"
                        className="text-red-500 hover:text-red-700"
                        onClick={() => removeSowField(sowItem.id)}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    value={sowItem.sow}
                    onChange={(e) => handleSowInputChange(sowItem.id, 'sow', e.target.value)}
                    placeholder="Enter SOW"
                    className="border border-gray-300 p-2 rounded w-full mb-2"
                    required
                  />
                  <input
                    type="text"
                    value={sowItem.content}
                    onChange={(e) => handleSowInputChange(sowItem.id, 'content', e.target.value)}
                    placeholder="Enter Content"
                    className="border border-gray-300 p-2 rounded w-full"
                    required
                  />
                </div>
              ))}
              <button
                type="button"
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg"
                onClick={addSowField}
              >
                + Add Another SOW
              </button>
            </div>
          )}

          {/* Division */}
          <div>
            <label className="block font-semibold">Division</label>
            <select
              value={division}
              onChange={(e) => setDivision(e.target.value)}
              className="border border-gray-300 p-2 rounded w-full"
              required
            >
              <option value="">Choose one</option>
              <option value="Marketing">Marketing</option>
              <option value="Community">Community</option>
            </select>
          </div>

          {/* Link */}
          <div>
            <label className="block font-semibold">Link</label>
            <input
              type="url"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="Enter link"
              className="border border-gray-300 p-2 rounded w-full"
            />
          </div>

          {/* Submit Button */}
          <button type="submit" className="w-full bg-black text-white py-2 rounded-lg mt-4">
            Add Project
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProject
