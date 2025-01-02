import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300  w-full  ">
      <div className="max-w-7xl mx-auto px-4 py-2 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2  sm:grid-cols lg:grid-cols-4 gap-8">
          {/* Section 1: About Us */}
          <div>
            <h2 className="text-lg font-semibold text-white">About Us</h2>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:underline">
                  Company Info
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:underline">
                  Our Team
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:underline">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:underline">
                  Newsroom
                </Link>
              </li>
            </ul>
          </div>

          {/* Section 2: Customer Support */}
          <div>
            <h2 className="text-lg font-semibold text-white">
              Customer Support
            </h2>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:underline">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:underline">
                  Shipping & Delivery
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:underline">
                  Returns & Refunds
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:underline">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Section 3: Policies */}
          <div>
            <h2 className="text-lg font-semibold text-white">Policies</h2>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:underline">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:underline">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:underline">
                  Sitemap
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:underline">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Section 4: Stay Connected */}
          <div>
            <h2 className="text-lg font-semibold text-white">Stay Connected</h2>
            <div className="mt-4 flex space-x-4">
              <a
                href="https://facebook.com"
                className="text-gray-400 hover:text-white"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.99 3.657 9.128 8.438 9.878v-6.988h-2.54v-2.89h2.54V9.772c0-2.506 1.493-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.465h-1.26c-1.243 0-1.63.771-1.63 1.562v1.872h2.773l-.443 2.89h-2.33v6.988C18.344 21.128 22 16.99 22 12z" />
                </svg>
              </a>
              <a
                href="https://twitter.com"
                className="text-gray-400 hover:text-white"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M22.162 5.656c-.815.363-1.692.607-2.611.716a4.566 4.566 0 002.01-2.513 9.1 9.1 0 01-2.887 1.102 4.548 4.548 0 00-7.767 4.14 12.91 12.91 0 01-9.37-4.756 4.533 4.533 0 001.407 6.062 4.497 4.497 0 01-2.06-.569v.057a4.547 4.547 0 003.646 4.454 4.536 4.536 0 01-2.056.078 4.544 4.544 0 004.243 3.154 9.098 9.098 0 01-6.707 1.872 12.856 12.856 0 006.965 2.048c8.35 0 12.92-6.916 12.92-12.92 0-.196-.004-.393-.013-.589a9.215 9.215 0 002.267-2.341z" />
                </svg>
              </a>
              <a
                href="https://instagram.com"
                className="text-gray-400 hover:text-white"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M7.75 2A5.75 5.75 0 002 7.75v8.5A5.75 5.75 0 007.75 22h8.5A5.75 5.75 0 0022 16.25v-8.5A5.75 5.75 0 0016.25 2h-8.5zm10.75 5.75a1.25 1.25 0 110-2.5 1.25 1.25 0 010 2.5zM12 6.25A5.75 5.75 0 1112 17a5.75 5.75 0 010-11.5zm0 2a3.75 3.75 0 100 7.5 3.75 3.75 0 000-7.5z" />
                </svg>
              </a>
            </div>
            <button className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600">
              Subscribe
            </button>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-700 pt-4">
          <p className="text-center text-sm text-gray-400">
            © {new Date().getFullYear()} Your E-Commerce. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
