import React, { useMemo, useState } from 'react';
import { CheckCircle2, ExternalLink, Star, Pencil } from 'lucide-react';

export default function ProblemTable({ selected, problems, onToggleSolved, onToggleStar, onOpenNotes }) {
  const [q, setQ] = useState('');

  const filtered = useMemo(() => {
    return problems.filter((p) => p.title.toLowerCase().includes(q.toLowerCase()));
  }, [problems, q]);

  return (
    <div className="space-y-3">
      {/* Sticky search */}
      <div className="sticky top-16 z-10">
        <div className="glass p-3">
          <input
            value={q}
            onChange={(e)=>setQ(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white placeholder-gray-500 focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
            placeholder="Search problems..."
          />
        </div>
      </div>

      <div className="glass p-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="uppercase text-slate-400">
            <tr>
              <th className="text-left p-3">Status</th>
              <th className="text-left p-3">Problem</th>
              <th className="text-left p-3">Difficulty</th>
              <th className="text-left p-3">Topic</th>
              <th className="text-left p-3">Link</th>
              <th className="text-right p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p, idx) => (
              <tr key={p._id || idx} className="border-t border-white/10 h-14 hover:bg-white/5">
                <td className="p-3">
                  <label className="inline-flex items-center gap-2">
                    <input className="w-4 h-4 rounded border-white/20 bg-white/5 accent-violet-600" type="checkbox" checked={p.solved} onChange={(e)=>onToggleSolved(p.index, e.target.checked)} />
                    {p.solved && <CheckCircle2 className="text-emerald-400" size={18}/>}        
                  </label>
                </td>
                <td className="p-3">{p.title}</td>
                <td className="p-3">
                  <span className={
                    p.difficulty === 'Hard' ? 'badge-hard' : p.difficulty === 'Medium' ? 'badge-medium' : 'badge-easy'
                  }>
                    {p.difficulty}
                  </span>
                </td>
                <td className="p-3">
                  <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 text-xs border border-blue-500/20">{p.topic || '—'}</span>
                </td>
                <td className="p-3">
                  <a className="text-violet-400 hover:underline inline-flex items-center gap-1" href={p.link} target="_blank" rel="noreferrer">
                    Open <ExternalLink size={14}/>
                  </a>
                </td>
                <td className="p-3 text-right">
                  <div className="inline-flex items-center gap-3">
                    <button onClick={()=>onToggleStar(p.index, !p.isStarred)} title="Save for revision">
                      <Star size={18} className={p.isStarred ? 'text-yellow-400' : 'text-gray-400'} />
                    </button>
                    <button onClick={()=>onOpenNotes(p.index)} title="Notes">
                      <Pencil size={18} className={p.notes ? 'text-blue-400' : 'text-gray-400'} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
