import { Router } from 'express';
import mongoose from 'mongoose';
import Subject from '../models/Subject.js';
import Note from '../models/Note.js';

const r = Router();
r.get('/', async (req, res) => {
  const user = new mongoose.Types.ObjectId(req.user.id);
  const subjects = await Subject.find({ user }).sort('-createdAt').lean();
  const counts = await Note.aggregate([{ $match: { user } }, { $group: { _id: '$subject', n: { $sum: 1 } } }]);
  const map = Object.fromEntries(counts.map((c) => [String(c._id), c.n]));
  res.json(subjects.map((s) => ({ ...s, noteCount: map[String(s._id)] || 0 })));
});
r.post('/', async (req, res) => {
  if (!req.body.name?.trim()) return res.status(400).json({ message: 'Name is required' });
  res.status(201).json(await Subject.create({ user: req.user.id, name: req.body.name, color: req.body.color }));
});
r.delete('/:id', async (req, res) => {
  const s = await Subject.findOneAndDelete({ _id: req.params.id, user: req.user.id });
  if (!s) return res.status(404).json({ message: 'Not found' });
  await Note.deleteMany({ subject: s._id });
  res.json({ ok: true });
});
export default r;
