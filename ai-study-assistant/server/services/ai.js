import OpenAI from 'openai';

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || 'missing' });
const MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';
const clip = (t) => t.slice(0, 24000);

async function chat(system, user, json = false) {
  const r = await client.chat.completions.create({
    model: MODEL,
    messages: [{ role: 'system', content: system }, { role: 'user', content: clip(user) }],
    ...(json && { response_format: { type: 'json_object' } }),
  });
  return r.choices[0].message.content;
}

export const summarize = (notes) =>
  chat('You are a study assistant. Summarize the notes as concise bullet points, highlighting key terms. End with a "Key takeaways" section.', notes);

export const makeQuiz = async (notes, n = 5) =>
  JSON.parse(await chat(
    `Create ${n} multiple-choice questions from the notes. Return JSON: {"questions":[{"question":"","options":["","","",""],"answer":0,"explanation":""}]}. "answer" is the index of the correct option.`,
    notes, true)).questions;

export const makeFlashcards = async (notes, n = 10) =>
  JSON.parse(await chat(
    `Create up to ${n} flashcards from the notes. Return JSON: {"cards":[{"front":"","back":""}]}.`,
    notes, true)).cards;

export const ask = (notes, question) =>
  chat('Answer the question using ONLY the notes provided. If the notes do not contain the answer, say so.', `Notes:\n${notes}\n\nQuestion: ${question}`);
