import mongoose from 'mongoose';
export default mongoose.model('Session', new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  note: { type: mongoose.Schema.Types.ObjectId, ref: 'Note' },
  type: { type: String, enum: ['quiz', 'flashcards'], required: true },
  score: Number,
  total: Number,
}, { timestamps: true }));
