import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import auth from './routes/auth.js';
import subjects from './routes/subjects.js';
import notes from './routes/notes.js';
import ai from './routes/ai.js';
import stats from './routes/stats.js';
import { protect } from './middleware/auth.js';

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL || '*' }));
app.use(express.json({ limit: '2mb' }));

app.get('/api/health', (_, res) => res.json({ ok: true }));
app.use('/api/auth', auth);
app.use('/api/subjects', protect, subjects);
app.use('/api/notes', protect, notes);
app.use('/api/ai', protect, ai);
app.use('/api/stats', protect, stats);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Server error' });
});

const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => app.listen(PORT, () => console.log(`API on :${PORT}`)))
  .catch((e) => { console.error('Mongo connection failed', e.message); process.exit(1); });
