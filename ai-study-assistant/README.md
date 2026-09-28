# 🧠 AI Study Assistant

Full-stack MERN app: create subjects, add notes, and use AI to generate summaries, quizzes and flashcards, or ask questions about your notes.

**Stack:** React + Vite, Tailwind CSS, Node/Express, MongoDB (Mongoose), OpenAI API, JWT auth, Vercel + Render.

## Features
Subjects & notes (paste or upload .txt/.md) · AI summary · AI quiz · flashcards · Q&A over notes · dashboard with saved study sessions · JWT auth · dark mode · responsive UI

## Run locally
```bash
npm run install:all
cp server/.env.example server/.env   # fill in MONGO_URI, JWT_SECRET, OPENAI_API_KEY
npm run dev:server                   # terminal 1 -> http://localhost:5000
npm run dev:client                   # terminal 2 -> http://localhost:5173
```

## Deploy
**Backend (Render):** Web Service, root `server`, build `npm install`, start `npm start`. Env vars: `MONGO_URI`, `JWT_SECRET`, `OPENAI_API_KEY`, `CLIENT_URL` (your Vercel URL).
**Frontend (Vercel):** root `client`, framework Vite. Env var: `VITE_API_URL` = your Render URL.

## API
`POST /api/auth/register|login` · `GET/POST/DELETE /api/subjects` · `GET/POST/DELETE /api/notes` · `POST /api/ai/:noteId/summary|quiz|flashcards|ask|session` · `GET /api/stats`
