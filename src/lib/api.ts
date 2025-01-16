import { getAuthToken } from '@/lib/auth'; // Implement this based on your auth solution

export async function getContractors() {
  const token = getAuthToken();
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/contractors`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch contractors');
  }

  return response.json();
} 