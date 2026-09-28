import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api.js';

const COLORS = ['#6366f1', '#ec4899', '#10b981', '#f59e0b', '#06b6d4', '#ef4444'];

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [name, setName] = useState('');
  const [err, setErr] = useState('');

  const load = () => Promise.all([api('/stats'), api('/subjects')])
    .then(([s, subs]) => { setStats(s); setSubjects(subs); })
    .catch((e) => setErr(e.message));
  useEffect(() => { load(); }, []);

  const add = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    await api('/subjects', { method: 'POST', body: { name, color: COLORS[subjects.length % COLORS.length] } });
    setName(''); load();
  };
  const remove = async (id) => {
    if (confirm('Delete this subject and all its notes?')) { await api(`/subjects/${id}`, { method: 'DELETE' }); load(); }
  };

  const tiles = stats && [
    ['Subjects', stats.subjects], ['Notes', stats.notes],
    ['Study sessions', stats.sessions], ['Avg quiz score', `${stats.avgQuizScore}%`],
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      {err && <p className="text-red-500">{err}</p>}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {tiles?.map(([l, v]) => (
          <div key={l} className="card"><p className="text-sm text-slate-500">{l}</p><p className="text-2xl font-bold">{v}</p></div>
        ))}
      </div>

      <form onSubmit={add} className="flex gap-2">
        <input className="input" placeholder="New subject (e.g. Digital Electronics)" value={name} onChange={(e) => setName(e.target.value)} />
        <button className="btn whitespace-nowrap">+ Add</button>
      </form>

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {subjects.map((s) => (
          <div key={s._id} className="card border-l-4" style={{ borderLeftColor: s.color }}>
            <Link to={`/subjects/${s._id}`} className="block font-semibold hover:underline">{s.name}</Link>
            <p className="text-sm text-slate-500">{s.noteCount} note(s)</p>
            <button onClick={() => remove(s._id)} className="mt-2 text-xs text-red-500">Delete</button>
          </div>
        ))}
        {!subjects.length && <p className="text-slate-500">No subjects yet — add your first one above.</p>}
      </div>

      {!!stats?.recent.length && (
        <div className="card">
          <h2 className="mb-2 font-semibold">Recent sessions</h2>
          <ul className="space-y-1 text-sm">
            {stats.recent.map((s) => (
              <li key={s._id} className="flex justify-between">
                <span>{s.type} · {s.note?.title || 'deleted note'}</span>
                <span className="text-slate-500">{s.type === 'quiz' ? `${s.score}/${s.total}` : `${s.total} cards`} · {new Date(s.createdAt).toLocaleDateString()}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
