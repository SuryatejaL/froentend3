Deployment guide — Medical Consultation App

Overview
- Repo: https://github.com/SuryatejaL/froentend3
- This repo contains a React frontend and a simple Express backend (server.js).
- The backend stores data in JSON files under `/data` and exposes a REST API at `/api/*`.

Goal
- Deploy backend (Node/Express) to Render (or similar) and frontend (React) to Vercel (or Render Static Site).
- Configure frontend to call the hosted backend via `REACT_APP_API_BASE_URL`.

Option A — Render (backend) + Vercel (frontend) — recommended

1) Push code to GitHub
- Ensure your code is pushed to `main` on GitHub (already done):
  git push origin main

2) Deploy backend on Render
- Sign in to https://render.com
- New → Web Service → Connect your GitHub repo → select `froentend3` and branch `main`.
- Name: `medical-backend` (or any name)
- Environment: `Node` (Render will detect package.json)
- Build command: leave empty (server has no build) or `npm ci`
- Start command: `node server.js`
- In Advanced → Environment → set any env vars if needed (none required; server reads `process.env.PORT`).
- Create the service — wait for build & deploy.
- After deploy you'll get a URL like: `https://medical-backend.onrender.com`
- Health check: `https://medical-backend.onrender.com/health`

3) Deploy frontend on Vercel
- Sign in to https://vercel.com
- New Project → import GitHub repo `froentend3`
- In Project Settings → Environment Variables, add:
  - `REACT_APP_API_BASE_URL` = `https://medical-backend.onrender.com/api` (no trailing slash)
- Build settings (default for CRA): Build command: `npm run build`, Output directory: `build`
- Deploy — Vercel will give a public URL e.g. `https://your-app.vercel.app`
- Open the URL and test the app. The frontend will use the API base URL configured above.

Option B — Deploy both on Render (single provider)

1) Backend service (same as Option A step 2)
2) Static site on Render
- New → Static Site → link the same GitHub repo
- Build Command: `npm run build`
- Publish Directory: `build`
- Environment variable: `REACT_APP_API_BASE_URL` = `https://medical-backend.onrender.com/api`
- Deploy — Render serves the built static files and will use the provided env var for the frontend.

Option C — Single Docker container (serves frontend + API)
- If you prefer a single URL for both frontend and backend, we can add a Dockerfile that builds the React app and serves it from Express (or serve static files) and exposes API on `/api`.
- This approach requires a bit more configuration but results in one deployed service (Render, Fly.io, Heroku with Docker, etc.).
- Tell me if you want me to add a Dockerfile and the combined server changes.

Local testing (before deploy)
- Start both servers locally (concurrently):
  npm install
  npm run dev
- Backend: http://localhost:5000/health
- Frontend: http://localhost:3000

Quick curl examples
- List users:
  curl http://localhost:5000/api/users
- Create user:
  curl -X POST http://localhost:5000/api/users -H "Content-Type: application/json" -d '{"name":"Test","email":"t@t.com","password":"Test@123","role":"patient"}'

Notes & Troubleshooting
- CORS: server.js enables CORS for all origins — fine for development. For production, restrict origins to your frontend domain if needed.
- Environment variable: `REACT_APP_API_BASE_URL` must point to the backend's `/api` path. Example: `https://medical-backend.onrender.com/api`.
- If your backend URL is `https://medical-backend.onrender.com`, the frontend env var must be `https://medical-backend.onrender.com/api`.

I can do one of the following next (pick one):
- Create a Dockerfile that serves frontend + API from the same container (single deploy target)
- Add GitHub Actions workflow to automatically deploy to Render (requires Render API key)
- Walk you step-by-step through Render + Vercel UI and set env vars (I will provide exact values)

If you want me to proceed with any of these automatic steps, please tell me which option and whether you want a Dockerfile (single service) or separate services. If you prefer, grant me temporary Render/Vercel access tokens (not recommended here); otherwise I'll provide exact manual instructions you can follow.
