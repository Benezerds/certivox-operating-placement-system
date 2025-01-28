import { db } from "@/app/firebase";
import { addDoc, collection, getDocs } from "@firebase/firestore";
import { getUserById } from "./firestoreUserService";

// Data format : {activityTitle, activity_description, byUser, timestamp}
export async function addActivityLog(data) {
  const docRef = await addDoc(collection(db, "Activities"), data);
  return { id: docRef.id, ...data };
}

// Function to get all categories
export async function getAllActivities() {
  const querySnapshot = await getDocs(collection(db, "Activities"));
  const activities = [];
  querySnapshot.forEach((doc) => {
    activities.push({ id: doc.id, ...doc.data() });
  });
  return categories;
}

//  Check permission
export async function checkPermission(requestTitle, uid) {
  try {
    // Fetch the logged-in user's data
    const userData = await getUserById(uid);
    if (!userData.success) {
      throw new Error(userData.error); // If there's an error (e.g., user not found)
    }

    const role = userData.user.role; // Get the role of the user
    if (!role) {
      throw new Error("Role not assigned to user.");
    }

    // Fetch all documents from the Roles collection
    const rolesSnapshot = await getDocs(collection(db, "Roles"));

    if (rolesSnapshot.empty) {
      throw new Error("No roles found in the Roles collection.");
    }

    // Find the role document where doc.name matches the user's role
    const roleDoc = rolesSnapshot.docs.find(
      (doc) => doc.data().name.toLowerCase() === role.toLowerCase()
    );

    if (!roleDoc) {
      throw new Error(`Role document not found for role: ${role}`);
    }

    const roleData = roleDoc.data();

    // Normalize both the permissions array and request title to lowercase for case-insensitive matching
    const normalizedPermissions = roleData.permissions.map((perm) => perm.toLowerCase());
    const normalizedRequestTitle = requestTitle.toLowerCase();

    // Check if the normalized request title exists in the normalized permissions
    const hasPermission = normalizedPermissions.includes(normalizedRequestTitle);

    return hasPermission; // Return true if permission exists, false otherwise
  } catch (error) {
    console.error("Error in checkPermission:", error);
    throw error;
  }
}