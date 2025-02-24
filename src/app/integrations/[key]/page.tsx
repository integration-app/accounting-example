import { notFound } from "next/navigation";
import { ConfigTabs } from "./components/config-tabs";
import { ContractorsTab } from "./components/contractors-tab";
import { AccountsTab } from "./components/accounts-tab";

interface IntegrationPageProps {
  params: {
    key: string;
  };
}

const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

export default function IntegrationPage({ params }: IntegrationPageProps) {
  // Only allow netsuite for now
  if (params.key !== "netsuite") {
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
        {capitalize(params.key)} Configuration
      </h1>
      <ConfigTabs tabs={tabs} />
    </div>
  );
}
