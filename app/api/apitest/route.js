import { checkPermission } from "@/lib/activityLoggerService.js";
import { getUserById } from "@/lib/firestoreUserService";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    // Parse the query parameters from the URL
    const { searchParams } = new URL(req.url);
    const requestTitle = searchParams.get("requestTitle");
    const uid = searchParams.get("uid");

    // Validate the input parameters
    if (!requestTitle || !uid) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing required parameters: requestTitle and uid",
        },
        { status: 400 }
      );
    }

    // Call the checkPermission function
    const hasPermission = await checkPermission(requestTitle, uid);

    // Return the result as a JSON response
    return NextResponse.json({ success: true, hasPermission });
  } catch (error) {
    console.error("Error in GET /api/apitest:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// Get User By ID
// export async function GET(req) {
//   try {
//     // Parse the query parameters from the URL
//     const { searchParams } = new URL(req.url);
//     const userId = searchParams.get("id");

//     // Validate the input parameter
//     if (!userId) {
//       return NextResponse.json(
//         { success: false, message: "Missing required parameter: id" },
//         { status: 400 }
//       );
//     }

//     // Call the getUserById function
//     const result = await getUserById(userId);

//     // Check if the operation was successful
//     if (result.success) {
//       return NextResponse.json({ success: true, user: result.user });
//     } else {
//       return NextResponse.json(
//         { success: false, message: result.error },
//         { status: 404 }
//       );
//     }
//   } catch (error) {
//     console.error("Error in GET /api/user:", error);
//     return NextResponse.json(
//       {
//         success: false,
//         message: "Internal Server Error",
//         error: error.message,
//       },
//       { status: 500 }
//     );
//   }
// }
