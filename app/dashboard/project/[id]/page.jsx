"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/app/firebase";

const ProjectDetailsPage = ({ params }) => {
  const { id } = params; // Get the project ID from the URL
  const [project, setProject] = useState(null); // State to store project data
  const [loading, setLoading] = useState(true); // State to manage loading
  const router = useRouter(); // Router for navigation

  // Fetch project details from Firestore
  const fetchProjectDetails = async () => {
    try {
      const docRef = doc(db, "Projects", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setProject({ id: docSnap.id, ...docSnap.data() });
      } else {
        console.error("No such project!");
        router.push("/dashboard"); // Redirect if project doesn't exist
      }
    } catch (error) {
      console.error("Error fetching project details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectDetails();
  }, [id]);

  if (loading) {
    return <div>Loading project details...</div>;
  }

  if (!project) {
    return <div>Project not found.</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">{project.projectName}</h1>
      <p><strong>Status:</strong> {project.projectStatus}</p>
      <p><strong>Brand:</strong> {project.brand}</p>
      <p><strong>Platform:</strong> {project.platform}</p>
      <p><strong>Division:</strong> {project.division}</p>
      <p><strong>Link:</strong> <a href={project.link} target="_blank" rel="noopener noreferrer">{project.link}</a></p>
      <p><strong>Likes:</strong> {project.likes || 0}</p>
      <p><strong>Views:</strong> {project.views || 0}</p>
      <p><strong>Comments:</strong> {project.comments || 0}</p>
      <button
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        onClick={() => router.push("/dashboard/project")}
      >
        Back to Projects
      </button>
    </div>
  );
};

export default ProjectDetailsPage;
