import React, { useState, useEffect } from "react";
import { format, isValid } from "date-fns";
import { getDoc, updateDoc, doc } from "firebase/firestore"; // Firestore methods
import { useRouter } from "next/navigation";
import { db } from "@/app/firebase"; // Ensure Firebase config is imported

const ProjectTable = ({ projects, onDelete, onEdit }) => {
  const [resolvedProjects, setResolvedProjects] = useState([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState("");
  const [deleteProjectId, setDeleteProjectId] = useState(null);
  const router = useRouter();


  useEffect(() => {
    const resolveProjectData = async () => {
      const updatedProjects = await Promise.all(
        projects.map(async (project) => {
          let categoryName = project.category || "N/A"; // Use custom category directly if provided
          if (typeof project.category === "object" && project.category.id) { // Check for Firestore reference
            try {
              const categoryDoc = await getDoc(project.category);
              if (categoryDoc.exists()) {
                categoryName = categoryDoc.data().category_name || "N/A";
              }
            } catch (error) {
              console.error("Error fetching category:", error);
            }
          }
          return { ...project, category: categoryName };
        })
      );
      setResolvedProjects(updatedProjects);
    };
    
    resolveProjectData();
  }, [projects]);

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

  const getStatusColor = (status) => {
    switch (status) {
      case "Development":
        return "bg-gray-200 text-black"; // Gray button, black text
      case "Content Proposal":
        return "bg-blue-200 text-blue-800"; // Blue button, white text
      case "Ongoing":
        return "bg-orange-200 text-orange-800"; // Orange button, white text
      case "Editing":
        return "bg-purple-200 text-purple-800"; // Purple button, white text
      case "Delivered":
        return "bg-green-200 text-green-800"; // Green button, white text
      case "Published":
        return "bg-black text-white"; // Black button, white text
      default:
        return "bg-white text-black"; // Fallback color
    }
  };
  const confirmDelete = (projectId) => {
    setDeleteProjectId(projectId);
    setIsDeleting(true);
  };

  const handleDelete = () => {
    if (deleteProjectId) {
      try {
        onDelete(deleteProjectId);
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
    <div className="overflow-x-auto max-h-[260px]">
      {isDeleting && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-lg w-80">
            <h2 className="text-lg font-semibold mb-4">Confirm Deletion</h2>
            <p className="mb-4">Are you sure you want to delete this project?</p>
            <div className="flex justify-end space-x-4">
              <button
                className="bg-gray-200 text-black py-1 px-3 rounded hover:bg-gray-300"
                onClick={() => setIsDeleting(false)}
              >
                Cancel
              </button>
              <button
                className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteMessage && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white py-2 px-4 rounded shadow-lg">
          {deleteMessage}
        </div>
      )}

      <table className="w-full text-left border border-gray-300">
        <thead>
          <tr>
            {[
              "Source",
              "Project",
              "Status",
              "Date",
              "Quarter",
              "Category",
              "Brand",
              "Platform",
              "SOW",
              "Division",
              "Action",
            ].map((header) => (
              <th
                key={header}
                className="p-2 text-sm font-medium border-b border-gray-300"
              >
                {header}
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
                  onClick={() => router.push(`/dashboard/project/${project.id}`)}
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
                <td className="p-2 text-sm">
                  {project.date && isValid(new Date(project.date))
                    ? format(new Date(project.date), "yyyy-MM-dd")
                    : "N/A"}
                </td>
                <td className="p-2 text-sm">{project.quarter || "N/A"}</td>
                <td className="p-2 text-sm">{project.category || "N/A"}</td>
                <td className="p-2 text-sm">{project.brand || "N/A"}</td>
                <td className="p-2 text-sm">
                  {Array.isArray(project.platform) && project.platform.length > 0
                    ? project.platform.join(", ") // Join multiple platform labels
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
                <td className="p-2 text-sm">
                  <button
                    className="mr-2 text-blue-500 hover:underline"
                    onClick={() => onEdit(project)}
                  >
                    Edit
                  </button>
                  <button
                    className="text-red-500 hover:underline hover:text-red-600"
                    onClick={() => confirmDelete(project.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProjectTable;