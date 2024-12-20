import React from "react";

const ProjectTable = ({ projects, getProjectDate, onDelete, onEdit }) => {
    console.log(projects);
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
              <td colSpan={11} className="p-4 text-center text-gray-500">
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
                <td className="p-2 text-sm">{project.sow || "N/A"}</td>
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
                    onClick={() => onEdit(project)}
                  >
                    Edit
                  </button>
                  <button
                    className="text-red-500 hover:underline"
                    onClick={() => onDelete(project.id)}
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
