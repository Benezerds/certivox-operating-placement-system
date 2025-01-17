import React, { useEffect, useState } from "react";
import { format, isValid } from "date-fns";
import { getDoc } from "firebase/firestore";

const ExportCSV = ({ projects, setNotification }) => {
  const [resolvedProjects, setResolvedProjects] = useState([]);

  // Resolve project data (e.g., category names) before export
  useEffect(() => {
    const resolveProjectData = async () => {
      const updatedProjects = await Promise.all(
        projects.map(async (project) => {
          let categoryName = "N/A";
          if (project.category) {
            try {
              const categoryDoc = await getDoc(project.category); // Fetch Firestore reference
              if (categoryDoc.exists()) {
                categoryName = categoryDoc.data().category_name || "N/A"; // Use the category name
              }
            } catch (error) {
              console.error("Error fetching category:", error);
            }
          }

          // Normalize platforms and links
          const platforms = Array.isArray(project.platform)
            ? project.platform
            : project.platform
            ? [project.platform]
            : [];

          const platformLinks = platforms.map(
            (platform) => project.platformLink?.[platform] || "N/A"
          );

          return {
            ...project,
            category: categoryName,
            platforms, // Normalize platforms as an array
            platformLinks, // Array of corresponding links
          };
        })
      );
      setResolvedProjects(updatedProjects);
    };

    resolveProjectData();
  }, [projects]);

  const handleExportCSV = () => {
    if (!resolvedProjects || resolvedProjects.length === 0) {
      setNotification({ message: "No data available to export.", visible: true });
      setTimeout(() => setNotification({ message: "", visible: false }), 3000);
      return;
    }

    // Find the maximum number of platforms used in any project
    const maxPlatforms = Math.max(
      ...resolvedProjects.map((project) => project.platforms.length)
    );

    // Dynamically generate platform headers and link headers
    const platformHeaders = Array.from(
      { length: maxPlatforms },
      (_, index) => `Platform ${index + 1}`
    );
    const linkHeaders = Array.from(
      { length: maxPlatforms },
      (_, index) => `Link ${index + 1}`
    );

    // Headers for the CSV
    const headers = [
      "Source",
      "Project",
      "Status",
      "Date",
      "Quarter",
      "Category",
      "Brand",
      ...platformHeaders, // Add platform headers dynamically
      ...linkHeaders, // Add link headers dynamically
      "SOW",
      "Division",
    ];

    // Generate rows for the CSV
    const rows = resolvedProjects.map((project) => {
      // Fill platforms and links dynamically
      const platformColumns = Array.from(
        { length: maxPlatforms },
        (_, index) => project.platforms[index] || "N/A"
      );
      const linkColumns = Array.from(
        { length: maxPlatforms },
        (_, index) => project.platformLinks[index] || "N/A"
      );

      return [
        project.source || "N/A",
        project.projectName || "N/A",
        project.projectStatus || "N/A",
        project.date
          ? isValid(new Date(project.date))
            ? format(new Date(project.date), "yyyy-MM-dd")
            : "Invalid Date"
          : "N/A",
        project.quarter || "N/A",
        project.category || "N/A",
        project.brand || "N/A",
        ...platformColumns, // Add dynamic platform columns
        ...linkColumns, // Add dynamic link columns
        Array.isArray(project.sow)
          ? project.sow
              .map((sowItem) => `${sowItem?.sow || "N/A"}: ${sowItem?.content || "N/A"}`)
              .join("; ")
          : typeof project.sow === "object" && project.sow !== null
          ? `${project.sow?.sow || "N/A"}: ${project.sow?.content || "N/A"}`
          : project.sow || "N/A",
        project.division || "N/A",
      ];
    });

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "projects.csv");
    document.body.appendChild(link); // Required for Firefox
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button
      onClick={handleExportCSV}
      className="px-4 py-2 bg-gray-200 rounded-lg"
    >
      Export CSV
    </button>
  );
};

export default ExportCSV;