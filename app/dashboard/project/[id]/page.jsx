"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/app/firebase";
import { updateYouTubeMetrics } from "@/lib/firestoreService";

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
        const projectData = { id: docSnap.id, ...docSnap.data() };
        setProject(projectData);

        // Check if the project has a YouTube link and fetch metrics
        if (projectData.platform === "Youtube" && projectData.platformLink) {
          const videoId = extractYouTubeVideoId(projectData.platformLink);
          if (videoId) {
            await updateYouTubeMetrics(projectData.id, videoId);
            const updatedProject = await getDoc(docRef); // Fetch updated data
            setProject({ id: updatedProject.id, ...updatedProject.data() });
          }
        }
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

  const extractYouTubeVideoId = (url) => {
    const match = url.match(
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/
    );
    console.log("Extracted Video ID:", match ? match[1] : "No match");
    return match ? match[1] : null;
  };

  useEffect(() => {
    fetchProjectDetails();
  }, [id]);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading project details...</div>;
  }

  if (!project) {
    return <div className="flex items-center justify-center h-screen">Project not found.</div>;
  }

  return (
    <div className="p-8 max-w-4xl mx-auto bg-white shadow-md rounded-lg">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">{project.projectName}</h1>
      <div className="space-y-4">
        <p className="text-lg">
          <span className="font-semibold">Status:</span> {project.projectStatus}
        </p>
        <p className="text-lg">
          <span className="font-semibold">Brand:</span> {project.brand}
        </p>
        <p className="text-lg">
          <span className="font-semibold">Platform:</span> {project.platform}
        </p>
        {project.platformLink && (
          <p className="text-lg">
            <span className="font-semibold">{project.platform} Link:</span>{" "}
            <a
              href={project.platformLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline"
            >
              {project.platformLink}
            </a>
          </p>
        )}
        <div className="grid grid-cols-3 gap-4 text-center mt-8">
          <div className="p-4 bg-blue-100 rounded-lg shadow-md">
            <p className="text-xl font-bold text-blue-700">{project.views || 0}</p>
            <p className="text-gray-600">Views</p>
          </div>
          <div className="p-4 bg-green-100 rounded-lg shadow-md">
            <p className="text-xl font-bold text-green-700">{project.likes || 0}</p>
            <p className="text-gray-600">Likes</p>
          </div>
          <div className="p-4 bg-yellow-100 rounded-lg shadow-md">
            <p className="text-xl font-bold text-yellow-700">{project.comments || 0}</p>
            <p className="text-gray-600">Comments</p>
          </div>
        </div>
      </div>
      <button
        className="mt-8 px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600"
        onClick={() => router.push("/dashboard/project")}
      >
        Back to Projects
      </button>
    </div>
  );
};

export default ProjectDetailsPage;
