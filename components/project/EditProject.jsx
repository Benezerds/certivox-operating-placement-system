import React, { useState, useEffect } from "react";
import { format, parseISO, isValid } from "date-fns";
import { doc, updateDoc, collection, getDocs } from "firebase/firestore";
import { db } from "@/app/firebase";

const EditProject = ({ project, onClose }) => {
  const [source, setSource] = useState("");
  const [projectName, setProjectName] = useState("");
  const [projectStatus, setProjectStatus] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [quarter, setQuarter] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [brand, setBrand] = useState("");
  const [platform, setPlatform] = useState("");
  const [customPlatform, setCustomPlatform] = useState("");
  const [sowType, setSowType] = useState("");
  const [isSowCustom, setIsSowCustom] = useState(false);
  const [link, setLink] = useState("");
  const [division, setDivision] = useState("");
  const [customSow, setCustomSow] = useState("");
  const [bundlingSowList, setBundlingSowList] = useState([{ id: 1, sow: "", content: "" }]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoryCollection = collection(db, "Categories");
        const categorySnapshot = await getDocs(categoryCollection);
        const categoryList = categorySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCategories(categoryList);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
  
    fetchCategories();
  
    if (project) {
      const validDate = project.date && isValid(new Date(project.date))
        ? format(new Date(project.date), "yyyy-MM-dd")
        : "";
  
      setSource(project.source || "");
      setProjectName(project.projectName || "");
      setProjectStatus(project.projectStatus || "");
      setStartDate(validDate);
      setQuarter(project.quarter || "");
  
      // Ensure the category ID is set correctly
      setCategory (project.category || "");
  
      setBrand(project.brand || "");
      setPlatform(project.platform || "");
      setCustomPlatform(project.platform === "Apa kek" ? project.customPlatform || "" : "");
  
      if (typeof project.sow === "string") {
        setSowType("custom");
        setIsSowCustom(true);
        setCustomSow(project.sow);
      } else if (Array.isArray(project.sow)) {
        setSowType("bundling");
        setIsSowCustom(false);
        setBundlingSowList(project.sow);
      } else {
        setSowType("");
        setIsSowCustom(false);
        setBundlingSowList([{ id: 1, sow: "", content: "" }]);
      }
  
      setLink(project.link || "");
      setDivision(project.division || "");
    }
  }, [project]);
  

  const handleSowChange = (e) => {
    const value = e.target.value;
    setSowType(value);
    setIsSowCustom(value === "custom");
    if (value !== "custom") {
      setCustomSow("");
    } else {
      setBundlingSowList([{ id: 1, sow: "", content: "" }]);
    }
  };

  const handleBundlingSowInputChange = (id, field, value) => {
    const updatedSowList = bundlingSowList.map((sow) =>
      sow.id === id ? { ...sow, [field]: value } : sow
    );
    setBundlingSowList(updatedSowList);
  };

  const addBundlingSowField = () => {
    const newSowId = bundlingSowList.length + 1;
    setBundlingSowList([...bundlingSowList, { id: newSowId, sow: "", content: "" }]);
  };

  const removeBundlingSowField = (id) => {
    const updatedSowList = bundlingSowList.filter((sow) => sow.id !== id);
    const reIndexedSowList = updatedSowList.map((sow, index) => ({
      ...sow,
      id: index + 1,
    }));
    setBundlingSowList(reIndexedSowList);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const categoryRef = category ? doc(db, "Categories", category) : null;

    const projectData = {
      source,
      projectName,
      projectStatus,
      date: startDate ? format(parseISO(startDate), "yyyy-MM-dd'T'HH:mm:ssXXX") : null, // Convert to ISO string
      quarter,
      category: categoryRef,
      brand,
      platform: platform === "Apa kek" ? customPlatform : platform,
      sow: sowType === "bundling" ? bundlingSowList : sowType === "custom" ? customSow : sowType,
      link,
      division,
    };

    try {
      const projectRef = doc(db, "Projects", project.id);
      await updateDoc(projectRef, projectData);
  
      // Update the project prop to reflect the changes
      onClose(projectData); // Pass the updated project back to the parent
      console.log("Project updated successfully:", projectData);
    } catch (error) {
      console.error("Error updating project:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto relative shadow-lg">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-red-500 hover:text-red-700"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <h2 className="text-xl font-semibold mb-4">Edit Project</h2>

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
              <input
                type="date"
                value={startDate}
                className="border border-gray-300 p-2 rounded w-full bg-gray-200 text-gray-600 cursor-not-allowed"
                min="2000-01-01" // Minimum date
                max={format(new Date(), "yyyy-MM-dd")} // Maximum date is today
                readOnly // Makes the field uneditable
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

          {/* Category */}
          <div>
            <label className="block font-semibold">Category</label>
            <select
              value={category} // Ensure the value is bound to the category state
              onChange={(e) => setCategory(e.target.value)}
              className="border border-gray-300 p-2 rounded w-full"
              required
            >
              <option value="">Choose one</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.category_name} {/* Ensure the category_name is the correct field */}
                </option>
              ))}
            </select>
          </div>





          {/* Brand */}
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

          {isSowCustom && (
            <div>
              <input
                type="text"
                value={customSow}
                onChange={(e) => setCustomSow(e.target.value)}
                placeholder="Enter custom SOW"
                className="border border-gray-300 p-2 rounded w-full"
              />
            </div>
          )}

          {!isSowCustom && sowType === "bundling" && (
            <div>
              {bundlingSowList.map((sowItem, idx) => (
                <div key={idx} className="mb-4">
                  <div className="flex justify-between items-center">
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
                    onChange={(e) => handleBundlingSowInputChange(sowItem.id, "sow", e.target.value)}
                    placeholder="Enter SOW"
                    className="border border-gray-300 p-2 rounded w-full mb-2"
                  />
                  <input
                    type="text"
                    value={sowItem.content}
                    onChange={(e) => handleBundlingSowInputChange(sowItem.id, "content", e.target.value)}
                    placeholder="Enter Content"
                    className="border border-gray-300 p-2 rounded w-full"
                  />
                </div>
              ))}
              <button
                type="button"
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
                onClick={addBundlingSowField}
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

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Update Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProject;
