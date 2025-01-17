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
  deleteDoc,
} from "firebase/firestore";

// Function to add a category to Firestore
export async function addCategory(data) {
  const docRef = await addDoc(collection(db, "Categories"), data);
  return { id: docRef.id, ...data };
}

// Function to get all categories
export async function getAllCategories() {
  const querySnapshot = await getDocs(collection(db, "Categories"));
  const categories = [];
  querySnapshot.forEach((doc) => {
    categories.push({ id: doc.id, ...doc.data() });
  });
  return categories;
}

// Function to get a category by ID
export async function getCategoriesByDocRef(id) {
  const docRef = doc(db, "Categories", id);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
}

// Function to update a category by ID
export async function updateCategory(id, updatedData) {
  try {
    const docRef = doc(db, "Categories", id);
    await updateDoc(docRef, updatedData);
    return { id, ...updatedData }; // Return the updated data
  } catch (error) {
    console.error("Error updating category: ", error);
    throw new Error("Failed to update category");
  }
}

// Function to delete a category by ID
export async function deleteCategory(id) {
  try {
    const docRef = doc(db, "Categories", id);
    await deleteDoc(docRef);
    return { success: true, message: `Category with ID ${id} deleted successfully` };
  } catch (error) {
    console.error("Error deleting category: ", error);
    throw new Error("Failed to delete category");
  }
}
