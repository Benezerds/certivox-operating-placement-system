// app/api/projects/route.js
import { addCategory,getAllCategories, getCategoriesByDocRef } from '../../../lib/categoriesService';

export async function GET(request) {
  try {
    const categories = await getAllCategories();
    return new Response(JSON.stringify(categories), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
  }
}

export async function POST(request) {
  try {
    const categoryData = await request.json();
    const newCategory = await addCategory(categoryData);
    return new Response(JSON.stringify(newCategory), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
  }
}