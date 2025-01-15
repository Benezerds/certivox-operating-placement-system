'use client';

import BarChartComparison from '@/components/comparison/BarChartComparison';
import ComparisonChart from '@/components/comparison/ComparisonChart';
import React, { useState, useEffect } from 'react';

const Comparison = () => {
  const [projects, setProjects] = useState([]);
  const [project1, setProject1] = useState(null);
  const [project2, setProject2] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch Projects Data from API
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/projects');
        const data = await response.json();
        setProjects(data); // Assume API returns an array of projects
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div className="container px-4 py-8 mx-auto">
      <h1 className="mb-6 text-3xl font-bold text-center text-gray-800">Project Comparison</h1>

      {loading ? (
        <p className="text-center text-gray-500">Loading projects...</p>
      ) : (
        <>
          {/* Project Selection */}
          <div className="grid grid-cols-1 gap-6 mb-8 sm:grid-cols-2">
            <div>
              <h3 className="mb-2 text-lg font-semibold text-gray-700">Select Project 1</h3>
              <select
                className="w-full p-2 text-gray-700 border rounded-lg"
                value={project1?.id || ''}
                onChange={(e) =>
                  setProject1(
                    projects.find((project) => project.id === e.target.value)
                  )
                }
              >
                <option value="" disabled>
                  Choose a project
                </option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.projectName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <h3 className="mb-2 text-lg font-semibold text-gray-700">Select Project 2</h3>
              <select
                className="w-full p-2 text-gray-700 border rounded-lg"
                value={project2?.id || ''}
                onChange={(e) =>
                  setProject2(
                    projects.find((project) => project.id === e.target.value)
                  )
                }
              >
                <option value="" disabled>
                  Choose a project
                </option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.projectName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Comparison Charts */}
          {project1 && project2 ? (
            <div className="space-y-8">
              <ComparisonChart project1={project1} project2={project2} />
              <BarChartComparison project1={project1} project2={project2} />
            </div>
          ) : (
            <p className="text-center text-gray-500">
              Please select both projects to see the comparison.
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default Comparison;
