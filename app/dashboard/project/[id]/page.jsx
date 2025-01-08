"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/app/firebase";
import { format, parseISO } from "date-fns";
import { updateYouTubeMetrics } from "@/lib/firestoreService";


const ProjectDetailsPage = ({ params }) => {
  const { id } = params; // Get the project ID from the URL
  const [categoryName, setCategoryName] = useState("N/A");
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
  
        // Resolve category if it exists
        if (typeof projectData.category === "string") {
          // Custom category
          setCategoryName(projectData.category);
        } else if (projectData.category) {
          // Firestore reference
          const categoryDoc = await getDoc(projectData.category);
          if (categoryDoc.exists()) {
            setCategoryName(categoryDoc.data().category_name || "N/A");
          } else {
            setCategoryName("N/A");
          }
        }

        // Fetch metrics for platforms if needed
        await fetchPlatformMetrics(projectData);
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

  const fetchPlatformMetrics = async (projectData) => {
    // Fetch YouTube metrics if YouTube is selected
    if (
      projectData.platform.includes("Youtube") &&
      projectData.platformLink["Youtube"]
    ) {
      const videoId = extractYouTubeVideoId(
        projectData.platformLink["Youtube"]
      );
      if (videoId) {
        await updateYouTubeMetrics(projectData.id, videoId);
        const updatedDoc = await getDoc(doc(db, "Projects", id));
        projectData = { id: updatedDoc.id, ...updatedDoc.data() };
        setProject(projectData);
      }
    }

    // Fetch Instagram metrics if Instagram is selected
    if (
      projectData.platform.includes("Instagram") &&
      projectData.platformLink["Instagram"]
    ) {
      // Implement fetchInstagramMetrics function similar to updateYouTubeMetrics
      // await fetchInstagramMetrics(projectData.id, projectData.platformLink["Instagram"]);
      // For now, we'll assume metrics are already stored in Firestore
    }

    // Fetch TikTok metrics if TikTok is selected
    if (
      projectData.platform.includes("Tik Tok") &&
      projectData.platformLink["Tik Tok"]
    ) {
      // Implement fetchTikTokMetrics function
      // await fetchTikTokMetrics(projectData.id, projectData.platformLink["Tik Tok"]);
    }

    // You can add similar blocks for Website and "Apa kek" if needed
  };

  useEffect(() => {
    fetchProjectDetails();
  }, [id]);
  const formatDate = (date) => {
    if (!date) return "N/A";
    const parsedDate = parseISO(date);
    return format(parsedDate, "yyyy-MM-dd"); // Format the date
  };
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Sabar aje, belanda masih jauh ...
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex items-center justify-center h-screen">
        Project not found.
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto bg-white shadow-md rounded-lg">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        {project.projectName}
      </h1>
      
      <div className="space-y-4">
        <p className="text-lg">
          <span className="font-semibold">Source:</span> {project.source}
        </p>
        <p className="text-lg">
          <span className="font-semibold">Status:</span> {project.projectStatus}
        </p>
        <p className="text-lg">
          <span className="font-semibold">Date:</span> {formatDate(project.date)}
        </p>
        <p className="text-lg">
          <span className="font-semibold">Quarter:</span> {project.quarter}
        </p>
        <p className="text-lg">
          <span className="font-semibold">Category:</span> {categoryName}
        </p>
        
        <p className="text-lg">
          <span className="font-semibold">Brand:</span> {project.brand}
        </p>
        <p className="text-lg">
          <span className="font-semibold">SOW:</span>{" "}
          {Array.isArray(project.sow) ? (
            <ul className="list-disc pl-6">
              {project.sow.map((sowItem, idx) => (
                <li key={idx}>
                  <span className="font-semibold">{sowItem.sow}:</span> {sowItem.content}
                </li>
              ))}
            </ul>
          ) : (
            project.sow || "N/A"
          )}
        </p>
        <p className="text-lg">
          <span className="font-semibold">Division:</span> {project.division || "N/A"}
        </p>
        
        {/* Dynamically Render Platform Links and Metrics */}
        {project.platform && project.platform.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold">Platforms</h2>
            <div className="space-y-6">
              {project.platform.map((plat) => (
                <div key={plat}>
                  <p className="text-lg">
                    <span className="font-semibold">{plat} Link:</span>{" "}
                    {project.platformLink[plat] ? (
                      <a
                        href={project.platformLink[plat]}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 underline"
                      >
                        {project.platformLink[plat]}
                      </a>
                    ) : (
                      "No link provided"
                    )}
                  </p>

                  {/* Engagement Metrics for Each Platform */}
                  {plat === "Youtube" && (
                    <div className="grid grid-cols-3 gap-4 text-center mt-4">
                      <div className="p-4 bg-blue-100 rounded-lg shadow-md">
                        <p className="text-xl font-bold text-blue-700">
                          {project.views || 0}
                        </p>
                        <p className="text-gray-600">Views</p>
                      </div>
                      <div className="p-4 bg-green-100 rounded-lg shadow-md">
                        <p className="text-xl font-bold text-green-700">
                          {project.likes || 0}
                        </p>
                        <p className="text-gray-600">Likes</p>
                      </div>
                      <div className="p-4 bg-yellow-100 rounded-lg shadow-md">
                        <p className="text-xl font-bold text-yellow-700">
                          {project.comments || 0}
                        </p>
                        <p className="text-gray-600">Comments</p>
                      </div>
                    </div>
                  )}
            
                  {plat === "Instagram" && (
                    <div className="grid grid-cols-3 gap-4 text-center mt-4">
                      <div className="p-4 bg-purple-100 rounded-lg shadow-md">
                        <p className="text-xl font-bold text-purple-700">
                          {project.instagramFollowers || 0}
                        </p>
                        <p className="text-gray-600">Followers</p>
                      </div>
                      <div className="p-4 bg-pink-100 rounded-lg shadow-md">
                        <p className="text-xl font-bold text-pink-700">
                          {project.instagramLikes || 0}
                        </p>
                        <p className="text-gray-600">Likes</p>
                      </div>
                      <div className="p-4 bg-yellow-100 rounded-lg shadow-md">
                        <p className="text-xl font-bold text-yellow-700">
                          {project.instagramComments || 0}
                        </p>
                        <p className="text-gray-600">Comments</p>
                      </div>
                    </div>
                  )}

                  {plat === "Tik Tok" && (
                    <div className="grid grid-cols-3 gap-4 text-center mt-4">
                      <div className="p-4 bg-blue-100 rounded-lg shadow-md">
                        <p className="text-xl font-bold text-blue-700">
                          {project.tiktokViews || 0}
                        </p>
                        <p className="text-gray-600">Views</p>
                      </div>
                      <div className="p-4 bg-red-100 rounded-lg shadow-md">
                        <p className="text-xl font-bold text-red-700">
                          {project.tiktokLikes || 0}
                        </p>
                        <p className="text-gray-600">Likes</p>
                      </div>
                      <div className="p-4 bg-gray-100 rounded-lg shadow-md">
                        <p className="text-xl font-bold text-gray-700">
                          {project.tiktokComments || 0}
                        </p>
                        <p className="text-gray-600">Comments</p>
                      </div>
                    </div>
                  )}

                  {/* Website and "Apa kek" might not have metrics */}
                  {(plat === "Website" || plat === "Apa kek") && (
                    <p className="mt-2 text-gray-600">
                      No engagement metrics available for {plat}.
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
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
