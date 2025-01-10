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

interface Vendor {
  id: string;
  entityId: string;
  name: string;
}

interface Contractor {
  id: string;
  name: string;
  vendorId?: string;
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

  const { data: vendorsResponse } = useSWR("vendors", async () => {
    const cursor = {};
    const response = await integrationApp
      .connection("netsuite")
      .action("get-vendors")
      .run(cursor);

    return response.output.records;
  });

  const vendors = React.useMemo(() => {
    if (!vendorsResponse || !Array.isArray(vendorsResponse)) return [];
    return vendorsResponse as Vendor[];
  }, [vendorsResponse]);

  const paginatedContractors = React.useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return contractors.slice(startIndex, endIndex);
  }, [currentPage, contractors]);

  const handleVendorChange = (contractorId: string, vendorId: string) => {
    setContractors((prev) =>
      prev.map((contractor) =>
        contractor.id === contractorId
          ? { ...contractor, vendorId }
          : contractor
      )
    );
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Contractors</h1>
          <p className="text-muted-foreground">Manage your contractors</p>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Vendor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedContractors.map((contractor) => (
                <TableRow key={contractor.id}>
                  <TableCell>{contractor.name}</TableCell>
                  <TableCell>
                    <Select
                      value={contractor.vendorId}
                      onValueChange={(value: string) =>
                        handleVendorChange(contractor.id, value)
                      }
                    >
                      <SelectTrigger className="w-[240px] bg-white text-gray-950 border-gray-300 shadow-sm cursor-pointer hover:bg-gray-100 font-medium">
                        <SelectValue
                          placeholder="Select vendor"
                          className="text-gray-500"
                        />
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-gray-300 shadow-lg">
                        {vendors.map((vendor) => (
                          <SelectItem
                            key={vendor.id}
                            value={vendor.id}
                            className="text-gray-950 cursor-pointer hover:bg-gray-100 font-medium"
                          >
                            {vendor.name}
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

export default ContractorsPage;
