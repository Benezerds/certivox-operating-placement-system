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
  try {
    const userData = await request.json();
    const response = await addUser(userData);
    if (response.success) {
      return new Response(JSON.stringify(response), { status: 201 });
    } else {
      return new Response(JSON.stringify({ error: response.error }), { status: 500 });
    }
  } catch (error) {
    console.error("Error in POST /api/users:", error);
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
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
