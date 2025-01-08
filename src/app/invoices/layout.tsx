import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Invoices",
};

interface InvoicesLayoutProps {
  children: React.ReactNode;
}

export default function InvoicesLayout({ children }: InvoicesLayoutProps) {
  return <div className="flex-1">{children}</div>;
}
