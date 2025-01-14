// app/api/categories/route.js
import { addCategory,getAllCategories, getCategoriesByDocRef, updateCategory } from '../../../lib/categoriesService';

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

export async function PUT(request) {
  try {
    const url = new URL(request.url);
    const categoryId = url.searchParams.get('id'); // Extract the category ID from the query params
    const updatedData = await request.json();

    if (!categoryId) {
      return new Response(JSON.stringify({ error: 'Category ID is required' }), { status: 400 });
    }

    const updatedDataResult = await updateCategory(categoryId, updatedData);
    return new Response(JSON.stringify(updatedDataResult), { status: 200 });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Failed to update data, Server Error' }),
      { status: 500 }
    );
  }
}

