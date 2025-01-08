import { useIntegrationApp } from "@integration-app/react";
import useSWR from "swr";

interface FormSchema {
  type: string;
  properties: Record<
    string,
    {
      type: string;
      title?: string;
      description?: string;
      required?: string[];
    }
  >;
  required?: string[];
}

export function useInvoiceSchema() {
  const integrationApp = useIntegrationApp();

  const {
    data: schema,
    error,
    isLoading,
  } = useSWR("invoice-schema", async () => {
    const result = await integrationApp
      .connection("netsuite")
      .dataCollection("invoices")
      .get();

    return result.fieldsSchema as FormSchema;
  });

  return {
    schema: schema || null,
    isLoading,
    error,
  };
}
