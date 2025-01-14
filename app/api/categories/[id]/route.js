import { deleteCategory, updateCategory } from "@/lib/categoriesService";

export async function PUT(request, { params }) {
  try {
    const categoryId = params.id; // Get categoryId from dynamic route params
    const updatedData = await request.json(); // Get the updated data from the request body

    if (!categoryId) {
      return new Response(
        JSON.stringify({ error: "Category ID is required" }),
        { status: 400 }
      );
    }

    // Update the category with the new data
    const updatedDataResult = await updateCategory(categoryId, updatedData);

    return new Response(JSON.stringify(updatedDataResult), { status: 200 });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Failed to update category, Server Error" }),
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const categoryId = params.id; // Access dynamic ID from URL parameters

    if (!categoryId) {
      return new Response(
        JSON.stringify({ error: "Category ID is required" }),
        { status: 400 }
      );
    }

    const deleteResult = await deleteCategory(categoryId); // Call delete with the actual category ID
    return new Response(JSON.stringify(deleteResult), { status: 200 });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Failed to delete category, Server Error" }),
      { status: 500 }
    );
  }
}
