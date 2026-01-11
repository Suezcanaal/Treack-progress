import React from 'react';
import { Star, Search, Filter, NotebookPen } from 'lucide-react';

export default function FilterBar({ query, onQuery, status, onStatus, difficulty, onDifficulty }) {
  return (
    <div className="sticky top-0 z-10 glass p-3 mb-3">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-center">
        <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-2">
          <Search size={16} className="text-gray-400"/>
          <input value={query} onChange={(e)=>onQuery(e.target.value)} placeholder="Search problems..." className="bg-transparent w-full outline-none"/>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400">Status</span>
          <select value={status} onChange={(e)=>onStatus(e.target.value)} className="input py-2">
            <option value="all">All</option>
            <option value="solved">Solved</option>
            <option value="unsolved">Unsolved</option>
            <option value="starred">Saved for Revision</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400">Difficulty</span>
          <select value={difficulty} onChange={(e)=>onDifficulty(e.target.value)} className="input py-2">
            <option value="all">All</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>
        <div className="text-right text-sm text-gray-400 hidden md:block">
          Use the star to save for revision and the pencil to add notes.
        </div>
      </div>
    </div>
  );
}
