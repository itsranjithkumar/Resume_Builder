"use client";

import { useUser } from "./useUser";
import Image from "next/image";

export default function InlineNavbar() {
  const user = useUser();
  console.log(user, "user");
  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 mb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex-shrink-0">
            <h1 className="text-xl font-semibold text-gray-900">Resume Builder</h1>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <a
                href="/jd-optimizer"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                JD-Optimizer
              </a>
              <a
                href="/resume-preview"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                JSON Resume
              </a>
              {user ? (
                <a href="/login" className="flex items-center px-3 py-2">
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt="Profile"
                      className="w-8 h-8 rounded-full border-2 border-gray-300 shadow-sm"
                    />
                  ) : (
                    <span
                      className="w-8 h-8 flex items-center justify-center rounded-full bg-green-600 text-white font-bold text-lg border-2 border-gray-300 shadow-sm"
                      style={{ minWidth: 32, minHeight: 32 }}
                    >
                      {user.sub ? user.sub[0].toUpperCase() : "U"}
                    </span>
                  )}
                  <span className="ml-2 text-gray-700 text-sm font-medium">{user.sub}</span>
                  <span className="ml-2 text-gray-700 text-sm"></span>
                  
                </a>

              ) : (
                <a
                  href="/login"
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  Login
                </a>
              )}
            </div>
          </div>

          {/* Logout Button */}
          <div className="flex items-center space-x-4">
            {user && (
              <a
                href="/login"
                className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                Logout
              </a>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              type="button"
              className="bg-gray-50 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-500"
              onClick={() => {
                const mobileMenu = document.getElementById("mobile-menu");
                if (mobileMenu) {
                  mobileMenu.classList.toggle("hidden");
                }
              }}
            >
              <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div className="md:hidden hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
            <a
              href="/jd-optimizer"
              className="text-gray-600 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium"
            >
              JD-Optimizer
            </a>
            <a
              href="/resume-preview"
              className="text-gray-600 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium"
            >
              JSON Resume
            </a>
            {user ? (
              <a href="/profile" className="flex items-center block px-3 py-2">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt="Profile"
                    className="w-8 h-8 rounded-full border-2 border-gray-300 shadow-sm"
                  />
                ) : (
                  <span
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-green-600 text-white font-bold text-lg border-2 border-gray-300 shadow-sm"
                    style={{ minWidth: 32, minHeight: 32 }}
                  >
                    {user.sub ? user.sub[0].toUpperCase() : "U"}
                  </span>
                )}
                <span className="ml-2 text-gray-700 text-base font-medium">{user.sub}</span>
                <span className="ml-2 text-gray-700 text-base">Profile</span>
              </a>
            ) : (
              <a
                href="/login"
                className="text-gray-600 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium"
              >
                Login
              </a>
            )}
            {user && (
              <a
                href="/login"
                className="bg-gray-900 hover:bg-gray-800 text-white block px-3 py-2 rounded-md text-base font-medium"
              >
                Logout
              </a>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
