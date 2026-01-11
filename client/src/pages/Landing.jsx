import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import { Target, BarChart3, Sparkles } from 'lucide-react';
import { useAuth } from '../AuthContext.jsx';

export default function Landing() {
  const { token } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (token) navigate('/dashboard', { replace: true });
  }, [token, navigate]);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-gray-100">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-sm text-gray-300">
          <span className="text-xs">v1.0 Now Live 🚀</span>
        </div>

        <h1 className="mt-6 font-bold tracking-tight text-5xl md:text-7xl">
          Master Data Structures.
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-500">Without the Chaos.</span>
        </h1>

        <p className="max-w-2xl mx-auto mt-6 text-lg text-gray-400">
          Track your progress across Striver SDE Sheet, Blind 75, Java Revision, and your own custom lists. Stay focused with a clean interface and data you can act on.
        </p>

        <div className="mt-8 flex items-center justify-center gap-4">
          <Link to="/signup" className="px-6 py-3 rounded-full font-medium bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-600/30">
            Start Solving Free
          </Link>
          <Link to="/login" className="px-6 py-3 rounded-full border border-white/10 text-gray-200 hover:bg-white/5">
            View Demo
          </Link>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="p-6 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all text-left">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 grid place-items-center mb-4">
              <Target size={20} />
            </div>
            <h3 className="font-semibold text-white mb-2">Curated Sheets</h3>
            <p className="text-gray-400 text-sm">Access Blind 75 and Striver SDE sheets out of the box.</p>
          </div>
          <div className="p-6 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all text-left">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 grid place-items-center mb-4">
              <BarChart3 size={20} />
            </div>
            <h3 className="font-semibold text-white mb-2">Progress Analytics</h3>
            <p className="text-gray-400 text-sm">Visualize your progress with clear charts and heatmaps.</p>
          </div>
          <div className="p-6 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all text-left">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 grid place-items-center mb-4">
              <Sparkles size={20} />
            </div>
            <h3 className="font-semibold text-white mb-2">Customizable</h3>
            <p className="text-gray-400 text-sm">Create your own sheets and manage your interview prep your way.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
