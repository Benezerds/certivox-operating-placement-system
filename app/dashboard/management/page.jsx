"use client";

import React, { useState, useEffect } from "react";
import CategoryTable from "@/components/management/CategoryTable";
import AddCategoryForm from "@/components/management/AddCategoryForm";
import EditCategoryForm from "@/components/management/EditCategoryForm";

function Management() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  // Fetch categories from the API
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/categories");
      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }
      const data = await response.json();

      // Map data to include the docRef
      const formattedCategories = data.map((item, index) => ({
        docRef: `category${index + 1}`,
        ...item,
      }));
      setCategories(formattedCategories);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle deletion
  const handleDelete = async (docRef) => {
    try {
      const response = await fetch(`/api/categories/${docRef}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setCategories(categories.filter((cat) => cat.docRef !== docRef));
      } else {
        console.error("Failed to delete category");
      }
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  // Fetch categories on initial render
  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="h-screen p-8">
      <h1 className="mb-6 text-2xl font-semibold">Category Management</h1>

      {/* Add New Category Button */}
      <button
        onClick={() => setShowAddForm(true)}
        className="px-4 py-2 mb-4 text-white bg-black rounded-lg"
      >
        + New Category
      </button>

      {/* Add Category Form */}
      {showAddForm && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Add New Category</h2>
          <AddCategoryForm
            onCategoryAdded={(newCategory) => {
              setCategories((prevCategories) => [
                ...prevCategories,
                {
                  docRef: `category${prevCategories.length + 1}`,
                  ...newCategory,
                },
              ]);
              setShowAddForm(false); // Hide form after addition
            }}
          />
        </div>
      )}

      {/* Edit Category Form */}
      {editingCategory && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Edit Category</h2>
          <EditCategoryForm
            category={editingCategory}
            onCategoryUpdated={async () => {
              await fetchCategories();
              setEditingCategory(null); // Hide edit form after update
            }}
            onCancel={() => setEditingCategory(null)} // Cancel edit
          />
        </div>
      )}

      {/* Categories Table */}
      {loading ? (
        <p>Loading categories...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : (
        <CategoryTable
          categories={categories}
          onEdit={setEditingCategory}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}

export default Management;
