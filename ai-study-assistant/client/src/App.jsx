import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import Navbar from './components/Navbar.jsx';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Subject from './pages/Subject.jsx';
import Note from './pages/Note.jsx';

const Private = ({ children }) => (useAuth().user ? children : <Navigate to="/login" replace />);

export default function App() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 py-6">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Private><Dashboard /></Private>} />
          <Route path="/subjects/:id" element={<Private><Subject /></Private>} />
          <Route path="/notes/:id" element={<Private><Note /></Private>} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </>
  );
}
