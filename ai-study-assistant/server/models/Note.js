import mongoose from 'mongoose';
export default mongoose.model('Note', new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true, index: true },
  title: { type: String, required: true, trim: true },
  content: { type: String, required: true },
  summary: { type: String, default: '' },
  quiz: [{ question: String, options: [String], answer: Number, explanation: String }],
  flashcards: [{ front: String, back: String }],
}, { timestamps: true }));
