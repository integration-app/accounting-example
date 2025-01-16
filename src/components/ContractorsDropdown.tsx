'use client';

import { useEffect } from 'react';
import useSWR from 'swr';
import { getContractors } from '@/lib/api';
import LoadingSpinner from './LoadingSpinner';

export default function ContractorsDropdown() {
  const { data: contractors, isLoading } = useSWR('/api/contractors', getContractors, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    // Your dropdown JSX...
  );
} 