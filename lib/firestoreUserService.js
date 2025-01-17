import { db, auth } from "../app/firebase";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  increment,
} from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";


// Create new User by getting the data from generated UID
export async function addUser(data) {
  try {
    if (!data.password || !data.email) {
      throw new Error("Email and Password are required for user creation");
    }

    // Create user in Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      data.email,
      data.password
    );

    // Get the UID from the created user
    const { uid } = userCredential.user;

    // Add user to Firestore using UID as the document ID
    const userToStore = {
      name: data.name,
      email: data.email,
      role: data.role,
      password: data.password,
      lastActive: "Just now",
    };
    await setDoc(doc(db, "Users", uid), userToStore);

    return { success: true, id: uid, ...userToStore };
  } catch (error) {
    console.error("Error adding user:", error);
    return { success: false, error: error.message };
  }
}

// Get all users
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

// Get user by ID
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

// Update user by ID
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

// Delete user
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
