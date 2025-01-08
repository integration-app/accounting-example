"use client";

import * as React from "react";
import { useInvoiceSchema } from "@/hooks/use-invoice-schema";
import { Button } from "@/components/ui/button";
import { useIntegrationApp } from "@integration-app/react";
import { DataInput } from "@integration-app/react";

interface InvoiceFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function InvoiceForm({ onSuccess, onCancel }: InvoiceFormProps) {
  const { schema, isLoading, error } = useInvoiceSchema();
  const [formData, setFormData] = React.useState<Record<string, unknown>>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const integrationApp = useIntegrationApp();

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      await integrationApp
        .connection("netsuite")
        .action("create-invoice")
        .run(formData);

      onSuccess();
    } catch (error) {
      console.error("Failed to create invoice:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div>Loading form...</div>;
  }

  if (error) {
    return <div>Error loading form schema</div>;
  }

  if (!schema) {
    return null;
  }

  return (
    <div className="space-y-6">
      <style jsx global>{`
        .ia-form-field {
          margin-bottom: 1rem;
        }
        .ia-form-label {
          font-size: 0.875rem;
          font-weight: 500;
          margin-bottom: 0.5rem;
          color: #374151;
        }
        .ia-form-input {
          width: 100%;
          padding: 0.5rem;
          border: 1px solid #e5e7eb;
          border-radius: 0.375rem;
          font-size: 0.875rem;
          background: white;
        }
        .ia-form-input:focus {
          outline: none;
          border-color: #2563eb;
          ring: 2px;
          ring-color: #3b82f6;
        }
      `}</style>
      <div className="grid gap-4 py-4">
        <DataInput schema={schema} value={formData} onChange={setFormData} />
      </div>
      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="min-w-[100px]"
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting || Object.keys(formData).length === 0}
          className="min-w-[140px] bg-gray-700 hover:bg-gray-600"
        >
          {isSubmitting ? "Creating..." : "Create Invoice"}
        </Button>
      </div>
    </div>
  );
}
