'use client';

import BarChartComparison from '@/components/comparison/BarChartComparison';
import React, { useState, useEffect } from 'react';

const Comparison = () => {
  const [categories, setCategories] = useState([]);
  const [category1, setCategory1] = useState(null);
  const [category2, setCategory2] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch Categories data
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        const data = await response.json();
        setCategories(data); // Assume API returns an array of categories
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="container px-4 py-8 mx-auto">
      <h1 className="mb-6 text-3xl font-bold text-center text-gray-800">Category Comparison</h1>

      {loading ? (
        <p className="text-center text-gray-500">Loading categories...</p>
      ) : (
        <>
          {/* Category Selection */}
          <div className="grid grid-cols-1 gap-6 mb-8 sm:grid-cols-2">
            <div>
              <h3 className="mb-2 text-lg font-semibold text-gray-700">Select Category 1</h3>
              <select
                className="w-full p-2 text-gray-700 border rounded-lg"
                value={category1?.id || ''}
                onChange={(e) =>
                  setCategory1(
                    categories.find((category) => category.id === e.target.value)
                  )
                }
              >
                <option value="" disabled>
                  Choose a category
                </option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.category_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <h3 className="mb-2 text-lg font-semibold text-gray-700">Select Category 2</h3>
              <select
                className="w-full p-2 text-gray-700 border rounded-lg"
                value={category2?.id || ''}
                onChange={(e) =>
                  setCategory2(
                    categories.find((category) => category.id === e.target.value)
                  )
                }
              >
                <option value="" disabled>
                  Choose a category
                </option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.category_name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Comparison Charts */}
          {category1 && category2 ? (
            <div className="space-y-8">
              <BarChartComparison category1={category1} category2={category2} />
            </div>
          ) : (
            <p className="text-center text-gray-500">
              Please select both categories to see the comparison.
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default Comparison;
