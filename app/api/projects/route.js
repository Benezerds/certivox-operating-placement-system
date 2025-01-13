// app/api/projects/route.js
import { addProject, getAllProjects } from '../../../lib/firestoreService';

export async function GET(request) {
  try {
    const projects = await getAllProjects();
    return new Response(JSON.stringify(projects), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
  }
}

export async function POST(request) {
  try {
    const projectData = await request.json();
    const newProject = await addProject(projectData);
    return new Response(JSON.stringify(newProject), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
  }
}