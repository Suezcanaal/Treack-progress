import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutGrid, Layers, Settings, LogOut, X } from 'lucide-react';
import { useAuth } from '../AuthContext.jsx';

export default function Sidebar({ open, setOpen }) {
  const { setToken } = useAuth();
  const navigate = useNavigate();
  const navClasses = ({ isActive }) =>
    `group relative flex items-center gap-3 px-4 py-3 rounded-lg transition
     ${isActive ? 'bg-white/10 border-l-4 border-violet-500' : 'hover:bg-white/5'}`;

  return (
    <>
      {/* Overlay for mobile */}
      <div className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden ${open ? '' : 'hidden'}`} onClick={()=>setOpen(false)} />

      <aside className={`fixed inset-y-0 left-0 w-64 glass p-4 z-40 transform transition-transform duration-300 ${open ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 grid place-items-center font-bold">D</div>
            <span className="font-semibold">DSA Tracker</span>
          </div>
          <button className="md:hidden p-2 rounded bg-white/5" onClick={()=>setOpen(false)}><X size={18}/></button>
        </div>

        <nav className="space-y-1">
          <NavLink to="/dashboard" className={navClasses}>
            <LayoutGrid size={18} className="text-violet-400"/> Dashboard
          </NavLink>
          <NavLink to="/" className={navClasses}>
            <Layers size={18} className="text-indigo-400"/> Sheets
          </NavLink>
          <NavLink to="/settings" className={navClasses}>
            <Settings size={18} className="text-gray-400"/> Settings
          </NavLink>
        </nav>

        <div className="absolute bottom-4 left-0 w-full px-4">
          <div className="glass p-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/10"/>
              <div className="text-sm">
                <p className="font-medium">User</p>
                <p className="text-gray-400">user@example.com</p>
              </div>
            </div>
            <button onClick={()=>{ setToken(null); navigate('/', { replace: true }); }} className="mt-3 w-full text-left text-sm text-gray-400 hover:text-white inline-flex items-center gap-2">
              <LogOut size={16}/> Logout
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
