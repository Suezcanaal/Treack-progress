import React, { useState } from 'react';
import Sidebar from '../components/Sidebar.jsx';

export default function MainLayout({ children }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-screen bg-[#0B0C15]">
      <Sidebar open={open} setOpen={setOpen} />
      {/* Main content */}
      <div className={`transition-all duration-300 ${open ? 'md:ml-64' : 'md:ml-64'} ml-0`}>
        {/* Top bar placeholder with hamburger on mobile */}
        <div className="sticky top-0 z-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <button className="md:hidden px-3 py-2 rounded bg-white/5 border border-white/10" onClick={()=>setOpen(true)}>
                <span className="sr-only">Open menu</span>
                <div className="w-5 h-0.5 bg-white mb-1"/>
                <div className="w-5 h-0.5 bg-white mb-1"/>
                <div className="w-5 h-0.5 bg-white"/>
              </button>
              <div className="text-sm text-gray-400">DSA Tracker</div>
            </div>
          </div>
        </div>
        {/* Page content wrapper */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
