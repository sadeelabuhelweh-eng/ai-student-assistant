import { Router } from 'express';
import Note from '../models/Note.js';
import Subject from '../models/Subject.js';

const r = Router();
r.get('/', async (req, res) => {
  const q = { user: req.user.id };
  if (req.query.subject) q.subject = req.query.subject;
  res.json(await Note.find(q).select('-content').sort('-createdAt'));
});
r.get('/:id', async (req, res) => {
  const n = await Note.findOne({ _id: req.params.id, user: req.user.id });
  if (!n) return res.status(404).json({ message: 'Not found' });
  res.json(n);
});
r.post('/', async (req, res) => {
  const { subject, title, content } = req.body;
  if (!subject || !title?.trim() || !content?.trim())
    return res.status(400).json({ message: 'Subject, title and content are required' });
  if (!(await Subject.exists({ _id: subject, user: req.user.id })))
    return res.status(404).json({ message: 'Subject not found' });
  res.status(201).json(await Note.create({ user: req.user.id, subject, title, content }));
});
r.delete('/:id', async (req, res) => {
  await Note.deleteOne({ _id: req.params.id, user: req.user.id });
  res.json({ ok: true });
});
export default r;
