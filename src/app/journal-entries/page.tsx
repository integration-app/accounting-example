"use client";

import * as React from "react";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useIntegrationApp } from "@integration-app/react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { format, isValid, parseISO } from "date-fns";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronLeft, ChevronRight } from "lucide-react";
import LoadingSpinner from "@/components/LoadingSpinner";

interface Account {
  id: string;
  name: string;
}

interface JournalEntry {
  id: string;
  fields: {
    trandate: string;
    trandisplayname: string;
    tranid: string;
    type: string;
    status: string;
    createddate: string;
    lastmodifieddate: string;
    account?: string; // Account ID
  };
  createdTime: string;
  updatedTime: string;
}

interface JournalEntriesParams {
  ledgerAccountId: string;
  fromDate?: string;
  toDate?: string;
  cursor: string | null;
}

const formatDate = (dateString: string | null | undefined) => {
  if (!dateString) {
    return "-";
  }

  try {
    // Try parsing as ISO date first.
    const date = parseISO(dateString);
    if (isValid(date)) {
      return format(date, "M/d/yyyy");
    }

    // If not ISO, try parsing as regular date
    const regularDate = new Date(dateString);
    if (isValid(regularDate)) {
      return format(regularDate, "M/d/yyyy");
    }

    // If all parsing fails, return a dash
    return "-";
  } catch (error) {
    console.error("Error formatting date:", error);
    return "-";
  }
};

function JournalEntriesContent() {
  const searchParams = useSearchParams();
  const integrationApp = useIntegrationApp();

  // Parse account IDs and names from URL parameters
  const accountsParam = searchParams.get("accounts") || "";
  const accountNamesParam = searchParams.get("accountNames") || "";
  const accountIds = accountsParam.split(",").filter(Boolean);
  const accountNames = accountNamesParam.split(",").filter(Boolean);

  // Create accounts map from URL parameters
  const accounts = React.useMemo(() => {
    return accountIds.reduce<Account[]>((acc, id, index) => {
      if (accountNames[index]) {
        acc.push({ id, name: decodeURIComponent(accountNames[index]) });
      }
      return acc;
    }, []);
  }, [accountIds, accountNames]);

  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 10;
  const [fromDate, setFromDate] = React.useState<string>("");
  const [toDate, setToDate] = React.useState<string>("");
  const [useFromDate, setUseFromDate] = React.useState(false);
  const [useToDate, setUseToDate] = React.useState(false);
  const [journalEntries, setJournalEntries] = React.useState<JournalEntry[]>(
    []
  );
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const paginatedEntries = React.useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return journalEntries.slice(startIndex, endIndex);
  }, [currentPage, journalEntries]);

  const totalPages = Math.ceil(journalEntries.length / itemsPerPage);

  const fetchJournalEntries = React.useCallback(async () => {
    if (!accountIds.length) {
      setError("No accounts selected");
      return;
    }

    setError(null);
    setIsLoading(true);
    try {
      const allEntries: JournalEntry[] = [];

      for (const accountId of accountIds) {
        if (!accountId) {
          continue;
        }

        try {
          const params: JournalEntriesParams = {
            ledgerAccountId: accountId,
            cursor: null,
          };

          if (useFromDate && fromDate) {
            params.fromDate = format(new Date(fromDate), "M/d/yyyy");
          }

          if (useToDate && toDate) {
            params.toDate = format(new Date(toDate), "M/d/yyyy");
          }

          const response = await integrationApp
            .connection("netsuite")
            .action("list-journal-entries")
            .run(params);

          if (response?.output?.records) {
            const entriesWithAccount = response.output.records.map(
              (entry: JournalEntry) => ({
                ...entry,
                fields: {
                  ...entry.fields,
                  account: accountId,
                },
              })
            );
            allEntries.push(...entriesWithAccount);
          }
        } catch (error) {
          console.error(
            `Error fetching entries for account ${accountId}:`,
            error
          );
          setError(`Error fetching entries for account ${accountId}`);
        }
      }

      const uniqueEntries = Array.from(
        new Map(allEntries.map((entry) => [entry.id, entry])).values()
      );

      setJournalEntries(uniqueEntries);
    } catch (error) {
      console.error("Error fetching journal entries:", error);
      setError("Failed to fetch journal entries");
    } finally {
      setIsLoading(false);
    }
  }, [accountIds, useFromDate, fromDate, useToDate, toDate, integrationApp]);

  // Fetch entries on initial load
  React.useEffect(() => {
    fetchJournalEntries();
  }, [fetchJournalEntries]);

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Journal Entries</h1>
          <p className="text-muted-foreground">
            View and filter journal entries
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-4">
          <div className="flex gap-4 items-end">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="useFromDate"
                  checked={useFromDate}
                  onCheckedChange={(checked: boolean) => {
                    setUseFromDate(checked);
                    if (!checked) setFromDate("");
                  }}
                />
                <label
                  htmlFor="useFromDate"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  From Date
                </label>
              </div>
              {useFromDate && (
                <Input
                  id="fromDate"
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="w-[200px] [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:transition-opacity [&::-webkit-calendar-picker-indicator]:hover:opacity-60"
                />
              )}
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="useToDate"
                  checked={useToDate}
                  onCheckedChange={(checked: boolean) => {
                    setUseToDate(checked);
                    if (!checked) setToDate("");
                  }}
                />
                <label
                  htmlFor="useToDate"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  To Date
                </label>
              </div>
              {useToDate && (
                <Input
                  id="toDate"
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="w-[200px] [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:transition-opacity [&::-webkit-calendar-picker-indicator]:hover:opacity-60"
                />
              )}
            </div>
          </div>

          <div>
            <Button
              onClick={fetchJournalEntries}
              disabled={isLoading}
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              {isLoading ? "Loading..." : "Filter Entries"}
            </Button>
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Journal #</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Account</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Last Modified</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedEntries.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell>{formatDate(entry.fields.trandate)}</TableCell>
                  <TableCell>{entry.fields.tranid}</TableCell>
                  <TableCell>{entry.fields.status}</TableCell>
                  <TableCell>
                    {accounts.find((a) => a.id === entry.fields.account)
                      ?.name || "-"}
                  </TableCell>
                  <TableCell>{formatDate(entry.fields.createddate)}</TableCell>
                  <TableCell>
                    {formatDate(entry.fields.lastmodifieddate)}
                  </TableCell>
                </TableRow>
              ))}
              {journalEntries.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">
                    {isLoading ? "Loading..." : "No entries found"}
                  </TableCell>
                </TableRow>
              )}
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
    </div>
  );
}

export default function JournalEntriesPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <LoadingSpinner />
        </div>
      }
    >
      <JournalEntriesContent />
    </Suspense>
  );
}
