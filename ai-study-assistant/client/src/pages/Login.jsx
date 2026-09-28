import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const { user, authenticate } = useAuth();
  const nav = useNavigate();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  if (user) return <Navigate to="/" />;

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const submit = async (e) => {
    e.preventDefault(); setBusy(true); setErr('');
    try { await authenticate(mode, form); nav('/'); }
    catch (x) { setErr(x.message); }
    setBusy(false);
  };

  return (
    <form onSubmit={submit} className="card mx-auto mt-10 max-w-sm space-y-3">
      <h1 className="text-xl font-bold">{mode === 'login' ? 'Welcome back' : 'Create account'}</h1>
      {mode === 'register' && <input className="input" placeholder="Name" value={form.name} onChange={set('name')} required />}
      <input className="input" type="email" placeholder="Email" value={form.email} onChange={set('email')} required />
      <input className="input" type="password" placeholder="Password (6+ chars)" value={form.password} onChange={set('password')} required />
      {err && <p className="text-sm text-red-500">{err}</p>}
      <button className="btn w-full" disabled={busy}>{busy ? '...' : mode === 'login' ? 'Log in' : 'Sign up'}</button>
      <button type="button" className="w-full text-sm text-indigo-600" onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>
        {mode === 'login' ? 'No account? Sign up' : 'Have an account? Log in'}
      </button>
    </form>
  );
}
