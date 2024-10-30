"use client";

import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Cell, ResponsiveContainer, LabelList } from 'recharts';
import { collection, onSnapshot, doc, getDoc } from "firebase/firestore";
import { db } from '@/app/firebase';
import { startOfYear, startOfMonth, startOfWeek, subYears, subMonths, subWeeks, isWithinInterval } from 'date-fns';

const FilterableBarChart = () => {
  const [selectedFilter, setSelectedFilter] = useState('year'); // default to "year"
  const [totalProjects, setTotalProjects] = useState(0);
  const [percentageChange, setPercentageChange] = useState(0);
  const [data, setData] = useState([]);

  // Function to filter projects within a given start and end date range
  const filterProjectsByDate = (projects, startDate, endDate) => {
    return projects.filter((project) => {
      const projectDate = project.date.toDate(); // Convert Firestore timestamp to Date object
      return isWithinInterval(projectDate, { start: startDate, end: endDate });
    });
  };

  const calculatePeriodTotals = (projects) => {
    const today = new Date();

    // Define current period start and previous period start
    let startOfCurrentPeriod, startOfPreviousPeriod, endOfPreviousPeriod;

    if (selectedFilter === 'year') {
      startOfCurrentPeriod = startOfYear(today);
      startOfPreviousPeriod = startOfYear(subYears(today, 1));
      endOfPreviousPeriod = subYears(today, 1);
    } else if (selectedFilter === 'monthly') {
      startOfCurrentPeriod = startOfMonth(today);
      startOfPreviousPeriod = startOfMonth(subMonths(today, 1));
      endOfPreviousPeriod = subMonths(today, 1);
    } else if (selectedFilter === 'weekly') {
      startOfCurrentPeriod = startOfWeek(today, { weekStartsOn: 1 });
      startOfPreviousPeriod = startOfWeek(subWeeks(today, 1), { weekStartsOn: 1 });
      endOfPreviousPeriod = subWeeks(today, 1);
    }

    // Filter projects for current and previous periods
    const currentPeriodProjects = filterProjectsByDate(projects, startOfCurrentPeriod, today);
    const previousPeriodProjects = filterProjectsByDate(projects, startOfPreviousPeriod, endOfPreviousPeriod);

    // Calculate totals for current and previous periods
    const currentTotal = currentPeriodProjects.length;
    const previousTotal = previousPeriodProjects.length;

    return { currentTotal, previousTotal, currentPeriodProjects };
  };

  useEffect(() => {
    const fetchProjectsData = () => {
      const unsubscribe = onSnapshot(collection(db, "Projects"), async (snapshot) => {
        const projects = [];

        for (const docSnapshot of snapshot.docs) {
          const projectData = docSnapshot.data();

          let categoryName = "Unknown"; // Default name if category fetch fails
          if (projectData.category) {
            try {
              const categoryRef = typeof projectData.category === "string" 
                ? doc(db, projectData.category)
                : projectData.category;

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

        // Calculate current and previous period totals based on selected filter
        const { currentTotal, previousTotal, currentPeriodProjects } = calculatePeriodTotals(projects);

        // Update total projects and calculate percentage change
        setTotalProjects(currentTotal);
        const percentageChange = previousTotal > 0 
          ? ((currentTotal - previousTotal) / previousTotal) * 100
          : 0;
        setPercentageChange(percentageChange);

        // Aggregate project counts by category for the current period
        const categoryCounts = currentPeriodProjects.reduce((acc, project) => {
          acc[project.category] = (acc[project.category] || 0) + 1;
          return acc;
        }, {});

        // Convert aggregated data to array format and take top 5 categories
        const topFiveData = Object.entries(categoryCounts)
          .map(([name, value]) => ({ name, value }))
          .sort((a, b) => b.value - a.value)
          .slice(0, 5);

        setData(topFiveData);
      });

      return unsubscribe;
    };

    const unsubscribe = fetchProjectsData();

    return () => unsubscribe();
  }, [selectedFilter]);

  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-lg">
      <h2 className="text-xl font-semibold mb-2">Projects by Brand Category</h2>
      <div className="flex items-center mb-2">
        <span className="text-4xl font-bold mr-2">{totalProjects}</span>
        <span className={`text-lg font-medium ${percentageChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
          {percentageChange >= 0 ? `+${percentageChange.toFixed(2)}%` : `${percentageChange.toFixed(2)}%`}
        </span>
      </div>
      <div className="text-gray-500 mb-4">1 {selectedFilter.charAt(0).toUpperCase() + selectedFilter.slice(1)}</div>

      {/* Filter Buttons */}
      <div className="flex space-x-2 mb-4">
        {['year', 'monthly', 'weekly'].map((filter) => (
          <button
            key={filter}
            onClick={() => setSelectedFilter(filter)}
            className={`px-4 py-2 rounded ${
              selectedFilter === filter ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            {filter === 'year' ? 'Year to Date' : filter.charAt(0).toUpperCase() + filter.slice(1)}
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
