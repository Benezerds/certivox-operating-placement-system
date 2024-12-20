import React, { useState, useEffect } from "react";

const EditProject = ({ project, onClose }) => {
  const [formData, setFormData] = useState({
    source: "",
    projectName: "",
    projectStatus: "",
    date: "",
    quarter: "",
    category: "",
    brand: "",
    platform: "",
    sow: "",
    division: "",
    link: "",
  });

  useEffect(() => {
    if (project) {
      setFormData({
        source: project.source || "",
        projectName: project.projectName || "",
        projectStatus: project.projectStatus || "",
        date: project.date || "",
        quarter: project.quarter || "",
        category: project.category || "",
        brand: project.brand || "",
        platform: project.platform || "",
        sow: project.sow || "",
        division: project.division || "",
        link: project.link || "",
      });
    }
  }, [project]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!project.id) {
      console.error("Project ID is missing. Cannot save changes.");
      return;
    }

    try {
      const projectRef = doc(db, "Projects", project.id); // Reference to the specific project
      await updateDoc(projectRef, {
        ...formData,
        date: formData.date || new Date(), // Ensure the date is saved correctly
      });

      console.log("Project updated successfully:", formData);
      onClose(); // Close the modal after saving
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

        {/* Form */}
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
        >
          {/* Source */}
          <div>
            <label className="block font-semibold">Source</label>
            <select
              name="source"
              value={formData.source}
              onChange={handleChange}
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
              name="projectName"
              value={formData.projectName}
              onChange={handleChange}
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
                name="projectStatus"
                value={formData.projectStatus}
                onChange={handleChange}
                className="border border-gray-300 p-2 rounded w-full"
                required
              >
                <option value="">Choose one</option>
                <option value="Planning">Planning</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold">Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="border border-gray-300 p-2 rounded w-full"
                required
              />
            </div>
          </div>

          {/* Quarter */}
          <div>
            <label className="block font-semibold">Quarter</label>
            <select
              name="quarter"
              value={formData.quarter}
              onChange={handleChange}
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
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="Enter category"
              className="border border-gray-300 p-2 rounded w-full"
              required
            />
          </div>

          {/* Brand */}
          <div>
            <label className="block font-semibold">Brand</label>
            <input
              type="text"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              placeholder="Enter brand"
              className="border border-gray-300 p-2 rounded w-full"
              required
            />
          </div>

          {/* Platform */}
          <div>
            <label className="block font-semibold">Platform</label>
            <select
              name="platform"
              value={formData.platform}
              onChange={handleChange}
              className="border border-gray-300 p-2 rounded w-full"
              required
            >
              <option value="">Choose one</option>
              <option value="Instagram">Instagram</option>
              <option value="TikTok">TikTok</option>
              <option value="YouTube">YouTube</option>
              <option value="Website">Website</option>
            </select>
          </div>

          {/* SOW */}
          <div>
            <label className="block font-semibold">SOW (Statement of Work)</label>
            <textarea
              name="sow"
              value={formData.sow}
              onChange={handleChange}
              rows="3"
              className="border border-gray-300 p-2 rounded w-full"
              placeholder="Enter SOW details"
            ></textarea>
          </div>

          {/* Division */}
          <div>
            <label className="block font-semibold">Division</label>
            <input
              type="text"
              name="division"
              value={formData.division}
              onChange={handleChange}
              placeholder="Enter division"
              className="border border-gray-300 p-2 rounded w-full"
              required
            />
          </div>

          {/* Link */}
          <div>
            <label className="block font-semibold">Link</label>
            <input
              type="url"
              name="link"
              value={formData.link}
              onChange={handleChange}
              placeholder="Enter link"
              className="border border-gray-300 p-2 rounded w-full"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 mt-6">
            <button
              type="submit"
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Save
            </button>
            <button
              type="button"
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProject;
