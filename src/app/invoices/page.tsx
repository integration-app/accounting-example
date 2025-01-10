"use client";

import * as React from "react";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, Power } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { InvoiceForm } from "./components/invoice-form";

function InvoicesPage() {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [isSyncEnabled, setIsSyncEnabled] = React.useState(false);

  const handleCreateSuccess = () => {
    setIsDialogOpen(false);
  };

  const handleToggleSync = () => {
    setIsSyncEnabled(!isSyncEnabled);
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Invoices</h1>
            <p className="text-muted-foreground">Manage your invoices</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              className={
                isSyncEnabled
                  ? "bg-red-100 text-red-700 dark:bg-red-700 dark:text-red-100 hover:bg-red-200 hover:text-red-800 dark:hover:bg-red-800 dark:hover:text-red-100"
                  : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 hover:bg-blue-100 hover:text-blue-700 dark:hover:bg-blue-700 dark:hover:text-blue-100"
              }
              onClick={handleToggleSync}
            >
              <Power className="mr-2 h-4 w-4" />
              {isSyncEnabled ? "Disable Sync" : "Enable Sync"}
            </Button>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="secondary"
                  className="bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 hover:bg-blue-100 hover:text-blue-700 dark:hover:bg-blue-700 dark:hover:text-blue-100"
                >
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
            <TableBody></TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}

export default InvoicesPage;
