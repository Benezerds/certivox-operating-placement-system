import React, { useState, useEffect, useRef } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const AddProject = ({ onClose }) => {
  const [source, setSource] = useState('');
  const [projectName, setProjectName] = useState('');
  const [projectStatus, setProjectStatus] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [quarter, setQuarter] = useState('');
  const [brandCategory, setBrandCategory] = useState('');
  const [platform, setPlatform] = useState('');
  const [sow, setSow] = useState(''); // State to store the SOW value
  const [isSowCustom, setIsSowCustom] = useState(false); // State to toggle between dropdown and input
  const [link, setLink] = useState('');
  const [division, setDivision] = useState('');

  const sowInputRef = useRef(null); // Ref for the SOW input field

  // Handle SOW dropdown changes
  const handleSowChange = (e) => {
    const value = e.target.value;
    if (value === 'custom') {
      setIsSowCustom(true); // Switch to input field for custom SOW
      setSow(''); // Reset SOW value
    } else {
      setIsSowCustom(false); // Switch back to dropdown
      setSow(value);
    }
  };

  // Click outside the SOW input field to revert to dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isSowCustom && sowInputRef.current && !sowInputRef.current.contains(e.target)) {
        setIsSowCustom(false); // Revert to dropdown
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside); // Cleanup event listener
    };
  }, [isSowCustom]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const projectData = {
      source,
      projectName,
      projectStatus,
      startDate,
      quarter,
      brandCategory,
      platform,
      sow,
      link,
      division,
    };

    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectData),
      });

      if (response.ok) {
        // Reset form on successful submission
        setSource('');
        setProjectName('');
        setProjectStatus('');
        setStartDate(null);
        setQuarter('');
        setBrandCategory('');
        setPlatform('');
        setSow('');
        setLink('');
        setDivision('');
        setIsSowCustom(false); // Reset custom SOW
        onClose();
      } else {
        console.error('Failed to add project');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

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
          </div>

          {/* SOW */}
          <div>
            <label className="block font-semibold">SOW</label>
            {isSowCustom ? (
              <input
                ref={sowInputRef} // Reference for the SOW input
                type="text"
                value={sow}
                onChange={(e) => setSow(e.target.value)}
                placeholder="Enter custom SOW"
                className="border border-gray-300 p-2 rounded w-full"
                required
              />
            ) : (
              <select
                value={sow}
                onChange={handleSowChange}
                className="border border-gray-300 p-2 rounded w-full"
                required
              >
                <option value="">Choose one</option>
                <option value="bundling">Bundling</option>
                <option value="custom">KETIK LAH CULUN AMAT</option>
              </select>
            )}
          </div>

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

export default AddProject;
