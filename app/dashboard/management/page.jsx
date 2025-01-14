'use client'

import CategoryTable from "@/components/management/CategoryTable";
import Error from "next/error";
import { useEffect, useState } from "react";

function Management() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories");
        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }
        const data = await response.json();

        //  Map data to include the docRef
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

    fetchCategories();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-lg font-bold mb-4">Management</h1>
      {loading ? (
        <p>Loading categories...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : (
        <CategoryTable categories={categories} />
      )}
    </div>
  );
}

export default Management;
