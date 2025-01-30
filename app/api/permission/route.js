import { checkPermission } from "@/lib/activityLoggerService";

export async function POST(request) {
  try {
    const uid = request.headers.get("Authorization-UID"); // Get UID from headers
    const { activityTitle } = await request.json(); // Extract activity from body

    if (!activityTitle) {
      return new Response(
        JSON.stringify({ error: "Activity title is required." }),
        { status: 400 }
      );
    }

    // Role check
    const hasPermission = await checkPermission(activityTitle, uid);
    if (!hasPermission) {
      console.error("Permission denied for user:", uid);
      return new Response(
        JSON.stringify({
          error: `Permission denied: You cannot perform "${activityTitle}".`,
        }),
        { status: 403 }
      );
    }

    console.log("Role check passed for user:", uid);
    return new Response(JSON.stringify({ success: true }), { status: 200 });

  } catch (error) {
    console.error("Error handling request:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error." }),
      { status: 500 }
    );
  }
}
