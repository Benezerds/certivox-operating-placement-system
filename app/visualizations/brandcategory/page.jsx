"use client";

import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Cell, ResponsiveContainer, LabelList } from 'recharts';
import { collection, onSnapshot, doc, getDoc } from "firebase/firestore";
import { db } from '@/app/firebase'; // Adjust path to your Firebase config file
import { format, isSameYear, isSameMonth, isSameWeek } from 'date-fns';

const FilterableBarChart = () => {
  const [selectedFilter, setSelectedFilter] = useState('year'); // default to "year"
  const [totalProjects, setTotalProjects] = useState(0);
  const [data, setData] = useState([]);

  // Function to filter projects by date
  const filterProjectsByDate = (projects) => {
    const today = new Date();

    return projects.filter((project) => {
      const projectDate = project.date.toDate(); // Convert Firestore timestamp to Date object

      if (selectedFilter === 'year') {
        return isSameYear(projectDate, today);
      } else if (selectedFilter === 'month') {
        return isSameMonth(projectDate, today);
      } else if (selectedFilter === 'week') {
        return isSameWeek(projectDate, today, { weekStartsOn: 1 });
      }
      return true;
    });
  };

  useEffect(() => {
    const fetchProjectsData = () => {
      const unsubscribe = onSnapshot(collection(db, "Projects"), async (snapshot) => {
        const projects = [];

        for (const docSnapshot of snapshot.docs) {
          const projectData = docSnapshot.data();

          // If `category` is a path, create a `DocumentReference` from it
          let categoryName = "Unknown"; // Default name if category fetch fails
          if (projectData.category) {
            try {
              const categoryRef = typeof projectData.category === "string" 
                ? doc(db, projectData.category) // Convert path to DocumentReference
                : projectData.category; // Use directly if already a DocumentReference

              const categorySnapshot = await getDoc(categoryRef);
              if (categorySnapshot.exists()) {
                categoryName = categorySnapshot.data().category_name;
              }
            } catch (error) {
              console.error("Error fetching category:", error);
            }
          }

          projects.push({
            category: categoryName,
            date: projectData.date,
          });
        }

        // Filter projects by selected date
        const filteredProjects = filterProjectsByDate(projects);

        // Aggregate project counts by category
        const categoryCounts = filteredProjects.reduce((acc, project) => {
          acc[project.category] = (acc[project.category] || 0) + 1;
          return acc;
        }, {});

        // Convert aggregated data to array format and take top 5 categories
        const topFiveData = Object.entries(categoryCounts)
          .map(([name, value]) => ({ name, value }))
          .sort((a, b) => b.value - a.value)
          .slice(0, 5);

        // Calculate total project count for the filtered period
        const total = topFiveData.reduce((sum, item) => sum + item.value, 0);
        setTotalProjects(total);
        setData(topFiveData);
      });

      return unsubscribe;
    };

    const unsubscribe = fetchProjectsData();

    return () => unsubscribe();
  }, [selectedFilter]); // Re-run useEffect when selectedFilter changes

  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-lg">
      <h2 className="text-xl font-semibold mb-2">Projects by Brand Category</h2>
      <div className="flex items-center mb-2">
        <span className="text-4xl font-bold mr-2">{totalProjects}</span>
        <span className="text-lg font-medium text-green-500">+0%</span> {/* Placeholder for growth rate */}
      </div>
      <div className="text-gray-500 mb-4">1 {selectedFilter}</div>

      {/* Filter Buttons */}
      <div className="flex space-x-2 mb-4">
        {['year', 'month', 'week'].map((filter) => (
          <button
            key={filter}
            onClick={() => setSelectedFilter(filter)}
            className={`px-4 py-2 rounded ${
              selectedFilter === filter ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            {filter.charAt(0).toUpperCase() + filter.slice(1)}
          </button>
        ))}
      </div>

      {/* Bar Chart */}
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} layout="vertical" barCategoryGap="10%">
          <XAxis type="number" domain={[0, 'dataMax + 1']} hide />
          <YAxis dataKey="name" type="category" width={100} tick={{ fill: '#888' }} tickLine={false} />
          <Bar dataKey="value" fill="#E5E7EB" radius={[0, 10, 10, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#D1D5DB' : '#E5E7EB'} />
            ))}
            <LabelList dataKey="value" position="right" offset={10} fill="#333" />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FilterableBarChart;


