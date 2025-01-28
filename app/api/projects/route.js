// app/api/projects/route.js
import { addActivityLog, checkPermission } from "@/lib/activityLoggerService";
import { addProject, getAllProjects } from "@/lib/firestoreService";

export async function GET(request) {
  try {
    const projects = await getAllProjects();
    return new Response(JSON.stringify(projects), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
    });
  }
}

export async function POST(request) {
  const uid = request.headers.get('Authorization-UID'); // Assume UID is passed in the request headers
  const activityTitle = 'Create new projects'; // Specific activity for permission check

  try {
    console.log("Processing POST /api/projects...");

    // 1. Parse the request data
    const projectData = await request.json();
    console.log("Received project data:", projectData);

    // 2. Role check
    const hasPermission = await checkPermission(activityTitle, uid);
    if (!hasPermission) {
      console.error('Permission denied for user:', uid);
      return new Response(
        JSON.stringify({ error: 'Permission denied: You are not allowed to create new projects.' }),
        { status: 403 }
      );
    }
    console.log("Role check passed for user:", uid);

    // 3. Main activity: Add project
    const newProject = await addProject(projectData);
    console.log("Project added successfully:", newProject);

    // 4. Log activity
    const activityLogData = {
      activity_title: activityTitle,
      activity_description: `Created a new project: ${projectData.projectName || 'Unnamed Project'}`,
      byUser: uid,
      timestamp: new Date().toISOString(),
    };
    const logResult = await addActivityLog(activityLogData);
    console.log("Activity logged successfully:", logResult);

    // Return success response
    return new Response(JSON.stringify(newProject), { status: 200 });
  } catch (error) {
    console.error('Error in POST /api/projects:', error);
    return new Response(JSON.stringify({ error: error.message || 'Server error' }), { status: 500 });
  }
}