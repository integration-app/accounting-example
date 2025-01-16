import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Contractor } from '@/models/Contractor';
import { seedContractors } from '@/lib/seed-data';

export async function GET() {
  try {
    await connectDB();
    // Seed data in development
    if (process.env.NODE_ENV === 'development') {
      await seedContractors();
    }
    const contractors = await Contractor.find({}).sort({ name: 1 });
    return NextResponse.json(contractors);
  } catch (error) {
    console.error('Error fetching contractors:', error);
    return NextResponse.json(
      { error: 'Failed to fetch contractors' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { name } = await request.json();

    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    await connectDB();
    const contractor = new Contractor({ name });
    await contractor.save();

    return NextResponse.json(contractor);
  } catch (error) {
    console.error('Error creating contractor:', error);
    return NextResponse.json(
      { error: 'Failed to create contractor' },
      { status: 500 }
    );
  }
} 