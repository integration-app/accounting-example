"use client";

import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useSWR from "swr";
import { useIntegrationApp } from "@integration-app/react";
import { useRouter } from "next/navigation";

interface Account {
  id: string;
  name: string;
}

interface Category {
  id: string;
  name: string;
  accountId?: string;
  selected?: boolean;
}

const dummyCategories: Category[] = [
  { id: "cat1", name: "Office Supplies" },
  { id: "cat2", name: "Travel Expenses" },
  { id: "cat3", name: "Marketing" },
  { id: "cat4", name: "Software Subscriptions" },
  { id: "cat5", name: "Professional Services" },
  { id: "cat6", name: "Equipment" },
  { id: "cat7", name: "Training" },
  { id: "cat8", name: "Utilities" },
  { id: "cat9", name: "Insurance" },
  { id: "cat10", name: "Maintenance" },
];

export function AccountsTab() {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [categories, setCategories] = React.useState(dummyCategories);
  const [selectedCategories, setSelectedCategories] = React.useState<string[]>(
    []
  );
  const itemsPerPage = 10;
  const totalPages = Math.ceil(categories.length / itemsPerPage);
  const integrationApp = useIntegrationApp();
  const router = useRouter();

  const { data: accountsResponse } = useSWR("accounts", async () => {
    const cursor = {};
    const response = await integrationApp
      .connection("netsuite")
      .action("list-ledger-accounts")
      .run(cursor);

    return response.output.records;
  });

  const accounts = React.useMemo(() => {
    if (!accountsResponse || !Array.isArray(accountsResponse)) return [];
    return accountsResponse as Account[];
  }, [accountsResponse]);

  const paginatedCategories = React.useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return categories.slice(startIndex, endIndex);
  }, [currentPage, categories]);

  const handleAccountChange = (categoryId: string, accountId: string) => {
    setCategories((prev) =>
      prev.map((category) =>
        category.id === categoryId ? { ...category, accountId } : category
      )
    );
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleImportJournalEntries = () => {
    const selectedCats = categories.filter(
      (cat) => selectedCategories.includes(cat.id) && cat.accountId
    );

    if (selectedCats.length === 0) {
      alert("Please select at least one category with an assigned account");
      return;
    }

    const selectedAccountIds = selectedCats
      .map((cat) => cat.accountId)
      .filter(Boolean);
    const selectedAccountNames = selectedCats
      .map((cat) => accounts.find((a) => a.id === cat.accountId)?.name)
      .filter((name): name is string => name !== undefined)
      .map((name) => encodeURIComponent(name));

    const searchParams = new URLSearchParams();
    searchParams.set("accounts", selectedAccountIds.join(","));
    searchParams.set("accountNames", selectedAccountNames.join(","));
    router.push(`/journal-entries?${searchParams.toString()}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button
          onClick={handleImportJournalEntries}
          disabled={selectedCategories.length === 0}
          className="bg-blue-600 text-white hover:bg-blue-700"
        >
          Import Journal Entries
        </Button>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">Select</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Account</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedCategories.map((category) => (
              <TableRow key={category.id}>
                <TableCell>
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category.id)}
                    onChange={() => handleCategorySelect(category.id)}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                </TableCell>
                <TableCell>{category.name}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 w-[300px]">
                    <Select
                      value={category.accountId}
                      onValueChange={(value: string) =>
                        handleAccountChange(category.id, value)
                      }
                    >
                      <SelectTrigger className="w-[240px] bg-white text-gray-900 border-gray-300 hover:bg-blue-50 cursor-pointer">
                        <SelectValue placeholder="Select account" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-gray-300 shadow-lg max-h-[300px] overflow-y-auto">
                        {accounts.map((account) => (
                          <SelectItem
                            key={account.id}
                            value={account.id}
                            className="text-gray-900 cursor-pointer hover:bg-blue-50 hover:text-blue-600"
                          >
                            {account.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="w-8">
                      {category.accountId && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleAccountChange(category.id, "")}
                          className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-700"
                          title="Unmap account"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="text-sm text-muted-foreground">
          Page {currentPage} of {totalPages}
        </div>
        <div className="flex space-x-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 hover:bg-blue-100 hover:text-blue-700 dark:hover:bg-blue-700 dark:hover:text-blue-100"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 hover:bg-blue-100 hover:text-blue-700 dark:hover:bg-blue-700 dark:hover:text-blue-100"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
