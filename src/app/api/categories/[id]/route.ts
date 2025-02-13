import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Category } from "@/models/Category";

interface RouteContext {
  params: {
    id: string;
  };
}

export async function PATCH(request: Request, { params }: RouteContext) {
  try {
    const { accountId } = await request.json();
    await connectDB();

    const updatedCategory = await Category.findByIdAndUpdate(
      params.id,
      { accountId },
      { new: true }
    );

    if (!updatedCategory) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedCategory);
  } catch (error) {
    console.error("Error updating category:", error);
    return NextResponse.json(
      { error: "Failed to update category" },
      { status: 500 }
    );
  }
}
