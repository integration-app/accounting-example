import { connectDB } from './mongodb';
import { Contractor } from '@/models/Contractor';
import { Category } from '@/models/Category';

const INITIAL_CONTRACTORS = [
  { name: "John Smith" },
  { name: "Sarah Johnson" },
  { name: "Michael Brown" },
  { name: "Emily Davis" },
];

const INITIAL_CATEGORIES = [
  { name: "Travel" },
  { name: "Office Supplies" },
  { name: "Software" },
  { name: "Hardware" },
  { name: "Professional Services" },
];

export async function seedContractors() {
  try {
    await connectDB();
    const count = await Contractor.countDocuments();
    if (count === 0) {
      await Contractor.insertMany(INITIAL_CONTRACTORS);
      console.log('Contractors seeded successfully');
    }
  } catch (error) {
    console.error('Error seeding contractors:', error);
  }
}

export async function seedCategories() {
  try {
    await connectDB();
    const count = await Category.countDocuments();
    if (count === 0) {
      await Category.insertMany(INITIAL_CATEGORIES);
      console.log('Categories seeded successfully');
    }
  } catch (error) {
    console.error('Error seeding categories:', error);
  }
} 