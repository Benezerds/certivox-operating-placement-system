import { addActivityLog, getAllActivities } from "@/lib/activityLoggerService";

export async function GET(request) {
  try {
    const activities = await getAllActivities();
    return new Response(JSON.stringify(activities), { sstatus: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
    });
  }
}

export async function POST(request) {
  try {
    const activityData = await request.json();
    const newActivity = await addActivityLog(activityData);
    return new Response(JSON.stringify(newActivity), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
    });
  }
}
