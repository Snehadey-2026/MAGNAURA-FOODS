# MAGNAURA FOODS

MERN project split into separate frontend and backend folders.

## Folder Structure

- `frontend/` - React, Vite, React Router, Framer Motion, and UI files.
- `backend/` - Node.js, Express.js, MongoDB, Mongoose, JWT, and Cloudinary API files.

## Run From The Root Folder

```bash
npm install
npm run frontend
npm run backend
```

Frontend runs on:

```bash
http://127.0.0.1:5173/
```

Backend runs on:

```bash
http://127.0.0.1:5000/
```

## Run Separately

```bash
cd frontend
npm run dev
```

```bash
cd backend
copy .env.example .env
npm run dev
```

Update `backend/.env` with MongoDB, JWT, Cloudinary, and admin credentials before using the database-backed admin features.
