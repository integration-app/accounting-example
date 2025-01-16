import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { ContractorMapping } from '@/models/ContractorMapping';

export async function GET() {
  try {
    await connectDB();
    const mappings = await ContractorMapping.find({});
    return NextResponse.json(mappings);
  } catch (error) {
    console.error('Error fetching contractor mappings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch contractor mappings' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { contractorId, vendorId } = await request.json();

    if (!contractorId || !vendorId) {
      return NextResponse.json(
        { error: 'contractorId and vendorId are required' },
        { status: 400 }
      );
    }

    await connectDB();

    const mapping = await ContractorMapping.findOneAndUpdate(
      { contractorId },
      { vendorId },
      { upsert: true, new: true }
    );

    return NextResponse.json(mapping);
  } catch (error) {
    console.error('Error updating contractor mapping:', error);
    return NextResponse.json(
      { error: 'Failed to update contractor mapping' },
      { status: 500 }
    );
  }
} 