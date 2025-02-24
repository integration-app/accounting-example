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
import LoadingSpinner from "@/components/LoadingSpinner";
import { toast } from "@/components/ui/use-toast";

interface Vendor {
  id: string;
  entityId: string;
  name: string;
}

interface Contractor {
  _id: string;
  name: string;
  vendorId?: string;
}

export function ContractorsTab() {
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 10;
  const integrationApp = useIntegrationApp();

  const {
    data: contractors,
    isLoading: isContractorsLoading,
    mutate: mutateContractors,
  } = useSWR<Contractor[]>("/api/contractors", async (url: string) => {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch contractors");
    return response.json();
  });

  const { data: vendorsResponse, isLoading: isVendorsLoading } = useSWR(
    "vendors",
    async () => {
      const cursor = {};
      const response = await integrationApp
        .connection("netsuite")
        .action("get-vendors")
        .run(cursor);

      return response.output.records;
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  const vendors = React.useMemo(() => {
    if (!vendorsResponse || !Array.isArray(vendorsResponse)) return [];
    return vendorsResponse as Vendor[];
  }, [vendorsResponse]);

  const totalPages = Math.ceil((contractors?.length || 0) / itemsPerPage);

  const paginatedContractors = React.useMemo(() => {
    if (!contractors) return [];
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return contractors.slice(startIndex, endIndex);
  }, [currentPage, contractors]);

  const handleVendorChange = async (contractorId: string, vendorId: string) => {
    try {
      const response = await fetch(`/api/contractors/${contractorId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ vendorId }),
      });

      if (!response.ok) {
        throw new Error("Failed to update contractor");
      }

      await mutateContractors();

      toast({
        title: "Success",
        description: "Contractor mapping updated successfully",
      });
    } catch (error) {
      console.error("Error updating contractor:", error);
      toast({
        title: "Error",
        description: "Failed to update contractor mapping",
        variant: "destructive",
      });
    }
  };

  const handleUnmap = async (contractorId: string) => {
    try {
      const response = await fetch(`/api/contractors/${contractorId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ vendorId: null }),
      });

      if (!response.ok) {
        throw new Error("Failed to unmap contractor");
      }

      await mutateContractors();

      toast({
        title: "Success",
        description: "Contractor unmapped successfully",
      });
    } catch (error) {
      console.error("Error unmapping contractor:", error);
      toast({
        title: "Error",
        description: "Failed to unmap contractor",
        variant: "destructive",
      });
    }
  };

  if (isVendorsLoading || isContractorsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
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
              <TableRow key={contractor._id}>
                <TableCell>{contractor.name}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Select
                      value={contractor.vendorId || ""}
                      onValueChange={(value: string) =>
                        handleVendorChange(contractor._id, value)
                      }
                    >
                      <SelectTrigger className="w-[240px] bg-white text-gray-900 border-gray-300 hover:bg-blue-50 cursor-pointer">
                        <SelectValue
                          placeholder="---"
                          className="text-gray-500"
                        />
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-gray-300 shadow-lg">
                        {vendors.map((vendor) => (
                          <SelectItem
                            key={vendor.id}
                            value={vendor.id}
                            className="text-gray-900 cursor-pointer hover:text-gray-950"
                          >
                            {vendor.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {contractor.vendorId && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleUnmap(contractor._id)}
                        className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-700"
                        title="Unmap vendor"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
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
