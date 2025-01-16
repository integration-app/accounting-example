"use client";

import * as React from "react";
import useSWR from "swr";
import { useIntegrationApp } from "@integration-app/react";
import LoadingSpinner from '@/components/LoadingSpinner';
import { toast } from '@/components/ui/use-toast';
import { MappingTable } from "@/components/mapping-table";
import { Pagination } from "@/components/pagination";

interface Account {
  id: string;
  name: string;
}

interface Category {
  _id: string;
  name: string;
  accountId?: string;
}

export default function CategoriesPage() {
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 10;
  const integrationApp = useIntegrationApp();

  const { data: categories, isLoading: isCategoriesLoading, mutate: mutateCategories } = useSWR<Category[]>(
    '/api/categories',
    async (url: string) => {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch categories');
      return response.json();
    }
  );

  const { data: accountsResponse, isLoading: isAccountsLoading } = useSWR(
    "accounts",
    async () => {
      const cursor = {};
      const response = await integrationApp
        .connection("netsuite")
        .action("get-accounts")
        .run(cursor);

      return response.output.records;
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  const accounts = React.useMemo(() => {
    if (!accountsResponse || !Array.isArray(accountsResponse)) return [];
    return accountsResponse as Account[];
  }, [accountsResponse]);

  const totalPages = Math.ceil((categories?.length || 0) / itemsPerPage);

  const paginatedCategories = React.useMemo(() => {
    if (!categories) return [];
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return categories.slice(startIndex, endIndex).map(category => ({
      ...category,
      mappedId: category.accountId
    }));
  }, [currentPage, categories]);

  const handleAccountChange = async (categoryId: string, accountId: string) => {
    try {
      const response = await fetch(`/api/categories/${categoryId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accountId }),
      });

      if (!response.ok) throw new Error('Failed to update category');

      await mutateCategories();
      toast({
        title: "Success",
        description: "Category mapping updated successfully",
      });
    } catch (error) {
      console.error('Error updating category:', error);
      toast({
        title: "Error",
        description: "Failed to update category mapping",
        variant: "destructive",
      });
    }
  };

  const handleUnmap = async (categoryId: string) => {
    try {
      const response = await fetch(`/api/categories/${categoryId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accountId: null }),
      });

      if (!response.ok) throw new Error('Failed to unmap category');

      await mutateCategories();
      toast({
        title: "Success",
        description: "Category unmapped successfully",
      });
    } catch (error) {
      console.error('Error unmapping category:', error);
      toast({
        title: "Error",
        description: "Failed to unmap category",
        variant: "destructive",
      });
    }
  };

  if (isAccountsLoading || isCategoriesLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <MappingTable
        title="Categories"
        description="Map categories to accounts"
        items={paginatedCategories}
        options={accounts}
        leftColumnName="Category"
        rightColumnName="Account"
        onMap={handleAccountChange}
        onUnmap={handleUnmap}
      />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
} 