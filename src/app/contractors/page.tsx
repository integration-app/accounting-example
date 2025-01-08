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
  links: {
    rel: string;
    href: string;
  }[];
  id: string;
}

interface Contractor {
  id: string;
  name: string;
  accountId?: string;
}

const dummyContractors: Contractor[] = [
  { id: "c1", name: "John Smith" },
  { id: "c2", name: "Sarah Johnson" },
  { id: "c3", name: "Michael Brown" },
  { id: "c4", name: "Emily Davis" },
  { id: "c5", name: "David Wilson" },
  { id: "c6", name: "Lisa Anderson" },
  { id: "c7", name: "James Taylor" },
  { id: "c8", name: "Jennifer Martinez" },
  { id: "c9", name: "Robert Thompson" },
  { id: "c10", name: "Jessica White" },
  { id: "c11", name: "William Clark" },
  { id: "c12", name: "Elizabeth Lee" },
  { id: "c13", name: "Christopher Rodriguez" },
  { id: "c14", name: "Michelle Lewis" },
  { id: "c15", name: "Daniel Walker" },
  { id: "c16", name: "Amanda Hall" },
  { id: "c17", name: "Kevin Young" },
  { id: "c18", name: "Melissa King" },
  { id: "c19", name: "Thomas Wright" },
  { id: "c20", name: "Laura Scott" },
];

function ContractorsPage() {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [contractors, setContractors] = React.useState(dummyContractors);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(contractors.length / itemsPerPage);
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

  const paginatedContractors = React.useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return contractors.slice(startIndex, endIndex);
  }, [currentPage, contractors]);

  const handleAccountChange = (contractorId: string, accountId: string) => {
    setContractors((prev) =>
      prev.map((contractor) =>
        contractor.id === contractorId
          ? { ...contractor, accountId }
          : contractor
      )
    );
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold tracking-tight mb-4">Contractors</h1>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Account</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedContractors.map((contractor) => (
              <TableRow key={contractor.id}>
                <TableCell>{contractor.name}</TableCell>
                <TableCell>
                  <Select
                    value={contractor.accountId}
                    onValueChange={(value: string) =>
                      handleAccountChange(contractor.id, value)
                    }
                  >
                    <SelectTrigger className="w-[240px]">
                      <SelectValue placeholder="Select account" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[200px] overflow-y-auto">
                      {accounts.map((account) => (
                        <SelectItem key={account.id} value={account.id}>
                          {account.id}
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

export default ContractorsPage;
