import React, { useState } from "react";

const EditCategoryForm = ({ category, onCategoryUpdated, onCancel }) => {
  const [name, setName] = useState(category.name);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/categories/${category.docRef}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      if (response.ok) {
        onCategoryUpdated(); // Refresh category list
        onCancel(); // Close edit form
      } else {
        console.error("Failed to update category");
      }
    } catch (error) {
      console.error("Error updating category:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block font-semibold">Category Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Edit category name"
          className="border border-gray-300 p-2 rounded w-full"
          required
        />
      </div>
      <div className="flex space-x-4">
        <button type="submit" className="bg-green-500 text-white py-2 px-4 rounded">
          Save Changes
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-500 text-white py-2 px-4 rounded"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default EditCategoryForm;
