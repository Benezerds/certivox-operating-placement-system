"use client";

import { useState, useEffect } from "react";
import { getYear, parseISO } from "date-fns";
import { format, isValid } from "date-fns";

import {
  collection,
  onSnapshot,
  doc,
  deleteDoc,
  addDoc,
  serverTimestamp,
  getDoc,
  getDocs,
} from "firebase/firestore";
import { db } from "@/app/firebase"; // Ensure Firebase is set up correctly
import AddProject from "components/project/AddProject"; // Import the AddProject component
import ProjectTable from "@/components/project/ProjectTable";
import EditProject from "@/components/project/EditProject";
import ExportCSV from "@/components/project/ExportCsv";
import ProjectProgress from "@/components/visualizations/ProjectProgress";

const Tracker = () => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [showAddProject, setShowAddProject] = useState(false);
  const [editProject, setEditProject] = useState(null); // For storing the selected project to edit
  const [selectedDivision, setSelectedDivision] = useState("all");
  const [selectedSource, setSelectedSource] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedYear, setSelectedYear] = useState("all");
  const [categories, setCategories] = useState([]); // Stores all categories from Firestore
  const [selectedCategories, setSelectedCategories] = useState([]); // Stores selected categories
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false); // Dropdown toggle
  const [searchBrand, setSearchBrand] = useState("");
  const [currentPage, setCurrentPage] = useState(1); // Track the current page
  const itemsPerPage = 4; // Number of items per page
  const [notification, setNotification] = useState({
    message: "",
    visible: false,
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categorySnapshot = await getDocs(collection(db, "Categories"));
        const categoryList = categorySnapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().category_name,
        }));
        setCategories(categoryList);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const isSequence = (word, query) => {
      if (!query) return true;
      if (query.length > word.length) return false;
      for (let i = 0; i < query.length; i++) {
        if (word[i]?.toLowerCase() !== query[i]?.toLowerCase()) {
          return false;
        }
      }
      return true;
    };
    const unsubscribe = onSnapshot(collection(db, "Projects"), (snapshot) => {
      const fetchedProjects = snapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        .filter((project) => {
          // Filter by division
          const divisionMatch =
            selectedDivision === "all" || project.division === selectedDivision;
          // Filter by year
          const yearMatch =
            selectedYear === "all" ||
            (project.date &&
              getYear(parseISO(project.date)) === Number(selectedYear));
          const sourceMatch =
            selectedSource === "all" || project.source === selectedSource;
          const statusMatch =
            selectedStatus === "all" ||
            project.projectStatus === selectedStatus;
          const brandMatch = isSequence(project.brand || "", searchBrand);
          const categoryMatch =
            selectedCategories.length === 0 ||
            selectedCategories.includes(project.category?.id);
          return (
            divisionMatch &&
            yearMatch &&
            sourceMatch &&
            statusMatch &&
            brandMatch &&
            categoryMatch
          );
        })

        .sort((a, b) => {
          // Sort by division (alphabetically)
          if (a.division && b.division && a.division !== b.division) {
            return a.division.localeCompare(b.division);
          }

          // If divisions are the same, sort by year (descending)
          const yearA = a.createdAt?.toDate
            ? a.createdAt.toDate().getFullYear()
            : 0;
          const yearB = b.createdAt?.toDate
            ? b.createdAt.toDate().getFullYear()
            : 0;
          if (yearA !== yearB) {
            return yearB - yearA;
          }

          // Finally, sort by date created (descending)
          const dateA = a.createdAt?.toDate
            ? a.createdAt.toDate()
            : new Date(0);
          const dateB = b.createdAt?.toDate
            ? b.createdAt.toDate()
            : new Date(0);
          return dateB - dateA;
        });

      setProjects(fetchedProjects);
      setFilteredProjects(fetchedProjects);
    });

    // Cleanup the listener when the component unmounts
    return () => unsubscribe();
  }, [
    selectedDivision,
    selectedYear,
    selectedSource,
    selectedStatus,
    searchBrand,
    selectedCategories,
  ]);

  // Function to safely handle different formats of the 'createdAt' field
  const getProjectDate = (project) => {
    if (project.createdAt?.toDate) {
      return project.createdAt.toDate(); // Firestore Timestamp
    }
    return new Date(); // Default to the current date
  };
  // const handleCheckboxChange = (brand) => {
  // setSelectedBrands((prev) => {
  // return prev.includes(brand)
  // ? prev.filter((b) => b !== brand)  // Remove if already selected
  // : [...prev, brand];  // Add if not selected
  // });
  // };

  // const handleSearch = () => {
  // if (selectedBrands.length === 0) {
  //  setFilteredProjects(projects);  // Show all if no brand selected
  // return;
  // }

  // const filtered = projects.filter((project) =>
  // selectedBrands.some((brand) => project.brand === brand)  // Match exact brand
  //);

  // if (filtered.length > 0) {
  // setFilteredProjects(filtered);
  // } else {
  //setNotification({
  // message: "No projects match the selected brands",
  // visible: true,
  //  });
  // setTimeout(() => setNotification({ message: "", visible: false }), 3000);
  // }
  // };
  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "Projects", id));
      setProjects((prevProjects) =>
        prevProjects.filter((project) => project.id !== id)
      );
      console.log(`Project with ID ${id} deleted successfully.`);
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  const handleAddProject = async (projectData) => {
    try {
      await addDoc(collection(db, "Projects"), {
        ...projectData,
        createdAt: serverTimestamp(), // Add server timestamp
      });
      console.log("Project added successfully.");
    } catch (error) {
      console.error("Error adding project:", error);
    }
  };

  const handleEdit = (project) => {
    setEditProject(project); // Open the EditProject modal with the selected project
  };

  // Logic for paginated projects
  const paginatedProjects = projects.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(projects.length / itemsPerPage);

  // Handle page navigation
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleExportCSV = () => {
    if (!projects || projects.length === 0) {
      setNotification({
        message: "No data available to export.",
        visible: true,
      });
      setTimeout(() => setNotification({ message: "", visible: false }), 3000);
      return;
    }

    const headers = [
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
    ];

    const rows = projects.map((project) => [
      project.source || "N/A",
      project.projectName || "N/A",
      project.projectStatus || "N/A",
      project.date
        ? isValid(new Date(project.date))
          ? format(new Date(project.date), "yyyy-MM-dd")
          : "Invalid Date"
        : "N/A",
      project.quarter || "N/A",
      typeof project.categoryRef === "object" && project.categoryRef !== null
        ? project.categoryRef.category_name || project.categoryRef.id || "N/A"
        : project.categoryRef || "N/A", // Convert object to string or fallback to raw value
      project.brand || "N/A",
      project.platform || "N/A",
      Array.isArray(project.sow)
        ? project.sow
            .map(
              (sowItem) =>
                `${sowItem?.sow || "N/A"}: ${sowItem?.content || "N/A"}`
            )
            .join("; ")
        : typeof project.sow === "object" && project.sow !== null
        ? `${project.sow?.sow || "N/A"}: ${project.sow?.content || "N/A"}`
        : project.sow || "N/A",
      project.division || "N/A",
      project.link || "N/A",
    ]);

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
  const handleSourceChange = (e) => {
    setSelectedSource(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="flex flex-col h-screen p-8">
      {/* Project Table Section */}
      <div className="flex flex-col">
        <h1 className="mb-6 text-2xl font-semibold">Project</h1>

        <ProjectProgress collectionName="Projects" />

        {/* Filter Options */}
        <div className="flex flex-wrap items-center justify-between w-full mb-4 overflow-hidden max-w-screen">
          <div className="flex flex-wrap items-center w-full gap-4 sm:w-auto">
            {/* Division Dropdown */}
            <select
              value={selectedDivision}
              onChange={(e) => {
                setSelectedDivision(e.target.value);
                setCurrentPage(1); // Reset to first page
              }}
              className="w-full p-2 border border-gray-300 rounded-lg sm:w-auto"
            >
              <option value="all">All Divisions</option>
              <option value="Marketing">Marketing</option>
              <option value="Community">Community</option>
            </select>

            {/* Year Dropdown */}
            <select
              value={selectedYear}
              onChange={(e) => {
                setSelectedYear(e.target.value);
                setCurrentPage(1); // Reset to first page
              }}
              className="w-full p-2 border border-gray-300 rounded-lg sm:w-auto"
            >
              <option value="all">All Years</option>
              <option value="2025">2025</option>
              <option value="2024">2024</option>
              <option value="2023">2023</option>
              <option value="2022">2022</option>
              <option value="2021">2021</option>
            </select>

            <select
              value={selectedSource}
              onChange={handleSourceChange}
              className="w-full p-2 border border-gray-300 rounded-lg sm:w-auto"
            >
              <option value="all">All Sources</option>
              <option value="Inbound">Inbound</option>
              <option value="Outbound">Outbound</option>
            </select>

            {/* Status Dropdown */}
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setCurrentPage(1); // Reset to first page
              }}
              className="w-full p-2 border border-gray-300 rounded-lg sm:w-auto"
            >
              <option value="all">All Status</option>
              <option value="Development">Development</option>
              <option value="Content Proposal">Content Proposal</option>
              <option value="Ongoing">Ongoing</option>
              <option value="Editing">Editing</option>
              <option value="Delivered">Delivered</option>
              <option value="Published">Published</option>
            </select>

            {/* Search by Brand */}
            <div>
              <input
                type="text"
                placeholder="Search by Brand"
                value={searchBrand}
                onChange={(e) => setSearchBrand(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg sm:w-auto"
              />
            </div>

            {/* Category Multi-Select Dropdown */}
            {/* <div className="relative z-10"> 
              <button
                onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                className="w-full p-2 border border-gray-300 rounded-lg sm:w-auto"
              >
                {selectedCategories.length === 0
                  ? "All Categories"
                  : selectedCategories
                      .map((id) => categories.find((cat) => cat.id === id)?.name)
                      .join(", ")}
              </button> */}

            {/* {categoryDropdownOpen && (
               <div className="absolute z-20 w-full mt-2 overflow-y-auto bg-white border border-gray-300 rounded-lg shadow-lg max-h-40">  {/* Inline z-index override */}
            {/* {categories.map((category) => ( 
                    <label
                      key={category.id}
                      className="z-20 flex items-center px-4 py-2 hover:bg-gray-100"
                    >
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category.id)}
                        onChange={() =>
                          setSelectedCategories((prev) =>
                            prev.includes(category.id)
                              ? prev.filter((id) => id !== category.id)
                              : [...prev, category.id]
                          )
                        }
                        className="mr-2"
                      />
                      {category.name}
                    </label>
                  ))}
                </div>
              )}
            </div> */}

            {/* Export and Add Buttons */}
            <ExportCSV projects={projects} setNotification={setNotification} />
            <button
              onClick={() => setShowAddProject((prev) => !prev)}
              className="w-full px-4 py-2 text-white bg-black rounded-lg sm:w-auto"
            >
              + New Project
            </button>

            {showAddProject && (
              <AddProject
                onAdd={handleAddProject}
                onClose={() => setShowAddProject(false)}
              />
            )}
          </div>
        </div>

        {/* Edit Project Modal */}
        {editProject && (
          <EditProject
            project={editProject}
            onClose={() => setEditProject(null)} // Close the modal
          />
        )}

        {/* Project Table */}
        <ProjectTable
          projects={paginatedProjects}
          getProjectDate={getProjectDate}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />

        {/* Pagination */}
        <div className="flex items-center justify-center gap-4 mt-4">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-lg border ${
              currentPage === 1
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-white text-black hover:bg-gray-100"
            }`}
          >
            &lt; Back
          </button>
          <span className="px-4 py-2 text-lg font-semibold">{currentPage}</span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-lg border ${
              currentPage === totalPages
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-white text-black hover:bg-gray-100"
            }`}
          >
            Next &gt;
          </button>
        </div>

        <p>Total Projects: {projects.length}</p>
      </div>
    </div>
  );
};

export default Tracker;
