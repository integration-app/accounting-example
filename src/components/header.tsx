"use client";

import Link from "next/link";
import Image from "next/image";

export function Header() {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Image
                src="/logo.svg"
                alt="Logo"
                width={32}
                height={32}
                className="dark:invert"
              />
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                href="/"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium"
              >
                Overview
              </Link>
              <Link
                href="/integrations"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium"
              >
                Integrations
              </Link>
              <Link
                href="/invoices"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium"
              >
                Invoices
              </Link>
              <Link
                href="/contractors"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium"
              >
                Contractors
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
