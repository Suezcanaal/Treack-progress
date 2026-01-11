import React, { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext.jsx';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Plus, LogOut, ExternalLink, X, CheckCircle, Flame } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout.jsx';
import StatsCard from '../components/StatsCard.jsx';
import ProblemTable from '../components/ProblemTable.jsx';
import ConsistencyHeatmap from '../components/ConsistencyHeatmap.jsx';

function ProgressBar({ value }) {
  return (
    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
      <div className="h-full bg-gradient-to-r from-brand-600 to-brand-700" style={{ width: `${value}%` }}></div>
    </div>
  );
}

function DifficultyBadge({ level }) {
  const color = level === 'Hard' ? 'text-red-300 bg-red-500/10 border-red-500/30' : level === 'Medium' ? 'text-yellow-300 bg-yellow-500/10 border-yellow-500/30' : 'text-emerald-300 bg-emerald-500/10 border-emerald-500/30';
  return <span className={`px-2 py-0.5 text-xs border rounded ${color}`}>{level}</span>;
}

function CreateSheetModal({ open, onClose, onCreated, api }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [problemsText, setProblemsText] = useState('[\n  {"title":"Two Sum","link":"https://leetcode.com/problems/two-sum/","difficulty":"Easy","topic":"Array"}\n]');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleCreate(e) {
    e.preventDefault();
    setError('');
    let problems = [];
    if (problemsText.trim()) {
      try {
        problems = JSON.parse(problemsText);
        if (!Array.isArray(problems)) throw new Error('Problems must be an array');
      } catch (err) {
        setError('Invalid problems JSON');
        return;
      }
    }
    setLoading(true);
    try {
      await api.post('/sheets', { title, description, problems });
      onCreated();
      onClose();
      setTitle('');
      setDescription('');
      setProblemsText('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create sheet');
    } finally {
      setLoading(false);
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 bg-black/60 backdrop-blur-xs grid place-items-center p-4 z-50">
          <motion.div initial={{y:20,opacity:0}} animate={{y:0,opacity:1}} exit={{y:10,opacity:0}} className="glass w-full max-w-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold">Create Custom Sheet</h3>
              <button onClick={onClose} className="text-gray-400 hover:text-white"><X size={20}/></button>
            </div>
            <form onSubmit={handleCreate} className="space-y-3">
              <input className="input" placeholder="Title" value={title} onChange={(e)=>setTitle(e.target.value)} required />
              <input className="input" placeholder="Description" value={description} onChange={(e)=>setDescription(e.target.value)} />
              <div>
                <label className="block text-sm text-gray-400 mb-1">Problems (JSON array)</label>
                <textarea className="input min-h-[150px] font-mono" value={problemsText} onChange={(e)=>setProblemsText(e.target.value)} placeholder="[]"/>
                <p className="text-xs text-gray-500 mt-1">Each problem: {`{ title, link, difficulty: 'Easy|Medium|Hard', topic }`}</p>
              </div>
              {error && <p className="text-red-400 text-sm">{error}</p>}
              <motion.button whileTap={{scale:0.98}} className="btn-primary" disabled={loading}>
                {loading? 'Creating...' : 'Create Sheet'}
              </motion.button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function Dashboard() {
  const { api, setToken } = useAuth();
  const navigate = useNavigate();
  const [sheets, setSheets] = useState([]);
  const [selected, setSelected] = useState(null);
  const [problems, setProblems] = useState([]);
  const [openCreate, setOpenCreate] = useState(false);

  async function loadSheets() {
    const { data } = await api.get('/sheets');
    setSheets(data);
  }
  useEffect(() => { loadSheets(); }, []);

  async function openSheet(id) {
    const { data } = await api.get(`/sheets/${id}`);
    setSelected(data);
    setProblems(data.problems);
  }

  async function toggle(idx, value) {
    await api.post(`/sheets/${selected._id}/toggle`, { problemIndex: idx, solved: value });
    setProblems((prev) => prev.map((p, i) => i === idx ? { ...p, solved: value } : p));
    await loadSheets();
  }

  function logout() {
    setToken(null);
    navigate('/', { replace: true });
  }

  return (
    <MainLayout>
      {/* Stats Header */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatsCard
          title="Total Solved"
          value={String(sheets.reduce((acc, s) => acc + (s.progress ? Math.round((s.progress/100) * (s.problemsCount||0)) : 0), 0))}
          subtitle="Problems Solved"
          icon={<CheckCircle className="text-emerald-400" size={20} />}
        />
        <StatsCard
          title="Current Streak"
          value={`5 Days`}
          subtitle="Keep the momentum"
          icon={<Flame className="text-orange-400" size={20} />}
        />
        <StatsCard
          title="Difficulty Breakdown"
          value=""
        >
          <div className="text-xs text-gray-300 mt-1">Easy: 10 | Med: 5 | Hard: 2</div>
        </StatsCard>
        <StatsCard
          title="Next Goal"
          value="Blind 75"
        >
          <div className="mt-2">
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 shadow-[0_0_10px_rgba(124,58,237,0.4)]" style={{ width: `15%` }} />
            </div>
            <div className="text-xs text-gray-400 mt-1">Blind 75 Progress: 15%</div>
          </div>
        </StatsCard>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-1 space-y-4">
        <div className="glass p-4 card-hover">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold">Your Sheets</h3>
            <div className="flex items-center gap-3">
              <button onClick={() => setOpenCreate(true)} className="btn-primary inline-flex items-center gap-2"><Plus size={16}/> New</button>
              <button onClick={logout} className="text-sm text-gray-400 hover:text-white inline-flex items-center gap-1"><LogOut size={16}/>Logout</button>
            </div>
          </div>
          <div className="space-y-3">
            {sheets.map((s) => (
              <div key={s._id} className="p-3 rounded-lg bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10" onClick={() => openSheet(s._id)}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{s.title}</p>
                    <p className="text-xs text-gray-400">{s.type === 'default' ? 'Default' : 'Custom'}</p>
                  </div>
                  <span className="text-sm text-gray-300">{s.progress}%</span>
                </div>
                <div className="mt-2"><ProgressBar value={s.progress} /></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="md:col-span-2 space-y-4 p-8">
        {selected ? (
          <div className="glass p-6 card-hover">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-lg font-semibold">{selected.title}</h3>
                <p className="text-gray-400 text-sm">{selected.description}</p>
              </div>
            </div>
            <ProblemTable
              selected={selected}
              problems={problems}
              onToggleSolved={(idx, val)=>toggle(idx, val)}
              onToggleStar={(idx, val)=>api.post(`/sheets/${selected._id}/toggle`, { problemIndex: idx, star: val }).then(()=>setProblems(p=>p.map((x,i)=>i===idx?{...x,isStarred:val}:x)))}
              onOpenNotes={(idx)=>{}}
            />
          </div>
        ) : (
          <div className="glass p-6 h-[400px] grid place-items-center text-gray-400">
            <div className="text-center">
              <p>Select a sheet to view problems</p>
            </div>
          </div>
        )}
      </div>

      <CreateSheetModal open={openCreate} onClose={()=>setOpenCreate(false)} onCreated={loadSheets} api={api} />
      </div>

      {/* Activity Heatmap */}
      <div className="w-full mt-8 p-6 bg-white/5 rounded-2xl border border-white/10">
        <h3 className="text-sm text-gray-400 mb-3">Yearly Consistency</h3>
        <ConsistencyHeatmap weeks={52} />
      </div>
    </MainLayout>
  );
}
