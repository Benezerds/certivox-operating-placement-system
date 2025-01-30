import { getUserById } from "@/lib/firestoreUserService";


export async function GET(request, { params }) {
    try {
      const uid = params.id;
      console.log("Fetching user for UID:", uid); // Debugging
  
      if (!uid) {
        return new Response(JSON.stringify({ error: "User ID is required" }), { status: 400 });
      }
  
      const userResult = await getUserById(uid);
      console.log("User result from Firestore:", userResult); // Debugging
  
      if (!userResult.success) {
        return new Response(JSON.stringify({ error: userResult.error }), { status: 404 });
      }
  
      return new Response(JSON.stringify(userResult.user), { status: 200 });
    } catch (error) {
      console.error("Error fetching user:", error);
      return new Response(
        JSON.stringify({ error: "Failed to fetch user, Server Error" }),
        { status: 500 }
      );
    }
  }
  