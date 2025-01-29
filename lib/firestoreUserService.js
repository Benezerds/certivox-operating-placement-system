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
import { authAdmin } from "./firebaseAdmin";

// Create new User by getting the data from generated UID
export async function addUser(data) {
  try {
    if (!data.password || !data.email) {
      throw new Error("Email and Password are required for user creation");
    }

    // Step 1: Create user in Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      data.email,
      data.password
    );

    const { uid } = userCredential.user;

    // Step 2: Add user to Firestore using UID as the document ID
    const userToStore = {
      name: data.name,
      email: data.email,
      role: data.role,
      lastActive: "Just now", // Avoid storing sensitive data like passwords
    };
    await setDoc(doc(db, "Users", uid), userToStore);

    // Step 3: Add custom claims (Admin SDK)
    // await authAdmin.setCustomUserClaims(uid, {
    //   Admin: data.role === "Admin",
    //   Employee: data.role === "Employee",
    // });

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
