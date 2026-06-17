# NayePankh Frontend

Simple React frontend for the NayePankh volunteer platform.

## Stack

- Vite
- React
- React Router
- Axios
- Tailwind CSS

## Run Locally

Start the backend first on port `5000`, then run:

```bash
npm install
npm run dev
```

Open:

```text
http://127.0.0.1:5173
```

During local development, Vite proxies `/api` requests to:

```text
http://localhost:5000
```

## API URL For Deployment

When deploying the frontend, set this environment variable to your deployed backend URL:

```text
VITE_API_URL=https://your-render-backend-url.com/api
```

## Pages

- `/` - Home
- `/programs` - Program list and apply button
- `/login` - Login
- `/register` - Register
- `/volunteer/dashboard` - Volunteer profile and applications
- `/admin/dashboard` - Admin stats, volunteers, programs, applications

## Useful Commands

```bash
npm run lint
npm run build
```
