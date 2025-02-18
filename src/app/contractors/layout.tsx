import { Metadata } from "next";
import { Suspense } from 'react';
import LoadingSpinner from '@/components/LoadingSpinner';

export const metadata: Metadata = {
  title: "Contractors",
};

interface ContractorsLayoutProps {
  children: React.ReactNode;
}

export default function ContractorsLayout({
  children,
}: ContractorsLayoutProps) {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      {children}
    </Suspense>
  );
}
