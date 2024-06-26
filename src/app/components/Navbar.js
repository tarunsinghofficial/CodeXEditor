'use client'
import Link from "next/link";
import React, { useState } from "react";

function Navbar() {

  const [navbar, setNavbar] = useState(false);

  return (
    <>
      <nav className="w-full fixed top-0 z-50 p-1 bg-transparent border-b-2 border-gray-bg backdrop-blur-md bg-clip-padding backdrop-filter bg-opacity-80 dark:bg-opacity-50">
        <div className="relative justify-between px-4 mx-auto lg:max-w-7xl md:items-center md:flex md:px-8">
          <div>
            <div className="flex items-center justify-between py-3 md:py-5 md:block">
              <Link href="/" className="flex flex-row items-center text-2xl text-blue dark:text-white font-bold">
                CodeXEditor
              </Link>
              <div className="md:hidden">
                <button
                  className="p-2 text-gray-border rounded-md outline-none"
                  onClick={() => setNavbar(!navbar)}
                >
                  {navbar ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-6 h-6 text-white"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-6 h-6 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
          <div>
            <div
              className={`flex-1 justify-self-center pb-3 mt-8 md:block md:pb-0 md:mt-0 ${navbar ? "block" : "hidden"
                }`}
            >
              <ul className="items-center text-blue dark:text-white justify-center space-y-8 md:flex md:space-x-6 md:space-y-0">
                <li className="mr-4">
                  <Link href="/">Home</Link>
                </li>
                <li>
                  <Link href="/CodeEditor">Code Editor</Link>
                </li>
                <li>
                  <Link href="/joinroom">Create Room</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>

    </>
  );
}

export default Navbar;