import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 backdrop-blur-lg border-b border-white/10 bg-black/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left - Logo */}
        <Link to="/" className="text-white font-bold tracking-tight">
          DSA Tracker
        </Link>

        {/* Right - Actions */}
        <div className="flex items-center gap-3">
          <Link to="/login" className="px-4 py-2 text-gray-300 hover:text-white">
            Login
          </Link>
          <Link
            to="/signup"
            className="px-5 py-2 rounded-full bg-white text-black font-medium hover:bg-gray-100 transition"
          >
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
}
