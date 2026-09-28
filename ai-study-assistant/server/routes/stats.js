import { Router } from 'express';
import mongoose from 'mongoose';
import Subject from '../models/Subject.js';
import Note from '../models/Note.js';
import Session from '../models/Session.js';

const r = Router();
r.get('/', async (req, res) => {
  const user = new mongoose.Types.ObjectId(req.user.id);
  const [subjects, notes, sessions, recent, avg] = await Promise.all([
    Subject.countDocuments({ user }),
    Note.countDocuments({ user }),
    Session.countDocuments({ user }),
    Session.find({ user }).populate('note', 'title').sort('-createdAt').limit(5),
    Session.aggregate([
      { $match: { user, type: 'quiz', total: { $gt: 0 } } },
      { $group: { _id: null, pct: { $avg: { $multiply: [{ $divide: ['$score', '$total'] }, 100] } } } },
    ]),
  ]);
  res.json({ subjects, notes, sessions, avgQuizScore: Math.round(avg[0]?.pct || 0), recent });
});
export default r;
