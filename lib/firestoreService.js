import { db } from "../app/firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { getYouTubeVideoMetrics } from "@/lib/youtubeApi";

// Function to add a project to Firestore
export async function addProject(data) {
  const docRef = await addDoc(collection(db, "Projects"), data);
  return { id: docRef.id, ...data };
}

// Function to get all projects
export async function getAllProjects() {
  const querySnapshot = await getDocs(collection(db, "Projects"));
  const projects = [];
  querySnapshot.forEach((doc) => {
    projects.push({ id: doc.id, ...doc.data() });
  });
  return projects;
}

// Function to get a project by ID
export async function getProjectById(id) {
  const docRef = doc(db, "Projects", id);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
}

export const updateYouTubeMetrics = async (projectId, videoId) => {
  try {
    const metrics = await getYouTubeVideoMetrics(videoId);
    const projectRef = doc(db, "Projects", projectId);

    await updateDoc(projectRef, {
      likes: metrics.likes,
      views: metrics.views,
      comments: metrics.comments,
    });

    console.log("YouTube metrics updated successfully:", metrics);
  } catch (error) {
    console.error("Error updating YouTube metrics:", error);
  }
};