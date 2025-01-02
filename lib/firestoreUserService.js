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
import { runTransaction } from "firebase/firestore";

// Initialize User Counter if it doesn't exist
export async function initializeUserCounter() {
  try {
    const counterDocRef = doc(db, "counters", "users");
    const counterSnapshot = await getDoc(counterDocRef);

    if (!counterSnapshot.exists()) {
      // Initialize counter with currentId = 0
      await setDoc(counterDocRef, { currentId: 0 });
      console.log("User counter initialized successfully.");
    }
  } catch (error) {
    console.error("Error initializing user counter:", error);
    throw new Error("Failed to initialize user counter.");
  }
}

// Increment and fetch the next user ID
export async function getNextUserId() {
  try {
    const counterDocRef = doc(db, "counters", "users");

    // Run transaction to increment counter atomically
    const nextId = await runTransaction(db, async (transaction) => {
      const counterSnapshot = await transaction.get(counterDocRef);

      if (!counterSnapshot.exists()) {
        throw new Error("Counter document does not exist. Please initialize it.");
      }

      const currentId = counterSnapshot.data().currentId || 0;
      transaction.update(counterDocRef, { currentId: increment(1) });

      return currentId + 1;
    });

    return nextId;
  } catch (error) {
    console.error("Error getting next user ID:", error);
    throw new Error("Failed to fetch next user ID.");
  }
}

// Create new User with Auto-Incrementing ID
export async function addUser(data) {
  try {
    if (!data.password || !data.email) {
      throw new Error("Email and Password are required for user creation");
    }

    // Ensure counter is initialized
    await initializeUserCounter();

    // Get the next auto-increment ID
    const nextUserId = await getNextUserId();

    // Create user in Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      data.email,
      data.password
    );

    // Add user to Firestore
    const userToStore = {
      userIntId: nextUserId, // Store the auto-incrementing ID
      name: data.name,
      email: data.email,
      role: data.role,
      lastActive: "Just now",
    };
    await addDoc(collection(db, "Users"), userToStore);

    return { success: true, id: nextUserId, ...userToStore };
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