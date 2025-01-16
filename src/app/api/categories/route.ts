import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Category } from '@/models/Category';
import { seedCategories } from '@/lib/seed-data';

export async function GET() {
  try {
    await connectDB();
    if (process.env.NODE_ENV === 'development') {
      await seedCategories();
    }
    const categories = await Category.find({}).sort({ name: 1 });
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
} 