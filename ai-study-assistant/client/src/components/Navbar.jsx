import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import useDarkMode from '../hooks/useDarkMode.js';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [dark, toggle] = useDarkMode();
  return (
    <nav className="border-b border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link to="/" className="font-bold text-indigo-600">🧠 StudyAI</Link>
        <div className="flex items-center gap-3 text-sm">
          <button onClick={toggle} className="btn-ghost" aria-label="Toggle dark mode">{dark ? '☀️' : '🌙'}</button>
          {user && (<>
            <span className="hidden sm:inline">{user.name}</span>
            <button onClick={logout} className="btn-ghost">Log out</button>
          </>)}
        </div>
      </div>
    </nav>
  );
}
