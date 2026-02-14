# Deployment Guide — Explore project

This document shows step-by-step instructions to deploy the backend to Render and the frontend to Vercel, using MongoDB Atlas for the database.

## Overview
- Backend: Node/Express app (root of repo) → deploy to Render as a Web Service
- Frontend: Next.js (folder `frontend`) → deploy to Vercel
- Database: MongoDB Atlas
- Media: Cloudinary (configured in `src/config/cloudinary.js`)

---

## Required environment variables

Backend (Render service):
- `MONGO_URI` — MongoDB Atlas connection string (example: `mongodb+srv://user:pass@cluster0.mongodb.net/dbname?retryWrites=true&w=majority`)
- `JWT_SECRET`
- `JWT_EXPIRES` (optional, default `7d`)
- `CLOUDINARY_NAME`
- `CLOUDINARY_KEY`
- `CLOUDINARY_SECRET`
- `EMAIL_USER` / `EMAIL_PASS` (only if using email)
- `OSRM_SERVER_URL` (optional)
- `CLIENT_ORIGIN` — your frontend origin (example: `https://your-frontend.vercel.app`). Can be a comma-separated list including `http://localhost:3000` for testing.

Frontend (Vercel project):
- `NEXT_PUBLIC_SERVER_BASE_URL` — your backend base URL **including** `/api` (example: `https://your-backend.onrender.com/api`)

---

## MongoDB Atlas setup (quick)
1. Create an Atlas account and a free cluster.
2. Create a database user and password in Atlas (with proper roles).
3. Whitelist IP or use `0.0.0.0/0` for quick dev (not recommended for production).
4. Copy the connection string and replace username/password and dbname.
5. Set `MONGO_URI` in Render to that connection string.

---

## Push to GitHub
1. Commit your changes and push the repo to GitHub (Render/Vercel will import from GitHub).

---

## Deploy backend to Render
1. Go to https://render.com and create a new account / sign in.
2. Create a new **Web Service** and connect your GitHub repo.
3. For **Root Directory** choose the repository root (where `package.json` for backend is). Use the repo root if backend is root.
4. Build command: `npm install` (Render will detect and run install). Start command: `npm start`.
5. In the Render service settings, add the backend env vars listed above.
6. Deploy. After successful deploy Render will provide a URL (e.g. `https://your-backend.onrender.com`).

Notes:
- Render sets `PORT` automatically — your server reads `process.env.PORT`.
- Uploaded files in `/uploads` on Render are ephemeral — prefer Cloudinary for persistent media (your code already supports Cloudinary).

---

## Deploy frontend to Vercel
1. Go to https://vercel.com and sign in with GitHub.
2. Import your GitHub repo and set the Root Directory to `frontend`.
3. In Vercel project settings, add environment variable:
   - `NEXT_PUBLIC_SERVER_BASE_URL` = `https://<your-backend>.onrender.com/api`
4. Deploy. Vercel will run `npm run build` for `frontend` and host your Next app.

---

## Post-deploy checks
- Backend logs: check DB connection message from `src/config/db.js`.
- Test API: `GET https://<backend>/api/packages` etc.
- Frontend console: check that `NEXT_PUBLIC_SERVER_BASE_URL` is present and API calls succeed.
- Image URLs: ensure images are served from Cloudinary or valid absolute URLs.

---

## Quick troubleshooting
- CORS errors: set `CLIENT_ORIGIN` to your Vercel domain and redeploy backend.
- 500s on DB: verify `MONGO_URI` and that Atlas allows connections.
- Missing Cloudinary keys: images upload will fail — ensure `CLOUDINARY_*` keys are set.

---

If you want, I can:
- Prepare the GitHub repo (add `.gitignore` or update files).
- Create a Render service configuration example.
- Walk through the Render and Vercel UI with exact clicks.

