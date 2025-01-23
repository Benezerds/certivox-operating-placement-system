import React, { useState } from "react";

const CategoryTable = ({ categories, onEdit, onDelete }) => {
  const [editingCategoryId, setEditingCategoryId] = useState(null); // Track the category being edited
  const [editedCategoryName, setEditedCategoryName] = useState(""); // Track the updated name

  const handleEditClick = (category) => {
    setEditingCategoryId(category.docRef); // Set the category to be edited
    setEditedCategoryName(category.category_name); // Set the current category name in the input field
  };

  const handleSaveClick = (category) => {
    // Call the onEdit function and pass the updated category name
    onEdit(category.docRef, editedCategoryName);
    setEditingCategoryId(null); // Reset the editing state
  };

  const handleCancelClick = () => {
    setEditingCategoryId(null); // Cancel editing
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr className="bg-gray-100 border-b">
            <th className="text-left px-6 py-3 font-semibold text-sm text-gray-700">
              No
            </th>
            <th className="text-left px-6 py-3 font-semibold text-sm text-gray-700">
              Category Name
            </th>
            <th className="text-left px-6 py-3 font-semibold text-sm text-gray-700">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category, index) => (
            <tr
              key={category.docRef} // Use docRef as the unique key
              className="border-b hover:bg-gray-50 transition"
            >
              <td className="px-6 py-3 text-sm text-gray-600">{index + 1}</td>
              <td className="px-6 py-3 text-sm text-gray-600">
                {editingCategoryId === category.docRef ? (
                  <input
                    type="text"
                    value={editedCategoryName}
                    onChange={(e) => setEditedCategoryName(e.target.value)}
                    className="border px-2 py-1 rounded"
                  />
                ) : (
                  category.category_name
                )}
              </td>
              <td className="px-6 py-3 text-sm text-gray-600">
                {editingCategoryId === category.docRef ? (
                  <>
                    <button
                      onClick={() => handleSaveClick(category)}
                      className="text-green-500 hover:underline mr-4"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancelClick}
                      className="text-gray-500 hover:underline"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleEditClick(category)}
                      className="text-blue-500 hover:underline mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(category.docRef)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
          {categories.length === 0 && (
            <tr>
              <td
                colSpan="3"
                className="text-center px-6 py-3 text-sm text-gray-500"
              >
                No categories available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CategoryTable;
