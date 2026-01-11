# Treack-progress

This repository contains a small client (React + Vite + Tailwind) and server (Node/Express) app.

Imported files:
- `client/` — frontend
- `server/` — backend

Commits will be pushed incrementally to the remote repository.

**CORS & Deployment**

- The backend is deployed at: https://treack-progress-tlyi.vercel.app/
- The frontend is deployed at: https://treack-progress.vercel.app/

The server is configured to allow CORS requests from the frontend origin above and from `http://localhost:5173` for local development. If you need to change allowed origins, edit `server/server.js` (the `allowedOrigins` array).

**Running the server locally**

1. Change to the `server` folder:

```powershell
cd server
```

2. Install dependencies and start in dev mode:

```powershell
npm install
npm run dev
```

The server listens on the port defined by `PORT` in your environment or `5000` by default.

