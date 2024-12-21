import React, { useState } from "react";


const ProjectTable = ({ projects, getProjectDate, onDelete, onEdit }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);

  const handleDeleteClick = (project) => {
    setProjectToDelete(project);
    setIsModalOpen(true);
  };

  const confirmDelete = () => {
    onDelete(projectToDelete.id);
    setIsModalOpen(false);
    setProjectToDelete(null);
  };

  const cancelDelete = () => {
    setIsModalOpen(false);
    setProjectToDelete(null);
  };
  return (
    <div className="overflow-x-auto max-h-[260px]">
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
              "Link",
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
          {projects.length === 0 ? (
            <tr>
              <td colSpan={12} className="p-4 text-center text-gray-500">
                No projects available
              </td>
            </tr>
          ) : (
            projects.map((project, idx) => (
              <tr key={idx} className="border-b">
                <td className="p-2 text-sm">{project.source || "N/A"}</td>
                <td className="p-2 text-sm">{project.projectName || "N/A"}</td>
                <td className="p-2 text-sm">{project.projectStatus || "N/A"}</td>
                <td className="p-2 text-sm">
                  {getProjectDate(project)
                    ? getProjectDate(project).toLocaleDateString()
                    : "N/A"}
                </td>
                <td className="p-2 text-sm">{project.quarter || "N/A"}</td>
                <td className="p-2 text-sm">{project.brandCategory || "N/A"}</td>
                <td className="p-2 text-sm">{project.brand || "N/A"}</td>
                <td className="p-2 text-sm">{project.platform || "N/A"}</td>
                {/* Updated SOW rendering */}
                <td className="p-2 text-sm">
                  {Array.isArray(project.sow) ? (
                    <ul>
                      {project.sow.map((sowItem, sowIdx) => (
                        <li key={sowIdx}>
                          {sowItem.sow}: {sowItem.content}
                        </li>
                      ))}
                    </ul>
                  ) : typeof project.sow === "object" ? (
                    <span>
                      {project.sow.sow}
                    </span>
                  ) : (
                    project.sow || "N/A"
                  )}
                </td>
                <td className="p-2 text-sm">{project.division || "N/A"}</td>
                <td className="p-2 text-sm">
                  {project.link ? (
                    <a href={project.link} target="_blank" rel="noopener noreferrer">
                      Link
                    </a>
                  ) : (
                    "N/A"
                  )}
                </td>
                <td className="p-2 text-sm">
                <button
                    className="mr-2 text-blue-500 hover:underline"
                    onClick={() => onEdit(project)} // Pass project to onEdit
                  >
                    Edit
                  </button>
                  <button
                      className="text-red-500 hover:underline hover:text-red-600"
                      onClick={() => handleDeleteClick(project)}
                    >
                      Delete
                  </button>

                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
          {/* Delete Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete the project{" "}
              <span className="font-bold">{projectToDelete?.projectName}</span>?
              This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                onClick={cancelDelete}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                onClick={confirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectTable;
