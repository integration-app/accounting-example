import { notFound } from "next/navigation";
import { ConfigTabs } from "./components/config-tabs";
import { ContractorsTab } from "./components/contractors-tab";
import { AccountsTab } from "./components/accounts-tab";

export default async function IntegrationPage({
  params,
}: {
  params: Promise<{ key: string }>;
}) {
  const integrationKey = (await params).key;
  // Only allow netsuite for now
  if (integrationKey !== "netsuite") {
    notFound();
  }

  const tabs = [
    {
      label: "Contractors",
      content: <ContractorsTab />,
    },
    {
      label: "Accounts",
      content: <AccountsTab />,
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">
        {integrationKey.charAt(0).toUpperCase() + integrationKey.slice(1)}{" "}
        Configuration
      </h1>
      <ConfigTabs tabs={tabs} />
    </div>
  );
}
