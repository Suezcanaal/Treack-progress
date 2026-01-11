import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../AuthContext.jsx';
import FilterBar from '../components/FilterBar.jsx';
import { CheckCircle2, Star, ExternalLink, Pencil } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import MainLayout from '../layouts/MainLayout.jsx';

function DifficultyBadge({ level }) {
  const color = level === 'Hard' ? 'badge-hard' : level === 'Medium' ? 'badge-medium' : 'badge-easy';
  return <span className={`${color}`}>{level}</span>;
}

function NotesModal({ open, onClose, value, onChange, onSave, loading }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 bg-black/60 grid place-items-center p-4 z-50">
          <motion.div initial={{y:20,opacity:0}} animate={{y:0,opacity:1}} exit={{y:10,opacity:0}} className="glass w-full max-w-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold">Personal Notes</h3>
              <button className="text-gray-400 hover:text-white" onClick={onClose}>Close</button>
            </div>
            <textarea className="input min-h-[200px] font-mono" value={value} onChange={(e)=>onChange(e.target.value)} placeholder="Write your approach, edge cases, time/space complexity..."/>
            <div className="mt-3 text-right">
              <motion.button whileTap={{scale:0.98}} onClick={onSave} disabled={loading} className="btn-primary">{loading? 'Saving...' : 'Save'}</motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function SheetView() {
  const { id } = useParams();
  const { api } = useAuth();
  const [sheet, setSheet] = useState(null);
  const [problems, setProblems] = useState([]);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all');
  const [difficulty, setDifficulty] = useState('all');
  const [notesOpen, setNotesOpen] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(null);
  const [noteDraft, setNoteDraft] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await api.get(`/sheets/${id}`);
      setSheet(data);
      setProblems(data.problems);
    })();
  }, [id]);

  const filtered = useMemo(() => {
    return problems.filter((p) => {
      const matchesQuery = p.title.toLowerCase().includes(query.toLowerCase());
      const matchesStatus =
        status === 'all' ? true :
        status === 'solved' ? p.solved :
        status === 'unsolved' ? !p.solved :
        status === 'starred' ? p.isStarred : true;
      const matchesDifficulty = difficulty === 'all' ? true : p.difficulty === difficulty;
      return matchesQuery && matchesStatus && matchesDifficulty;
    });
  }, [problems, query, status, difficulty]);

  async function toggleSolved(idx, value) {
    await api.post(`/sheets/${sheet._id}/toggle`, { problemIndex: idx, solved: value });
    setProblems((prev) => prev.map((p, i) => i === idx ? { ...p, solved: value } : p));
  }

  async function toggleStar(idx, value) {
    await api.post(`/sheets/${sheet._id}/toggle`, { problemIndex: idx, star: value });
    setProblems((prev) => prev.map((p, i) => i === idx ? { ...p, isStarred: value } : p));
  }

  function openNotes(idx) {
    setCurrentIdx(idx);
    setNoteDraft(problems[idx].notes || '');
    setNotesOpen(true);
  }

  async function saveNotes() {
    setSaving(true);
    await api.post(`/sheets/${sheet._id}/toggle`, { problemIndex: currentIdx, note: noteDraft });
    setProblems((prev) => prev.map((p, i) => i === currentIdx ? { ...p, notes: noteDraft } : p));
    setSaving(false);
    setNotesOpen(false);
  }

  return (
    <MainLayout>
      {sheet && (
        <>
          <div className="mb-6">
            <h2 className="text-2xl font-semibold">{sheet.title}</h2>
            <p className="text-gray-400">{sheet.description}</p>
          </div>

          <FilterBar
            query={query}
            onQuery={setQuery}
            status={status}
            onStatus={setStatus}
            difficulty={difficulty}
            onDifficulty={setDifficulty}
          />

          <div className="glass p-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="uppercase text-slate-400">
                <tr>
                  <th className="text-left p-3">Status</th>
                  <th className="text-left p-3">Problem</th>
                  <th className="text-left p-3">Difficulty</th>
                  <th className="text-left p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p, idx) => (
                  <tr key={p._id || idx} className="border-t border-white/10 h-14 hover:bg-white/5">
                    <td className="p-3">
                      <label className="inline-flex items-center gap-2">
                        <input className="w-4 h-4 rounded border-white/20 bg-white/5 accent-violet-600" type="checkbox" checked={p.solved} onChange={(e)=>toggleSolved(p.index, e.target.checked)} />
                        {p.solved && <CheckCircle2 className="text-emerald-400" size={18}/>}        
                      </label>
                    </td>
                    <td className="p-3">
                      <a className="text-violet-400 hover:underline inline-flex items-center gap-1" href={p.link} target="_blank" rel="noreferrer">
                        {p.title} <ExternalLink size={14}/>
                      </a>
                    </td>
                    <td className="p-3"><DifficultyBadge level={p.difficulty}/></td>
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <button onClick={()=>toggleStar(p.index, !p.isStarred)} title="Save for revision">
                          {p.isStarred ? <Star className="text-yellow-400" size={18}/> : <Star className="text-gray-400" size={18}/>} 
                        </button>
                        <button onClick={()=>openNotes(p.index)} title="Add notes">
                          <Pencil size={18} className={p.notes ? 'text-blue-400' : 'text-gray-400'} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <NotesModal open={notesOpen} onClose={()=>setNotesOpen(false)} value={noteDraft} onChange={setNoteDraft} onSave={saveNotes} loading={saving}/>
        </>
      )}
    </MainLayout>
  );
}
