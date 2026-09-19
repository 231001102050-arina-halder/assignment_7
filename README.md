# Assignment 7 Authentication System

## Demo login

- Username: `admin`
- Password: `Admin@123`

## Run locally

```bash
npm install
npm run dev
```

Open the URL shown by `vercel dev`, usually `http://localhost:3000`.

Use `npm run dev`, not `npm run dev:vite`, when you want the backend API routes to work locally.

## Deploy to Vercel

1. Push this project to GitHub.
2. Import it in Vercel.
3. Keep the default build command: `npm run build`.
4. Keep the output directory: `dist`.
5. Optional: add an environment variable named `JWT_SECRET`.

The frontend calls `/api/login` and `/api/validate`, so the backend works locally with `vercel dev` and globally after Vercel deployment.