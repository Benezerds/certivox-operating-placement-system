import React, { useState } from "react";

const AddCategoryForm = ({ categories }) => {
  const [category_name, setName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/categories/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category_name }),
      });

      if (response.ok) {
        setName(""); // Clear form
        onCategoryAdded(); // Refresh category list
      } else {
        console.error("Failed to add category");
      }
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block font-semibold">Category Name</label>
        <input
          type="text"
          value={category_name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter category name"
          className="border border-gray-300 p-2 rounded w-full"
          required
        />
      </div>
      <button
        type="submit"
        className="bg-blue-500 text-white py-2 px-4 rounded"
      >
        Add Category
      </button>
    </form>
  );
};

export default AddCategoryForm;
