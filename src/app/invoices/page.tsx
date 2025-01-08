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
import { RefreshCw, Plus } from "lucide-react";
import { useIntegrationApp } from "@integration-app/react";
import useSWR from "swr";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { InvoiceForm } from "./components/invoice-form";

interface Invoice {
  id: string;
  status?: string;
  amount?: string | number;
  date?: string;
}

function InvoicesPage() {
  const [isImporting, setIsImporting] = React.useState(false);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const integrationApp = useIntegrationApp();
  const {
    data: invoicesResponse,
    error,
    mutate,
  } = useSWR("invoices", async () => {
    const response = await integrationApp
      .connection("netsuite")
      .action("list-invoices")
      .run();
    return response.output.records;
  });

  const invoices = React.useMemo(() => {
    if (!invoicesResponse || !Array.isArray(invoicesResponse)) return [];
    return invoicesResponse as Invoice[];
  }, [invoicesResponse]);

  const handleImport = async () => {
    try {
      setIsImporting(true);
      await integrationApp.connection("netsuite").action("list-invoices").run();
      await mutate(); // Refresh the data
    } catch (error) {
      console.error("Failed to import invoices:", error);
    } finally {
      setIsImporting(false);
    }
  };

  const handleCreateSuccess = async () => {
    setIsDialogOpen(false);
    await mutate(); // Refresh the list after creating
  };

  if (error) {
    return <div>Error loading invoices</div>;
  }

  if (!invoices) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Invoices</h1>
            <p className="text-muted-foreground">Manage your invoices</p>
          </div>
          <div className="flex gap-2">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Invoice
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Invoice</DialogTitle>
                </DialogHeader>
                <InvoiceForm
                  onSuccess={handleCreateSuccess}
                  onCancel={() => setIsDialogOpen(false)}
                />
              </DialogContent>
            </Dialog>
            <Button onClick={handleImport} disabled={isImporting}>
              <RefreshCw
                className={`mr-2 h-4 w-4 ${isImporting ? "animate-spin" : ""}`}
              />
              {isImporting ? "Importing..." : "Import Invoices"}
            </Button>
          </div>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell>{invoice.id}</TableCell>
                  <TableCell>{invoice.status}</TableCell>
                  <TableCell>{invoice.amount}</TableCell>
                  <TableCell>{invoice.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}

export default InvoicesPage;
