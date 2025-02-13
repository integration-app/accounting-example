import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Contractor } from "@/models/Contractor";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { vendorId } = await request.json();
    await connectDB();

    const updatedContractor = await Contractor.findByIdAndUpdate(
      (
        await params
      ).id,
      { vendorId },
      { new: true }
    );

    if (!updatedContractor) {
      return NextResponse.json(
        { error: "Contractor not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedContractor);
  } catch (error) {
    console.error("Error updating contractor:", error);
    return NextResponse.json(
      { error: "Failed to update contractor" },
      { status: 500 }
    );
  }
}
