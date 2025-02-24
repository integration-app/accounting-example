"use client";

import { useState } from "react";

interface TabProps {
  tabs: {
    label: string;
    content: React.ReactNode;
  }[];
}

export function ConfigTabs({ tabs }: TabProps) {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="space-y-6">
      <div>
        <nav className="-mb-px flex gap-4" aria-label="Tabs">
          {tabs.map((tab, index) => (
            <button
              key={tab.label}
              onClick={() => setActiveTab(index)}
              className={`py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === index
                  ? "border-gray-900 text-gray-900"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
      <div>{tabs[activeTab].content}</div>
    </div>
  );
}
