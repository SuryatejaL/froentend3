# 🚀 Deployment Guide

## Option 1: Render (Backend) + Vercel (Frontend) — Recommended

### Deploy Backend to Render

1. Go to https://render.com and sign in with GitHub
2. Click **"+ New"** > **"Web Service"**
3. Connect your GitHub repo: `https://github.com/SuryatejaL/froentend3`
4. Configure:
   - **Name**: `medical-api`
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
5. Click **"Create Web Service"**
6. Note the deployed URL (e.g., `https://medical-api.onrender.com`)

### Deploy Frontend to Vercel

1. Go to https://vercel.com and sign in with GitHub
2. Click **"Add New Project"**
3. Select your repo and click **"Import"**
4. In **Environment Variables**, add:
   - Key: `REACT_APP_API_BASE_URL`
   - Value: `https://medical-api.onrender.com/api` (your Render URL)
5. Click **"Deploy"**
6. Your frontend is now live at the Vercel URL

### Test It

- Open the Vercel frontend URL
- Log in with demo: `bob@medf.test` / `Test@1234`
- Book an appointment — data persists to the Render backend

---

## Option 2: Docker (Self-Hosted)

```bash
cd "c:\front207\online medic"
npm run build
docker build -t medical-app:latest .
docker run -p 5000:5000 medical-app:latest
# Visit http://localhost:5000
```

---

## Demo Credentials

- **Patient**: bob@medf.test / Test@1234
- **Doctor**: alice@medf.test / Test@1234
- **Pharmacist**: john@medf.test / Test@1234
- **Admin**: admin@medf.test / Test@1234
