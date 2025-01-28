import React, { useState, useRef, useEffect } from 'react';
import { format, parseISO, isValid } from "date-fns";
import { addDoc, collection, doc, getDocs } from "firebase/firestore";
import { auth, db } from '@/app/firebase';


const AddProjectForm = ({ onClose }) => {
  const [source, setSource] = useState('');
  const [projectName, setProjectName] = useState('');
  const [projectStatus, setProjectStatus] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [quarter, setQuarter] = useState('');
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState('');
  const [brand, setBrand] = useState('');
  const [platform, setPlatform] = useState('');
  const [customPlatform, setCustomPlatform] = useState('');
  const [platformLink, setPlatformLink] = useState('');
  const [sowType, setSowType] = useState('');
  const [isSowCustom, setIsSowCustom] = useState(false);
  const [division, setDivision] = useState('');
  const [customSow, setCustomSow] = useState('');
  const [bundlingSowList, setBundlingSowList] = useState([{ id: 1, sow: '', content: '' }]);

  // Fetch categories from Firestore
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoryCollection = collection(db, "Categories");
        const categorySnapshot = await getDocs(categoryCollection);
        const categoryList = categorySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCategories(categoryList);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleSowChange = (e) => {
    const value = e.target.value;
    setSowType(value);
    setIsSowCustom(value === 'custom');
    if (value !== 'custom') {
      setCustomSow('');
    } else {
      setBundlingSowList([{ id: 1, sow: '', content: '' }]);
    }
  };
  const handlePlatformChange = (selectedPlatform) => {
    setPlatform((prevPlatforms) => {
      if (prevPlatforms.includes(selectedPlatform)) {
        // Remove platform if already selected
        const updatedPlatforms = prevPlatforms.filter((p) => p !== selectedPlatform);
        const { [selectedPlatform]: _, ...remainingLinks } = platformLink; // Remove link
        setPlatformLink(remainingLinks);
        return updatedPlatforms;
      } else {
        // Add platform if not selected
        return [...prevPlatforms, selectedPlatform];
      }
    });
  };
  const handlePlatformLinkChange = (platformName, link) => {
    setPlatformLink((prevLinks) => ({
      ...prevLinks,
      [platformName]: link,
    }));
  };
  const addBundlingSowField = () => {
    const newSowId = bundlingSowList.length + 1;
    setBundlingSowList([...bundlingSowList, { id: newSowId, sow: '', content: '' }]);
  };

  const removeBundlingSowField = (id) => {
    const updatedSowList = bundlingSowList.filter((sow) => sow.id !== id);
    const reIndexedSowList = updatedSowList.map((sow, index) => ({
      ...sow,
      id: index + 1,
    }));
    setBundlingSowList(reIndexedSowList);
  };

  const handleBundlingSowInputChange = (id, field, value) => {
    const updatedSowList = bundlingSowList.map((sow) =>
      sow.id === id ? { ...sow, [field]: value } : sow
    );
    setBundlingSowList(updatedSowList);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Get the current user's UID
    const user = auth.currentUser;
  
    if (!user) {
      console.error('User is not logged in');
      return;
    }
  
    const uid = user.uid; // Get UID of the currently logged-in user
    console.log("UID: ", uid);
  
    const utcStartDate = startDate ? parseISO(startDate).toISOString() : null;
    const categoryRef = category ? doc(db, "Categories", category) : null;
  
    const projectData = {
      source,
      projectName,
      projectStatus,
      date: utcStartDate,
      quarter,
      category: categoryRef,
      brand,
      platform,
      platformLink,
      sow:
        sowType === 'bundling'
          ? bundlingSowList
          : sowType === 'custom'
          ? customSow
          : sowType,
      division,
    };
  
    try {
      // Send POST request to the API route
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization-UID': uid, // Pass the UID of the logged-in user
        },
        body: JSON.stringify(projectData), // Send the project data
      });
  
      if (!response.ok) {
        throw new Error('Failed to create project');
      }
  
      const result = await response.json(); // Parse the response from the server
      console.log('Project added successfully:', result);
  
      // After successful submission, close the form and reset fields
      onClose();
  
      setSource('');
      setProjectName('');
      setProjectStatus('');
      setStartDate(null);
      setQuarter('');
      setCategory('');
      setCustomCategory('');
      setBrand('');
      setPlatform('');
      setCustomPlatform('');
      setPlatformLink('');
      setSowType('');
      setBundlingSowList([{ id: 1, sow: '', content: '' }]);
      setCustomSow('');
      setDivision('');
      
    } catch (error) {
      console.error('Error adding project:', error); // Handle any errors
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Source */}
      <div>
      <label className="block font-semibold">Source<span style={{ color: 'red' }}>*</span></label>
        <select
          value={source}
          onChange={(e) => setSource(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
          required
        >
          <option value="">Choose one</option>
          <option value="Inbound">Inbound</option>
          <option value="Outbound">Outbound</option>
        </select>
      </div>

      {/* Project Name */}
      <div>
      <label className="block font-semibold">Project Name<span style={{ color: 'red' }}>*</span></label>
        <input
          type="text"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          placeholder="Enter project name"
          className="w-full p-2 border border-gray-300 rounded"
          required
        />
      </div>

      {/* Project Status and Date */}
      <div className="grid grid-cols-2 gap-4">
        <div>
        <label className="block font-semibold">Project Status<span style={{ color: 'red' }}>*</span></label>
          <select
            value={projectStatus}
            onChange={(e) => setProjectStatus(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
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
        <label className="block font-semibold">Date<span style={{ color: 'red' }}>*</span></label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)} // Update state with selected date
            className="w-full p-2 border border-gray-300 rounded"
            required
            min="2000-01-01" // Set minimum date
            max={format(new Date(), "yyyy-MM-dd")}  // Set maximum date to today
          />
        </div>
      </div>

      {/* Quarters */}
      <div>
      <label className="block font-semibold">Quarter<span style={{ color: 'red' }}>*</span></label>
        <select
          value={quarter}
          onChange={(e) => setQuarter(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
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
        <label className="block font-semibold">Category<span style={{ color: 'red' }}>*</span></label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          >
            <option value="">Choose one</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.category_name}</option>
            ))}
          </select>
        </div>

        

      {/* Brand*/}
      <div>
        <label className="block font-semibold">Brand<span style={{ color: 'red' }}>*</span></label>
        <input
          type="text"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          placeholder="Enter brand"
          className="w-full p-2 border border-gray-300 rounded"
          required
        />
      </div>

      {/* Platform */}
      <div>
      <label className="block font-semibold">Platform<span style={{ color: 'red' }}>*</span></label>
        <div className="flex flex-col space-y-2">
          {["Instagram", "Tik Tok", "Youtube", "Website", "Apa kek"].map((plat) => (
            <label key={plat} className="flex items-center space-x-2">
              <input
                type="checkbox"
                value={plat}
                checked={platform.includes(plat)} // Check if platform is selected
                onChange={() => handlePlatformChange(plat)} // Handle platform selection
                className="form-checkbox"
              />
              <span>{plat}</span>
            </label>
          ))}
        </div>
        {platform.length > 0 && (
          <div className="mt-2">
            <label className="block font-semibold">Platform Link  (Optional)</label>
            {platform.map((plat) => (
              <div key={plat} className="mb-2">
                <input
                  type="text"
                  placeholder={`Enter ${plat} link`}
                  value={platformLink[plat] || ""}
                  onChange={(e) => handlePlatformLinkChange(plat, e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
            ))}
          </div>
        )}
      </div>


      {/* SOW */}
      <div>
      <label className="block font-semibold">SOW<span style={{ color: 'red' }}>*</span></label>
        <select
          value={sowType}
          onChange={handleSowChange}
          className="w-full p-2 border border-gray-300 rounded"
          required
        >
          <option value="">Choose one</option>
          <option value="bundling">Bundling</option>
          <option value="custom">Custom</option>
        </select>
      </div>

      {isSowCustom && (
        <div>
          <input
            type="text"
            value={customSow}
            onChange={(e) => setCustomSow(e.target.value)}
            placeholder="Enter custom SOW"
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
      )}

      {!isSowCustom && sowType === 'bundling' && (
        <div>
          {bundlingSowList.map((sowItem, idx) => (
            <div key={idx} className="mb-4">
              <div className="flex items-center justify-between">
                <label className="font-semibold">SOW {sowItem.id}</label>
                {bundlingSowList.length > 1 && (
                  <button
                    type="button"
                    className="text-red-500 hover:text-red-700"
                    onClick={() => removeBundlingSowField(sowItem.id)}
                  >
                    Remove
                  </button>
                )}
              </div>
              <input
                type="text"
                value={sowItem.sow}
                onChange={(e) => handleBundlingSowInputChange(sowItem.id, 'sow', e.target.value)}
                placeholder="Enter SOW"
                className="w-full p-2 mb-2 border border-gray-300 rounded"
                required
              />
              <input
                type="text"
                value={sowItem.content}
                onChange={(e) => handleBundlingSowInputChange(sowItem.id, 'content', e.target.value)}
                placeholder="Enter Content"
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
          ))}
          <button
            type="button"
            className="px-4 py-2 mt-2 text-white bg-blue-500 rounded-lg"
            onClick={addBundlingSowField}
          >
            + Add Another SOW
          </button>
        </div>
      )}

      {/* Division */}
      <div>
      <label className="block font-semibold">Division<span style={{ color: 'red' }}>*</span></label>
        <select
          value={division}
          onChange={(e) => setDivision(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
          required
        >
          <option value="">Choose one</option>
          <option value="Marketing">Marketing</option>
          <option value="Community">Community</option>
        </select>
      </div>

      {/* Submit Button */}
      <button type="submit" className="w-full py-2 mt-4 text-white bg-black rounded-lg">
        Add Project
      </button>
    </form>
  );
};

export default AddProjectForm;
