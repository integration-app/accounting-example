"use client";

import { useIntegrationApp, useIntegrations } from "@integration-app/react";
import type { Integration as IntegrationAppIntegration } from "@integration-app/sdk";
import { Settings } from "lucide-react";
import Link from "next/link";

export function IntegrationList() {
  const integrationApp = useIntegrationApp();
  const { integrations, refresh } = useIntegrations();

  const handleConnect = async (integration: IntegrationAppIntegration) => {
    try {
      await integrationApp.integration(integration.key).openNewConnection();
      refresh();
    } catch (error) {
      console.error("Failed to connect:", error);
    }
  };

  const handleDisconnect = async (integration: IntegrationAppIntegration) => {
    if (!integration.connection?.id) return;
    try {
      await integrationApp.connection(integration.connection.id).archive();
      refresh();
    } catch (error) {
      console.error("Failed to disconnect:", error);
    }
  };

  return (
    <ul className="space-y-4 mt-8">
      {integrations
        .filter((integration) => integration.key == "netsuite")
        .map(
          (
            integration //Only show Netsuite
          ) => (
            <li
              key={integration.key}
              className="group flex items-center space-x-4 p-4 bg-white rounded-lg shadow"
            >
              <div className="flex-shrink-0">
                {integration.logoUri ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={integration.logoUri}
                    alt={`${integration.name} logo`}
                    className="w-10 h-10 rounded-lg"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-lg font-medium text-gray-600">
                    {integration.name[0]}
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-medium text-gray-900 truncate">
                  {integration.name}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                {integration.connection && (
                  <Link
                    href={`/integrations/${integration.key}`}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-gray-100 text-gray-600 hover:bg-blue-100 hover:text-blue-700 font-medium transition-colors"
                  >
                    <Settings className="h-4 w-4" />
                    Configure
                  </Link>
                )}
                <button
                  onClick={() =>
                    integration.connection
                      ? handleDisconnect(integration)
                      : handleConnect(integration)
                  }
                  className={`px-4 py-2 rounded-md font-medium transition-colors ${
                    integration.connection
                      ? "bg-red-100 text-red-700 hover:bg-red-200 hover:text-red-800"
                      : "bg-gray-100 text-gray-600 hover:bg-blue-100 hover:text-blue-700"
                  }`}
                >
                  {integration.connection ? "Disconnect" : "Connect"}
                </button>
              </div>
            </li>
          )
        )}
    </ul>
  );
}
