import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contractors",
};

interface ContractorsLayoutProps {
  children: React.ReactNode;
}

export default function ContractorsLayout({
  children,
}: ContractorsLayoutProps) {
  return <div className="flex-1">{children}</div>;
}
