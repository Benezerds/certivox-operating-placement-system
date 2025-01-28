import { db } from "@/app/firebase";
import { collection } from "@firebase/firestore";

// Data format : {activityTitle, activity_description, byUser, timestamp}
export async function addActivityLog(data) {
  const docRef = await addDoc(collection(db, "ActivityLog"), data);
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