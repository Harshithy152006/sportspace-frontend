# SportSpace Frontend

React (Vite) + Axios Single Page Application for SportSpace.

## Vercel Deployment Guide

1. Import this repository in [Vercel](https://vercel.com/).
2. Framework Preset: `Vite` (auto-detected).
3. Root Directory: `./` (leave default).
4. Build Command: `npm run build`.
5. Output Directory: `dist`.
6. Environment Variables:
   - Add `VITE_API_URL` = `https://<your-railway-backend-url>/api` (e.g. `https://sportspace-backend.up.railway.app/api`).
7. Click **Deploy**.

## Local Development

```powershell
npm install
npm run dev
```
Runs at `http://localhost:5173`.
