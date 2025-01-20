import React, { useState, useEffect } from "react";
import { format, isValid, parseISO } from "date-fns";
import { getDoc, updateDoc, doc } from "firebase/firestore"; // Firestore methods
import { useRouter } from "next/navigation";
import { db } from "@/app/firebase"; // Ensure Firebase config is imported

const ProjectTableNoFunctionality = ({ projects, onDelete, onEdit }) => {
  const [resolvedProjects, setResolvedProjects] = useState([]); // Store processed projects
  const [sortOrder, setSortOrder] = useState("desc"); // Track sorting order (asc/desc)
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState("");
  const [deleteProjectId, setDeleteProjectId] = useState(null);
  const router = useRouter();

  // Process and resolve project data (e.g., resolving category references) and sort by date
  useEffect(() => {
    const resolveProjectData = async () => {
      const updatedProjects = await Promise.all(
        projects.map(async (project) => {
          let categoryName = "N/A"; // Default to "N/A"
          if (typeof project.category === "object" && project.category.id) {
            try {
              const categoryDoc = await getDoc(project.category);
              if (categoryDoc.exists()) {
                categoryName = categoryDoc.data().category_name || "N/A";
              } else {
                categoryName = "Category not found"; // Handle missing category
              }
            } catch (error) {
              console.error("Error fetching category:", error);
              categoryName = "Category not found"; // Handle errors gracefully
            }
          }
          return { ...project, category: categoryName };
        })
      );

      // Sort projects by date (default to descending)
      const sortedProjects = sortProjectsByDate(updatedProjects, "desc");
      setResolvedProjects(sortedProjects);
    };

    resolveProjectData();
  }, [projects]);

  // Sort projects by date (ascending or descending)
  const sortProjectsByDate = (projects, order) => {
    return projects.sort((a, b) => {
      const dateA = isValid(parseISO(a.date)) ? new Date(a.date) : new Date(0);
      const dateB = isValid(parseISO(b.date)) ? new Date(b.date) : new Date(0);
      return order === "asc" ? dateA - dateB : dateB - dateA;
    });
  };

  // Handle sorting toggle
  const toggleSortOrder = () => {
    const newOrder = sortOrder === "asc" ? "desc" : "asc";
    const sortedProjects = sortProjectsByDate(resolvedProjects, newOrder);
    setResolvedProjects(sortedProjects);
    setSortOrder(newOrder);
  };

  // Handle status changes for a project
  const handleStatusChange = async (projectId, newStatus) => {
    try {
      const projectRef = doc(db, "Projects", projectId); // Get Firestore reference
      await updateDoc(projectRef, { projectStatus: newStatus }); // Update status in Firestore
      // Update local state to reflect the changes
      const updatedProjects = resolvedProjects.map((project) =>
        project.id === projectId
          ? { ...project, projectStatus: newStatus }
          : project
      );
      setResolvedProjects(updatedProjects);
    } catch (error) {
      console.error("Error updating project status:", error);
    }
  };

  // Define color classes for project status
  const getStatusColor = (status) => {
    switch (status) {
      case "Development":
        return "bg-gray-200 text-black";
      case "Content Proposal":
        return "bg-blue-200 text-blue-800";
      case "Ongoing":
        return "bg-orange-200 text-orange-800";
      case "Editing":
        return "bg-purple-200 text-purple-800";
      case "Delivered":
        return "bg-green-200 text-green-800";
      case "Published":
        return "bg-black text-white";
      default:
        return "bg-white text-black";
    }
  };

  // Handle deletion confirmation
  const confirmDelete = (projectId) => {
    setDeleteProjectId(projectId);
    setIsDeleting(true);
  };

  // Delete a project
  const handleDelete = () => {
    if (deleteProjectId) {
      try {
        onDelete(deleteProjectId); // Call the parent-provided delete function
        setDeleteMessage("Project has been successfully deleted.");
      } catch (error) {
        setDeleteMessage("An error occurred while deleting the project. Please try again.");
        console.error("Error deleting project:", error);
      } finally {
        setIsDeleting(false);
        setDeleteProjectId(null);
        setTimeout(() => setDeleteMessage(""), 3000); // Clear message after 3 seconds
      }
    }
  };

  return (
    <div className="overflow-x-auto max-h-[600px]">
      {/* Deletion confirmation modal */}
      {isDeleting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="p-6 bg-white rounded shadow-lg w-80">
            <h2 className="mb-4 text-lg font-semibold">Confirm Deletion</h2>
            <p className="mb-4">Are you sure you want to delete this project?</p>
            <div className="flex justify-end space-x-4">
              <button
                className="px-3 py-1 text-black bg-gray-200 rounded hover:bg-gray-300"
                onClick={() => setIsDeleting(false)}
              >
                Cancel
              </button>
              <button
                className="px-3 py-1 text-white bg-red-500 rounded hover:bg-red-600"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Deletion success/error message */}
      {deleteMessage && (
        <div className="fixed px-4 py-2 text-white transform -translate-x-1/2 bg-green-500 rounded shadow-lg top-4 left-1/2">
          {deleteMessage}
        </div>
      )}

      {/* Project Table */}
      <table className="w-full text-left border border-gray-300">
        <thead>
          <tr>
            {[
              
              "Source",
              "Project",
              "Status",
              "Priority Level",
              "StartDate",
              "EndDate",
              "Quarter",
              "Category",
              "Brand",
              "Platform",
              "SOW",
              "Division",
            ].map((header) => (
              <th
                key={header}
                className="relative p-2 text-sm font-medium border-b border-gray-300"
              >
                {header === "Date" ? (
                  <div className="flex items-center">
                    <span>Date</span>
                    <button
                      onClick={toggleSortOrder}
                      className="ml-2 text-gray-600 hover:text-black"
                      title={`Sort by Date (${sortOrder === "asc" ? "Ascending" : "Descending"})`}
                    >
                      {sortOrder === "asc" ? "↑" : "↓"}
                    </button>
                  </div>
                ) : (
                  header
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {resolvedProjects.length === 0 ? (
            <tr>
              <td colSpan={12} className="p-4 text-center text-gray-500">
                No projects available
              </td>
            </tr>
          ) : (
            resolvedProjects.map((project, idx) => (
              <tr key={idx} className="border-b">
                <td className="p-2 text-sm">{project.source || "N/A"}</td>
                <td
                  className="p-2 text-sm text-blue-500 cursor-pointer hover:underline"
                  onClick={() => router.push(`/dashboard/project`)}
                >
                  {project.projectName || "N/A"}
                </td>
                <td className="p-2 text-sm">
                  <select
                    value={project.projectStatus || ""}
                    onChange={(e) =>
                      handleStatusChange(project.id, e.target.value)
                    }
                    className={`border border-gray-300 rounded p-1 w-40 text-center ${getStatusColor(
                      project.projectStatus
                    )}`}
                  >
                    <option value="Development">Development</option>
                    <option value="Content Proposal">Content Proposal</option>
                    <option value="Ongoing">Ongoing</option>
                    <option value="Editing">Editing</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Published">Published</option>
                  </select>
                </td>
                <td className="p-2 text-sm">{project.priority || "N/A"}</td>
                <td className="p-2 text-sm">{project.date && isValid(new Date(project.date))? format(new Date(project.date),"yyyy-MM-dd"): "N/A"}
                </td>
                <td className="p-2 text-sm">{project.endDate ? format(new Date(project.endDate), "yyyy-MM-dd") : "N/A"}</td>
                <td className="p-2 text-sm">{project.quarter || "N/A"}</td>
                <td className="p-2 text-sm">{project.category || "N/A"}</td>
                <td className="p-2 text-sm">{project.brand || "N/A"}</td>
                <td className="p-2 text-sm">
                  {Array.isArray(project.platform) && project.platform.length > 0
                    ? project.platform.join(", ")
                    : project.platform || "N/A"}
                </td>
                <td className="p-2 text-sm">
                  {Array.isArray(project.sow) ? (
                    <ul>
                      {project.sow.map((sowItem, sowIdx) => (
                        <li key={sowIdx}>
                          {sowItem?.sow || "N/A"}: {sowItem?.content || "N/A"}
                        </li>
                      ))}
                    </ul>
                  ) : typeof project.sow === "object" &&
                    project.sow !== null ? (
                    <span>{project.sow?.sow || "N/A"}</span>
                  ) : (
                    project.sow || "N/A"
                  )}
                </td>
                <td className="p-2 text-sm">{project.division || "N/A"}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProjectTableNoFunctionality;