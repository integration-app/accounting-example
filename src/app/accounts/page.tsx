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
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useSWR from "swr";
import { useIntegrationApp } from "@integration-app/react";

interface Account {
  id: string;
  name: string;
}

interface Category {
  id: string;
  name: string;
  accountId?: string;
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
  { id: "cat11", name: "Telecommunications" },
  { id: "cat12", name: "Office Rent" },
  { id: "cat13", name: "Employee Benefits" },
  { id: "cat14", name: "Legal Services" },
  { id: "cat15", name: "Advertising" },
  { id: "cat16", name: "Research and Development" },
  { id: "cat17", name: "Shipping and Delivery" },
  { id: "cat18", name: "Printing and Stationery" },
  { id: "cat19", name: "Vehicle Expenses" },
  { id: "cat20", name: "Miscellaneous" },
];

function AccountsPage() {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [categories, setCategories] = React.useState(dummyCategories);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(categories.length / itemsPerPage);
  const integrationApp = useIntegrationApp();

  const { data: accountsResponse } = useSWR("accounts", async () => {
    const cursor = {};
    const response = await integrationApp
      .connection("netsuite")
      .action("get-accounts")
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

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Accounts</h1>
          <p className="text-muted-foreground">Manage your accounts</p>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead>Account</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedCategories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>{category.name}</TableCell>
                  <TableCell>
                    <Select
                      value={category.accountId}
                      onValueChange={(value: string) =>
                        handleAccountChange(category.id, value)
                      }
                    >
                      <SelectTrigger className="w-[240px] bg-white text-gray-900 border-gray-300 shadow-sm cursor-pointer hover:bg-gray-200 hover:border-gray-400 focus:outline-none">
                        <SelectValue placeholder="Select account" />
                      </SelectTrigger>
                      <SelectContent className="max-h-[200px] overflow-y-auto bg-white border border-gray-300 shadow-lg">
                        {accounts.map((account) => (
                          <SelectItem
                            key={account.id}
                            value={account.id}
                            className="text-gray-900 cursor-pointer hover:bg-gray-200"
                          >
                            {account.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="text-sm text-muted-foreground">
          Page {currentPage} of {totalPages}
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default AccountsPage;
