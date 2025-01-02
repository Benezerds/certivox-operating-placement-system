import { db } from "../app/firebase";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

// Create new User
export async function addUser(data) {
  try {
    const docRef = await addDoc(collection(db, "Users"), data);
    return { success: true, id: docRef.id, ...data };
  } catch (error) {
    console.error("Error adding user:", error);
    return { success: false, error: error.message };
  }
}

// Get All Users
export async function getAllUsers() {
  try {
    const querySnapshot = await getDocs(collection(db, "Users"));
    const users = [];
    querySnapshot.forEach((doc) => {
      users.push({ id: doc.id, ...doc.data() });
    });
    return { success: true, users };
  } catch (error) {
    console.error("Error getting users:", error);
    return { success: false, error: error.message };
  }
}

// Get User by ID
export async function getUserById(id) {
  try {
    const docRef = doc(db, "Users", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { success: true, user: { id: docSnap.id, ...docSnap.data() } };
    } else {
      return { success: false, error: "User not found" };
    }
  } catch (error) {
    console.error("Error getting user by ID:", error);
    return { success: false, error: error.message };
  }
}

// Update User by ID
export async function updateUserById(id, data) {
  try {
    const docRef = doc(db, "Users", id);
    await updateDoc(docRef, data);
    return { success: true, id, ...data }; 
  } catch (error) {
    console.error("Error updating user:", error);
    return { success: false, error: error.message };
  }
}

// Delete User
export async function deleteUserById(id) {
  try {
    const docRef = doc(db, "Users", id);
    await deleteDoc(docRef);
    return { success: true }; 
  } catch (error) {
    console.error("Error deleting user:", error);
    return { success: false, error: error.message };
  }
}
