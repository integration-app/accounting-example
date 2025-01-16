import { Metadata } from "next";
import { Suspense } from 'react';
import LoadingSpinner from '@/components/LoadingSpinner';

export const metadata: Metadata = {
  title: "Categories",
};

interface CategoriesLayoutProps {
  children: React.ReactNode;
}

export default function CategoriesLayout({
  children,
}: CategoriesLayoutProps) {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      {children}
    </Suspense>
  );
} 