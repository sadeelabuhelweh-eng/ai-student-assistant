import { Router } from 'express';
import Note from '../models/Note.js';
import Session from '../models/Session.js';
import * as ai from '../services/ai.js';

const r = Router();
const getNote = async (req, res) => {
  const n = await Note.findOne({ _id: req.params.id, user: req.user.id });
  if (!n) res.status(404).json({ message: 'Note not found' });
  return n;
};
const guard = (req, res, next) =>
  process.env.OPENAI_API_KEY ? next() : res.status(500).json({ message: 'OPENAI_API_KEY is not configured' });

r.post('/:id/summary', guard, async (req, res) => {
  const n = await getNote(req, res); if (!n) return;
  n.summary = await ai.summarize(n.content); await n.save(); res.json(n);
});
r.post('/:id/quiz', guard, async (req, res) => {
  const n = await getNote(req, res); if (!n) return;
  n.quiz = await ai.makeQuiz(n.content, req.body.count || 5); await n.save(); res.json(n);
});
r.post('/:id/flashcards', guard, async (req, res) => {
  const n = await getNote(req, res); if (!n) return;
  n.flashcards = await ai.makeFlashcards(n.content, req.body.count || 10); await n.save(); res.json(n);
});
r.post('/:id/ask', guard, async (req, res) => {
  if (!req.body.question?.trim()) return res.status(400).json({ message: 'Question is required' });
  const n = await getNote(req, res); if (!n) return;
  res.json({ answer: await ai.ask(n.content, req.body.question) });
});
r.post('/:id/session', async (req, res) => {
  const n = await getNote(req, res); if (!n) return;
  const { type, score, total } = req.body;
  res.status(201).json(await Session.create({ user: req.user.id, note: n._id, type, score, total }));
});
export default r;
