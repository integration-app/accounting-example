"use client";

import React from "react";
import useSWR from "swr";
import { getContractors } from "@/lib/api";
import LoadingSpinner from "./LoadingSpinner";

interface Contractor {
  id: string;
  name: string;
}

interface ContractorsDropdownProps {
  onSelect: (contractorId: string) => void;
  selectedContractorId?: string;
}

export default function ContractorsDropdown({
  onSelect,
  selectedContractorId,
}: ContractorsDropdownProps) {
  const { data: contractors, isLoading } = useSWR<Contractor[]>(
    "/api/contractors",
    getContractors,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="w-full">
      <select
        className="w-full rounded-md border border-gray-300 px-3 py-2"
        value={selectedContractorId || ""}
        onChange={(e) => onSelect(e.target.value)}
      >
        <option value="">Select a contractor...</option>
        {contractors?.map((contractor) => (
          <option key={contractor.id} value={contractor.id}>
            {contractor.name}
          </option>
        ))}
      </select>
    </div>
  );
}
