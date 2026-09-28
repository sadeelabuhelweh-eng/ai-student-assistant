import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../services/api.js';

function Quiz({ note }) {
  const [picked, setPicked] = useState({});
  const [done, setDone] = useState(false);
  const score = note.quiz.filter((q, i) => picked[i] === q.answer).length;

  const finish = () => {
    setDone(true);
    api(`/ai/${note._id}/session`, { method: 'POST', body: { type: 'quiz', score, total: note.quiz.length } }).catch(() => {});
  };
  return (
    <div className="space-y-4">
      {note.quiz.map((q, i) => (
        <div key={i} className="card">
          <p className="mb-2 font-medium">{i + 1}. {q.question}</p>
          {q.options.map((o, j) => {
            let cls = 'btn-ghost mb-1 block w-full text-left';
            if (done) cls += j === q.answer ? ' !border-green-500 !bg-green-100 dark:!bg-green-900' : picked[i] === j ? ' !border-red-500' : '';
            else if (picked[i] === j) cls += ' !border-indigo-500';
            return <button key={j} className={cls} disabled={done} onClick={() => setPicked({ ...picked, [i]: j })}>{o}</button>;
          })}
          {done && <p className="mt-2 text-sm text-slate-500">{q.explanation}</p>}
        </div>
      ))}
      {done
        ? <p className="text-lg font-bold">Score: {score}/{note.quiz.length}</p>
        : <button className="btn" onClick={finish} disabled={Object.keys(picked).length < note.quiz.length}>Submit</button>}
    </div>
  );
}

function Flashcards({ note }) {
  const [i, setI] = useState(0);
  const [flip, setFlip] = useState(false);
  const cards = note.flashcards;
  const go = (d) => { setFlip(false); setI((i + d + cards.length) % cards.length); };
  const finish = () => api(`/ai/${note._id}/session`, { method: 'POST', body: { type: 'flashcards', total: cards.length } }).catch(() => {});
  return (
    <div className="space-y-3 text-center">
      <div onClick={() => setFlip(!flip)} className="card flex h-48 cursor-pointer items-center justify-center text-lg">
        {flip ? cards[i].back : cards[i].front}
      </div>
      <p className="text-sm text-slate-500">{i + 1} / {cards.length} · click card to flip</p>
      <div className="flex justify-center gap-2">
        <button className="btn-ghost" onClick={() => go(-1)}>Prev</button>
        <button className="btn-ghost" onClick={() => go(1)}>Next</button>
        <button className="btn" onClick={finish}>Mark session done</button>
      </div>
    </div>
  );
}

function Ask({ id }) {
  const [q, setQ] = useState('');
  const [log, setLog] = useState([]);
  const [busy, setBusy] = useState(false);
  const send = async (e) => {
    e.preventDefault(); if (!q.trim()) return;
    setBusy(true);
    const question = q; setQ('');
    try { const { answer } = await api(`/ai/${id}/ask`, { method: 'POST', body: { question } }); setLog((l) => [...l, { question, answer }]); }
    catch (x) { setLog((l) => [...l, { question, answer: `⚠️ ${x.message}` }]); }
    setBusy(false);
  };
  return (
    <div className="space-y-3">
      {log.map((m, i) => (
        <div key={i} className="card space-y-1">
          <p className="font-medium">🙋 {m.question}</p>
          <p className="whitespace-pre-wrap">{m.answer}</p>
        </div>
      ))}
      <form onSubmit={send} className="flex gap-2">
        <input className="input" placeholder="Ask something about these notes…" value={q} onChange={(e) => setQ(e.target.value)} />
        <button className="btn" disabled={busy}>{busy ? '…' : 'Ask'}</button>
      </form>
    </div>
  );
}

export default function Note() {
  const { id } = useParams();
  const [note, setNote] = useState(null);
  const [tab, setTab] = useState('notes');
  const [busy, setBusy] = useState('');
  const [err, setErr] = useState('');

  useEffect(() => { api(`/notes/${id}`).then(setNote).catch((e) => setErr(e.message)); }, [id]);

  const generate = async (kind) => {
    setBusy(kind); setErr('');
    try { setNote(await api(`/ai/${id}/${kind}`, { method: 'POST', body: {} })); setTab(kind); }
    catch (e) { setErr(e.message); }
    setBusy('');
  };
  if (!note) return <p>{err || 'Loading…'}</p>;

  const tabs = ['notes', 'summary', 'quiz', 'flashcards', 'ask'];
  const has = { summary: !!note.summary, quiz: note.quiz.length, flashcards: note.flashcards.length };

  return (
    <div className="space-y-4">
      <Link to={`/subjects/${note.subject}`} className="text-sm text-indigo-600">← Back</Link>
      <h1 className="text-2xl font-bold">{note.title}</h1>
      <div className="flex flex-wrap gap-2">
        {['summary', 'quiz', 'flashcards'].map((k) => (
          <button key={k} className="btn" disabled={!!busy} onClick={() => generate(k)}>
            {busy === k ? 'Generating…' : `${has[k] ? 'Regenerate' : 'Generate'} ${k}`}
          </button>
        ))}
      </div>
      {err && <p className="text-sm text-red-500">{err}</p>}
      <div className="flex gap-1 overflow-x-auto border-b border-slate-200 dark:border-slate-700">
        {tabs.map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-3 py-2 text-sm capitalize ${tab === t ? 'border-b-2 border-indigo-600 font-semibold' : 'text-slate-500'}`}>{t}</button>
        ))}
      </div>
      {tab === 'notes' && <div className="card whitespace-pre-wrap">{note.content}</div>}
      {tab === 'summary' && (has.summary ? <div className="card whitespace-pre-wrap">{note.summary}</div> : <p className="text-slate-500">Generate a summary first.</p>)}
      {tab === 'quiz' && (has.quiz ? <Quiz key={note.updatedAt} note={note} /> : <p className="text-slate-500">Generate a quiz first.</p>)}
      {tab === 'flashcards' && (has.flashcards ? <Flashcards key={note.updatedAt} note={note} /> : <p className="text-slate-500">Generate flashcards first.</p>)}
      {tab === 'ask' && <Ask id={id} />}
    </div>
  );
}
