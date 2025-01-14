import React from "react";

const CategoryTable = ({ categories, onEdit, onDelete }) => {
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
                {category.category_name}
              </td>
              <td className="px-6 py-3 text-sm text-gray-600">
                <button
                  onClick={() => onEdit(category)}
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
