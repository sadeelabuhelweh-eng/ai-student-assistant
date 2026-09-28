import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../services/api.js';

export default function Subject() {
  const { id } = useParams();
  const [notes, setNotes] = useState([]);
  const [form, setForm] = useState({ title: '', content: '' });
  const [err, setErr] = useState('');

  const load = () => api(`/notes?subject=${id}`).then(setNotes).catch((e) => setErr(e.message));
  useEffect(() => { load(); }, [id]);

  const onFile = async (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setForm({ title: form.title || f.name.replace(/\.[^.]+$/, ''), content: await f.text() });
  };
  const save = async (e) => {
    e.preventDefault(); setErr('');
    try { await api('/notes', { method: 'POST', body: { ...form, subject: id } }); setForm({ title: '', content: '' }); load(); }
    catch (x) { setErr(x.message); }
  };
  const remove = async (nid) => { await api(`/notes/${nid}`, { method: 'DELETE' }); load(); };

  return (
    <div className="space-y-6">
      <Link to="/" className="text-sm text-indigo-600">← Dashboard</Link>
      <form onSubmit={save} className="card space-y-3">
        <h2 className="font-semibold">Add notes</h2>
        <input className="input" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
        <textarea className="input h-40" placeholder="Paste your notes here…" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} required />
        <div className="flex flex-wrap items-center gap-3">
          <input type="file" accept=".txt,.md" onChange={onFile} className="text-sm" />
          <button className="btn">Save note</button>
        </div>
        {err && <p className="text-sm text-red-500">{err}</p>}
      </form>
      <div className="space-y-2">
        {notes.map((n) => (
          <div key={n._id} className="card flex items-center justify-between">
            <Link to={`/notes/${n._id}`} className="font-medium hover:underline">{n.title}</Link>
            <button onClick={() => remove(n._id)} className="text-xs text-red-500">Delete</button>
          </div>
        ))}
        {!notes.length && <p className="text-slate-500">No notes yet.</p>}
      </div>
    </div>
  );
}
