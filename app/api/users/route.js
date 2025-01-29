import { addActivityLog, checkPermission } from "@/lib/activityLoggerService";
import { addUser, getAllUsers, getUserById, updateUserById, deleteUserById } from "../../../lib/firestoreUserService";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("id");

    if (userId) {
      const response = await getUserById(userId);
      if (response.success) {
        return new Response(JSON.stringify(response.user), { status: 200 });
      } else {
        return new Response(JSON.stringify({ error: response.error }), { status: 404 });
      }
    } else {
      const response = await getAllUsers();
      if (response.success) {
        return new Response(JSON.stringify(response.users), { status: 200 });
      } else {
        return new Response(JSON.stringify({ error: response.error }), { status: 500 });
      }
    }
  } catch (error) {
    console.error("Error in GET /api/users:", error);
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
}

export async function POST(request) {
  const uid = request.headers.get('Authorization-UID'); // Assume UID is passed in the request headers
  const activityTitle = 'Add users'; // Activity for permission check

  try {
    console.log("Processing POST /api/users...");

    // 1. Parse request data
    const userData = await request.json();
    console.log("Received user data:", userData);

    // 2. Role check
    const hasPermission = await checkPermission(activityTitle, uid);
    if (!hasPermission) {
      console.error('Permission denied for user:', uid);
      return new Response(
        JSON.stringify({ error: 'Permission denied: You are not allowed to add users.' }),
        { status: 403 }
      );
    }
    console.log("Role check passed for user:", uid);

    // 3. Main activity: Add user
    const response = await addUser(userData);
    if (!response.success) {
      console.error("Error adding user:", response.error);
      return new Response(JSON.stringify({ error: response.error }), { status: 500 });
    }
    console.log("User added successfully:", response);

    // 4. Log activity
    const activityLogData = {
      activity_title: activityTitle,
      activity_description: `Added a new user: ${userData.name || 'Unknown Email'}`,
      byUser: uid,
      timestamp: new Date().toISOString(),
    };
    const logResult = await addActivityLog(activityLogData);
    console.log("Activity logged successfully:", logResult);

    // Return success response
    return new Response(JSON.stringify(response), { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/users:', error);
    return new Response(JSON.stringify({ error: error.message || 'Server error' }), { status: 500 });
  }
}


export async function PUT(request) {
  try {
    const { id, ...userData } = await request.json();
    const response = await updateUserById(id, userData);
    if (response.success) {
      return new Response(JSON.stringify(response), { status: 200 });
    } else {
      return new Response(JSON.stringify({ error: response.error }), { status: 500 });
    }
  } catch (error) {
    console.error("Error in PUT /api/users:", error);
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { id } = await request.json();
    const response = await deleteUserById(id);
    if (response.success) {
      return new Response(JSON.stringify({ message: "User deleted successfully" }), { status: 200 });
    } else {
      return new Response(JSON.stringify({ error: response.error }), { status: 500 });
    }
  } catch (error) {
    console.error("Error in DELETE /api/users:", error);
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
}
