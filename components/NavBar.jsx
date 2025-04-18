"use client";

import { useState } from "react";
import Link from "next/link";

export default function NavBar() {
  // Track whether the mobile menu is open
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="inset-x-0 top-0 z-50">
      <nav className="mx-auto flex items-baseline p-6 lg:px-8">
        {/* Left side: H1 */}
        <div className="flex items-baseline gap-x-4">
          <Link href="/">
            <h1 className="text-2xl font-bold leading-tight text-gray-900">
              The Future of{" "}
              <span className="bg-gradient-to-r from-pink-500 to-red-500 bg-clip-text text-transparent">
                Change
              </span>
            </h1>
          </Link>
        </div>

        {/* Right side: “Petition generator” link, visible on lg+ screens */}
        <div className="ml-8 hidden lg:flex lg:gap-x-12">
          <Link
            href="/generate-draft"
            className="text-sm font-semibold leading-tight text-gray-500 hover:text-gray-700"
          >
            Petition generator
          </Link>
        </div>

        <div className="ml-8 hidden lg:flex lg:gap-x-12">
          <Link
            href="/quality-score"
            className="text-sm font-semibold leading-tight text-gray-500 hover:text-gray-700"
          >
            Quality score
          </Link>
        </div>

        <div className="ml-8 hidden lg:flex lg:gap-x-12">
          <Link
            href="/supporter-to-starter"
            className="text-sm font-semibold leading-tight text-gray-500 hover:text-gray-700"
          >
            Supporter-to-starter recs
          </Link>
        </div>

        {/* Mobile menu button (hamburger) */}
        <div className="ml-auto lg:hidden">
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="size-6"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile menu panel, only shown when isOpen === true */}
      {isOpen && (
        <div className="block lg:hidden px-6 pb-4">
          <Link
            href="/"
            className="block mb-2 text-sm font-semibold leading-tight text-gray-500 hover:text-gray-700"
          >
            Petition generator
          </Link>
          {/* Add any other mobile-only links or sections here */}
        </div>
      )}
    </header>
  );
}