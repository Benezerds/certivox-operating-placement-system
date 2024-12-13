// AddProjectForm.jsx
import React, { useState, useRef } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { addDoc, collection } from "firebase/firestore";
import { db } from '@/app/firebase';

const AddProjectForm = ({ onClose }) => {
  const [source, setSource] = useState('');
  const [projectName, setProjectName] = useState('');
  const [projectStatus, setProjectStatus] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [quarter, setQuarter] = useState('');
  const [Category, setCategory] = useState('');
  const [brand, setBrand] = useState('');
  const [platform, setPlatform] = useState('');
  const [customPlatform, setCustomPlatform] = useState('');
  const [sowType, setSowType] = useState('');
  const [isSowCustom, setIsSowCustom] = useState(false);
  const [link, setLink] = useState('');
  const [division, setDivision] = useState('');
  const [sowList, setSowList] = useState([{ id: 1, sow: '', content: '' }]);

  const sowInputRef = useRef(null);

  const handleSowChange = (e) => {
    const value = e.target.value;
    setSowType(value);
    setIsSowCustom(value === 'custom');
    if (value !== 'custom') {
      setSowList([{ id: 1, sow: '', content: '' }]);
    }
  };

  const addSowField = () => {
    const newSowId = sowList.length + 1;
    setSowList([...sowList, { id: newSowId, sow: '', content: '' }]);
  };

  const removeSowField = (id) => {
    const updatedSowList = sowList.filter((sow) => sow.id !== id);
    const reIndexedSowList = updatedSowList.map((sow, index) => ({
      ...sow,
      id: index + 1,
    }));
    setSowList(reIndexedSowList);
  };

  const handleSowInputChange = (id, field, value) => {
    const updatedSowList = sowList.map((sow) =>
      sow.id === id ? { ...sow, [field]: value } : sow
    );
    setSowList(updatedSowList);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const projectData = {
      source,
      projectName,
      projectStatus,
      date: startDate || new Date(),
      quarter,
      Category,
      brand,
      platform: platform === "Apa kek" ? customPlatform : platform,
      sow:
        sowType === 'bundling'
          ? sowList
          : sowType === 'custom'
          ? sowList[0].sow // Retrieve the first custom SOW value
          : sowType,
      link,
      division,
    };

    try {
      await addDoc(collection(db, "Projects"), projectData);
      onClose();
  
      setSource('');
      setProjectName('');
      setProjectStatus('');
      setStartDate(null);
      setQuarter('');
      setCategory('');
      setBrand('');
      setPlatform('');
      setCustomPlatform('');
      setSowType('');
      setSowList([{ id: 1, sow: '', content: '' }]);
      setLink('');
      setDivision('');
    } catch (error) {
      console.error('Error adding project:', error);
    }
  };

  return (
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

      {/* Quarters */}
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

      {/* Category */}
      <div>
        <label className="block font-semibold">Category</label>
        <input
          type="text"
          value={Category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Enter category"
          className="border border-gray-300 p-2 rounded w-full"
          required
        />
      </div>

      {/* Brand*/}
      <div>
        <label className="block font-semibold">Brand</label>
        <input
          type="text"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          placeholder="Enter brand"
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
  );
}

export default AddProjectForm;